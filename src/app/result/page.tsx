'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ResultCard from '@/components/ResultCard';
import { ScoreResult } from '@/lib/scoring';
import { AdSlot } from '@/components/AdSlot';
import { CAP_KEYS, isCapOn, setCap } from '@/lib/ads';
import { useAnalytics } from '@/hooks/useAnalytics';

const SLOT_RESULT_BOTTOM = process.env.NEXT_PUBLIC_ADSENSE_SLOT_RESULT_BOTTOM;
const SLOT_RESULT_ASIDE = process.env.NEXT_PUBLIC_ADSENSE_SLOT_RESULT_ASIDE;

function ResultInner() {
  const params = useSearchParams();
  const { track } = useAnalytics();
  const [result, setResult] = useState<ScoreResult | null>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('last_quiz_result');
      if (saved) setResult(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    if (!isCapOn(CAP_KEYS.RESULT_BOTTOM)) {
      setCap(CAP_KEYS.RESULT_BOTTOM);
      track('ad_result_bottom_shown', {});
    }
    if (!isCapOn(CAP_KEYS.RESULT_ASIDE)) {
      setCap(CAP_KEYS.RESULT_ASIDE);
      track('ad_result_aside_shown', {});
    }
  }, [track]);

  const typeKey = params.get('k') || result?.typeKey || '';

  return (
    <main style={{ padding: '24px 0' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>診断結果</h1>
        {result ? (
          <ResultCard result={result} />
        ) : (
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 16, marginBottom: 4 }}>タイプキー: {typeKey || '(不明)'}</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>クイズから結果の詳細が見つかりませんでした。/quiz から診断してください。</div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
          <section>
            <h2 style={{ fontSize: 14, color: '#475569', marginBottom: 8 }}>広告（ボトム）</h2>
            <AdSlot id="result-bottom" slot={SLOT_RESULT_BOTTOM} />
          </section>
          <aside>
            <h2 style={{ fontSize: 14, color: '#475569', marginBottom: 8 }}>広告（サイド）</h2>
            <AdSlot id="result-aside" slot={SLOT_RESULT_ASIDE} />
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<main style={{ padding: '24px 0' }}><div style={{ maxWidth: 960, margin: '0 auto', padding: '0 16px' }}>読み込み中…</div></main>}>
      <ResultInner />
    </Suspense>
  );
}


