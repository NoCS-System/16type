import { QUESTIONS, AxisCode } from '@/data/questions';

export type AnswerMap = Record<string, boolean | undefined>;

export interface AxisCounts {
  product_vs_code: { P: number; C: number };
  solo_vs_team: { S: number; T: number };
  research_vs_utility: { R: number; U: number };
  plan_vs_action: { Pn: number; A: number };
}

export interface AxisDecision {
  P_or_C: 'P' | 'C';
  S_or_T: 'S' | 'T';
  R_or_U: 'R' | 'U';
  Pn_or_A: 'Pn' | 'A';
}

export interface AxisConfidence {
  product_vs_code: number; // 0..1
  solo_vs_team: number; // 0..1
  research_vs_utility: number; // 0..1
  plan_vs_action: number; // 0..1
}

export interface ScoreResult {
  typeKey: string; // e.g., "P S R Pn" condensed to 'PSRPn' (no spaces)
  axisDecision: AxisDecision;
  axisConfidence: AxisConfidence;
  confidenceOverallPercent: number; // 0..100
  axisCounts: AxisCounts;
}

const DEFAULT_TIE_SIDE: Record<AxisCode, string> = {
  product_vs_code: 'C',
  solo_vs_team: 'S',
  research_vs_utility: 'U',
  plan_vs_action: 'A',
};

export function scoreAnswers(answers: AnswerMap): ScoreResult {
  const counts: AxisCounts = {
    product_vs_code: { P: 0, C: 0 },
    solo_vs_team: { S: 0, T: 0 },
    research_vs_utility: { R: 0, U: 0 },
    plan_vs_action: { Pn: 0, A: 0 },
  };

  for (const q of QUESTIONS) {
    const a = answers[q.id];
    if (a === undefined) continue;
    const yesSide = q.yesSide;
    const noSide = getOppositeSide(q.axis, yesSide);
    const sideToInc = a ? yesSide : (noSide as any);
    switch (q.axis) {
      case 'product_vs_code':
        if (sideToInc === 'P') counts.product_vs_code.P++;
        else counts.product_vs_code.C++;
        break;
      case 'solo_vs_team':
        if (sideToInc === 'S') counts.solo_vs_team.S++;
        else counts.solo_vs_team.T++;
        break;
      case 'research_vs_utility':
        if (sideToInc === 'R') counts.research_vs_utility.R++;
        else counts.research_vs_utility.U++;
        break;
      case 'plan_vs_action':
        if (sideToInc === 'Pn') counts.plan_vs_action.Pn++;
        else counts.plan_vs_action.A++;
        break;
    }
  }

  const axisDecision: AxisDecision = {
    P_or_C: decidePC(counts.product_vs_code),
    S_or_T: decideST(counts.solo_vs_team),
    R_or_U: decideRU(counts.research_vs_utility),
    Pn_or_A: decidePnA(counts.plan_vs_action),
  };

  const axisConfidence: AxisConfidence = {
    product_vs_code: max(counts.product_vs_code.P, counts.product_vs_code.C) / 5,
    solo_vs_team: max(counts.solo_vs_team.S, counts.solo_vs_team.T) / 5,
    research_vs_utility: max(counts.research_vs_utility.R, counts.research_vs_utility.U) / 5,
    plan_vs_action: max(counts.plan_vs_action.Pn, counts.plan_vs_action.A) / 5,
  };

  const overall = ((axisConfidence.product_vs_code + axisConfidence.solo_vs_team + axisConfidence.research_vs_utility + axisConfidence.plan_vs_action) / 4) * 100;

  const typeKey = `${axisDecision.P_or_C}${axisDecision.S_or_T}${axisDecision.R_or_U}${axisDecision.Pn_or_A}`;

  return {
    typeKey,
    axisDecision,
    axisConfidence,
    confidenceOverallPercent: Math.round(overall),
    axisCounts: counts,
  };
}

function decidePC(c: { P: number; C: number }): 'P' | 'C' {
  if (c.P === c.C) return DEFAULT_TIE_SIDE.product_vs_code as 'C';
  return c.P > c.C ? 'P' : 'C';
}
function decideST(c: { S: number; T: number }): 'S' | 'T' {
  if (c.S === c.T) return DEFAULT_TIE_SIDE.solo_vs_team as 'S';
  return c.S > c.T ? 'S' : 'T';
}
function decideRU(c: { R: number; U: number }): 'R' | 'U' {
  if (c.R === c.U) return DEFAULT_TIE_SIDE.research_vs_utility as 'U';
  return c.R > c.U ? 'R' : 'U';
}
function decidePnA(c: { Pn: number; A: number }): 'Pn' | 'A' {
  if (c.Pn === c.A) return DEFAULT_TIE_SIDE.plan_vs_action as 'A';
  return c.Pn > c.A ? 'Pn' : 'A';
}

function getOppositeSide(axis: AxisCode, side: string): string {
  switch (axis) {
    case 'product_vs_code':
      return side === 'P' ? 'C' : 'P';
    case 'solo_vs_team':
      return side === 'S' ? 'T' : 'S';
    case 'research_vs_utility':
      return side === 'R' ? 'U' : 'R';
    case 'plan_vs_action':
      return side === 'Pn' ? 'A' : 'Pn';
  }
}

function max(a: number, b: number) {
  return a > b ? a : b;
}


