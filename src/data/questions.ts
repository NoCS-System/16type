export type AxisCode = 'product_vs_code' | 'solo_vs_team' | 'research_vs_utility' | 'plan_vs_action';

export type AxisSide =
  | 'P' // product
  | 'C' // code
  | 'S' // solo
  | 'T' // team
  | 'R' // research
  | 'U' // utility
  | 'Pn' // plan
  | 'A'; // action

export interface QuizQuestion {
  id: string;
  axis: AxisCode;
  yesSide: 'P' | 'C' | 'S' | 'T' | 'R' | 'U' | 'Pn' | 'A';
  text: string;
}

export const QUESTIONS: QuizQuestion[] = [
  // Axis A: product_vs_code (P vs C)
  { id: 'pvsc_q1', axis: 'product_vs_code', yesSide: 'P', text: '作る前に、どんな体験にしたいか言葉にしてから動きたい。' },
  { id: 'pvsc_q2', axis: 'product_vs_code', yesSide: 'C', text: 'まずはサッと動く試作品を作って、触りながら決めたい。' },
  { id: 'pvsc_q3', axis: 'product_vs_code', yesSide: 'P', text: '使う人の流れや目的を図やメモにまとめてから作りたい。' },
  { id: 'pvsc_q4', axis: 'product_vs_code', yesSide: 'C', text: '細かいことは後回し。まず触れるたたき台があると話が早い。' },
  { id: 'pvsc_q5', axis: 'product_vs_code', yesSide: 'P', text: 'ボタンの言葉や画面の流れを丁寧に考えるのは大事だ。' },

  // Axis B: solo_vs_team (S vs T)
  { id: 'svst_q1', axis: 'solo_vs_team', yesSide: 'S', text: '一人で黙々と進めるほうが仕上がりが良くなる。' },
  { id: 'svst_q2', axis: 'solo_vs_team', yesSide: 'T', text: '誰かに見てもらったり一緒に作ると、学びも品質も上がる。' },
  { id: 'svst_q3', axis: 'solo_vs_team', yesSide: 'S', text: '考えるところから公開まで、自分で完結させたい。' },
  { id: 'svst_q4', axis: 'solo_vs_team', yesSide: 'T', text: '人と話しながら考えると、良い答えにたどり着きやすい。' },
  { id: 'svst_q5', axis: 'solo_vs_team', yesSide: 'S', text: '人に合わせるより、自分のペースで進めたい。' },

  // Axis C: research_vs_utility (R vs U)
  { id: 'rvsu_q1', axis: 'research_vs_utility', yesSide: 'R', text: '新しいやり方を試すのが楽しい。' },
  { id: 'rvsu_q2', axis: 'research_vs_utility', yesSide: 'U', text: 'よく使われる安定したやり方で確実に届けたい。' },
  { id: 'rvsu_q3', axis: 'research_vs_utility', yesSide: 'R', text: '決まりきった方法より、未知の方法に惹かれる。' },
  { id: 'rvsu_q4', axis: 'research_vs_utility', yesSide: 'U', text: '実績や扱いやすさを重視して選びたい。' },
  { id: 'rvsu_q5', axis: 'research_vs_utility', yesSide: 'R', text: '調べて試して、まとめるのが好きだ。' },

  // Axis D: plan_vs_action (Pn vs A)
  { id: 'pvsA_q1', axis: 'plan_vs_action', yesSide: 'Pn', text: '計画や設計を作ってからでないと落ち着かない。' },
  { id: 'pvsA_q2', axis: 'plan_vs_action', yesSide: 'A', text: 'まず動くものを置いてから全体像を固めるほうが早い。' },
  { id: 'pvsA_q3', axis: 'plan_vs_action', yesSide: 'Pn', text: '抜け漏れを洗い出してから手を動かしたい。' },
  { id: 'pvsA_q4', axis: 'plan_vs_action', yesSide: 'A', text: '急ぐときは考えるより手を動かして進める。' },
  { id: 'pvsA_q5', axis: 'plan_vs_action', yesSide: 'Pn', text: '見積もりやリスク整理をきっちりしてから始めたい。' },
];


