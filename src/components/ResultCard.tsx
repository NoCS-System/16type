'use client';

import React, { useMemo } from 'react';
import { ScoreResult } from '@/lib/scoring';
import { getTypeDisplayName } from '@/data/typeNames';
import { getTypeMeta } from '@/data/typeMeta';

export default function ResultCard({ result }: { result: ScoreResult }) {
  const typeName = getTypeDisplayName(result.typeKey);
  const xShareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const origin = window.location.origin || '';
    const url = `${origin}/result?k=${encodeURIComponent(result.typeKey)}`;
    const text = `16type 診断: ${typeName}（${result.typeKey}）`;
    const hashtags = '16type';
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtags)}`;
  }, [result.typeKey, typeName]);

  const imageFile = useMemo(() => {
    // ファイル名は "P-S-R-P.png" のようにハイフン連結、最後は Pn→P / A は A
    const a = result.axisDecision.P_or_C;
    const b = result.axisDecision.S_or_T;
    const c = result.axisDecision.R_or_U;
    const d = result.axisDecision.Pn_or_A === 'Pn' ? 'P' : 'A';
    return `/characters/${a}-${b}-${c}-${d}.png`;
  }, [result.axisDecision]);

  const pcTotal = result.axisCounts.product_vs_code.P + result.axisCounts.product_vs_code.C || 1;
  const stTotal = result.axisCounts.solo_vs_team.S + result.axisCounts.solo_vs_team.T || 1;
  const ruTotal = result.axisCounts.research_vs_utility.R + result.axisCounts.research_vs_utility.U || 1;
  const paTotal = result.axisCounts.plan_vs_action.Pn + result.axisCounts.plan_vs_action.A || 1;

  const pct = (n: number, d: number) => Math.round((n / d) * 100);

  const chips = useMemo(
    () => [
      {
        label: 'P vs C',
        left: { label: 'P', value: pct(result.axisCounts.product_vs_code.P, pcTotal) },
        right: { label: 'C', value: pct(result.axisCounts.product_vs_code.C, pcTotal) },
      },
      {
        label: 'S vs T',
        left: { label: 'S', value: pct(result.axisCounts.solo_vs_team.S, stTotal) },
        right: { label: 'T', value: pct(result.axisCounts.solo_vs_team.T, stTotal) },
      },
      {
        label: 'R vs U',
        left: { label: 'R', value: pct(result.axisCounts.research_vs_utility.R, ruTotal) },
        right: { label: 'U', value: pct(result.axisCounts.research_vs_utility.U, ruTotal) },
      },
      {
        label: 'Pn vs A',
        left: { label: 'Pn', value: pct(result.axisCounts.plan_vs_action.Pn, paTotal) },
        right: { label: 'A', value: pct(result.axisCounts.plan_vs_action.A, paTotal) },
      },
    ],
    [result, pcTotal, stTotal, ruTotal, paTotal]
  );

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <img
          src={imageFile}
          alt={`${getTypeDisplayName(result.typeKey)} のイメージ`}
          style={{ width: 'min(420px, 100%)', height: 'auto', borderRadius: 12, border: '1px solid #e5e7eb', background: '#fff' }}
          onError={(e) => {
            // 画像が見つからない場合は非表示
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
      <div style={{ fontSize: 14, color: '#475569', marginBottom: 4 }}>あなたのタイプ</div>
      <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>{typeName}</div>
      <div style={{ fontSize: 14, color: '#64748b', marginBottom: 12 }}>{result.typeKey}</div>
      {(() => {
        const meta = getTypeMeta(result.typeKey);
        if (!meta) return null;
        return (
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, marginBottom: 16, background: '#fafafa' }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{meta.copy}</div>
            <div style={{ fontSize: 13, color: '#475569', marginBottom: 6 }}>{meta.persona}</div>
            <div style={{ fontSize: 13, color: '#111827', marginBottom: 6 }}>{meta.quote}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>得意フェーズ：{meta.forte}</div>
          </div>
        );
      })()}

      {(() => {
        const meta = getTypeMeta(result.typeKey);
        if (!meta?.details) return null;
        return (
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 14, marginBottom: 16, background: '#ffffff' }}>
            <div style={{ fontSize: 13, lineHeight: 1.9, color: '#0f172a', whiteSpace: 'pre-wrap' }}>
              {meta.details}
            </div>
          </div>
        );
      })()}

      {/* X 共有ボタン */}
      {!!xShareUrl && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <a
            href={xShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Xで結果を共有する"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              borderRadius: 999,
              background: '#0f1419',
              color: '#ffffff',
              textDecoration: 'none',
              fontWeight: 700,
              border: '1px solid #111827',
            }}
          >
            <span style={{
              display: 'inline-block',
              width: 16,
              height: 16,
              background: '#ffffff',
              color: '#0f1419',
              borderRadius: 3,
              fontSize: 12,
              lineHeight: '16px',
              textAlign: 'center',
              fontWeight: 900,
            }}>X</span>
            Xで共有
          </a>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginBottom: 16 }}>
        {chips.map((c) => (
          <div key={c.label} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: '#64748b', width: 68 }}>{c.label}</div>
            <span style={{ padding: '6px 10px', background: '#eef2ff', borderRadius: 999, fontSize: 12 }}>
              {c.left.label}: {c.left.value}%
            </span>
            <span style={{ padding: '6px 10px', background: '#f1f5f9', borderRadius: 999, fontSize: 12 }}>
              {c.right.label}: {c.right.value}%
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
        <div style={{ fontSize: 13, color: '#475569' }}>Overall confidence</div>
        <div style={{ fontSize: 22, fontWeight: 800 }}>{result.confidenceOverallPercent}%</div>
      </div>
      <div style={{ fontSize: 12, color: '#64748b' }}>
        これは自己申告に基づく簡易診断であり、心理測定ではありません。
      </div>
    </div>
  );
}


