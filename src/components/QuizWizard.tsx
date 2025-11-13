'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { QUESTIONS, QuizQuestion } from '@/data/questions';
import { AnswerMap, scoreAnswers, ScoreResult } from '@/lib/scoring';
import { AdSlot } from '@/components/AdSlot';
import { CAP_KEYS, isCapOn, setCap } from '@/lib/ads';
import { useRouter } from 'next/navigation';
import { useAnalytics } from '@/hooks/useAnalytics';

const SLOT_RESULT_INTENT = process.env.NEXT_PUBLIC_ADSENSE_SLOT_RESULT_INTENT;

export default function QuizWizard() {
  const router = useRouter();
  const { track } = useAnalytics();
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [pageIndex, setPageIndex] = useState(0); // 0..3
  const [showModalAd, setShowModalAd] = useState<null | { id: string; slot?: string }>(null);
  const [resultReady, setResultReady] = useState(false);
  const total = QUESTIONS.length; // 20

  const answeredCount = useMemo(() => Object.values(answers).filter(v => v !== undefined).length, [answers]);
  const answeredAll = answeredCount >= total;
  const progressPercent = Math.round((answeredCount / total) * 100);

  const start = pageIndex * 5;
  const end = start + 5;
  const pageQuestions = QUESTIONS.slice(start, end);

  const pageAllAnswered = useMemo(() => {
    return pageQuestions.every(q => answers[q.id] !== undefined);
  }, [answers, pageQuestions]);

  const answer = useCallback((q: QuizQuestion, yes: boolean) => {
    setAnswers(prev => {
      const next = { ...prev, [q.id]: yes };
      const idx = QUESTIONS.findIndex(qq => qq.id === q.id);
      // Mid-roll #1 after Q10 (index 9) once per session
      if (idx === 9 && !isCapOn(CAP_KEYS.MIDROLL_1)) {
        setCap(CAP_KEYS.MIDROLL_1);
        setShowModalAd({ id: 'midroll1', slot: undefined });
        track('ad_midroll1_shown', {});
      }
      return next;
    });
  }, [track]);

  const computeAndPersistResult = useCallback((): ScoreResult => {
    const scored = scoreAnswers(answers);
    try {
      sessionStorage.setItem('last_quiz_result', JSON.stringify(scored));
    } catch {}
    return scored;
  }, [answers]);

  const navigateToResult = useCallback(() => {
    const { typeKey } = computeAndPersistResult();
    router.push(`/result?k=${encodeURIComponent(typeKey)}`);
  }, [computeAndPersistResult, router]);

  const onClickNextPage = useCallback(() => {
    if (!pageAllAnswered) return;
    setPageIndex(i => Math.min(i + 1, 3));
  }, [pageAllAnswered]);

  const onClickPrevPage = useCallback(() => {
    setPageIndex(i => Math.max(i - 1, 0));
  }, []);

  const onResultClick = useCallback(() => {
    if (!answeredAll) return;
    if (!isCapOn(CAP_KEYS.RESULT_INTENT)) {
      setShowModalAd({ id: 'result-intent', slot: SLOT_RESULT_INTENT });
      setResultReady(false);
      setCap(CAP_KEYS.RESULT_INTENT);
      let done = false;
      const enable = () => {
        if (done) return;
        done = true;
        setResultReady(true);
      };
      // フォールバック 1.8s
      setTimeout(enable, 1800);
    } else {
      navigateToResult();
    }
  }, [answeredAll, navigateToResult]);

  const onAdImpression = useCallback(() => {
    setResultReady(true);
    track('ad_result_intent_shown', {});
  }, [track]);

  const closeModalAndContinue = useCallback(() => {
    setShowModalAd(null);
    if (resultReady) {
      navigateToResult();
    } else {
      track('ad_result_intent_skipped', {});
    }
  }, [navigateToResult, resultReady, track]);

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>16type 診断</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ fontSize: 12, color: '#475569' }}>{answeredCount}/{total}</div>
        <div aria-label="進捗" style={{ flex: 1, height: 8, background: '#e5e7eb', borderRadius: 999 }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', background: '#2563eb', borderRadius: 999 }} />
        </div>
      </div>
      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>ページ {pageIndex + 1} / 4（5問ずつ）</div>

      <div style={{ display: 'grid', gap: 12, marginBottom: 16 }}>
        {pageQuestions.map((q, idx) => {
          const val = answers[q.id];
          return (
            <div key={q.id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 12 }}>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>Q{start + idx + 1}/20</div>
              <div style={{ fontSize: 16, marginBottom: 10 }}>{q.text}</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => answer(q, true)}
                  aria-pressed={val === true}
                  style={{
                    padding: '9px 12px',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    background: val === true ? '#2563eb' : '#fff',
                    color: val === true ? '#fff' : '#111827',
                    cursor: 'pointer',
                  }}
                >
                  はい
                </button>
                <button
                  onClick={() => answer(q, false)}
                  aria-pressed={val === false}
                  style={{
                    padding: '9px 12px',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    background: val === false ? '#2563eb' : '#fff',
                    color: val === false ? '#fff' : '#111827',
                    cursor: 'pointer',
                  }}
                >
                  いいえ
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <button
          onClick={onClickPrevPage}
          disabled={pageIndex === 0}
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            background: pageIndex === 0 ? '#f3f4f6' : '#fff',
            color: '#111827',
            cursor: pageIndex === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          戻る
        </button>

        {pageIndex < 3 ? (
          <button
            onClick={onClickNextPage}
            disabled={!pageAllAnswered}
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid #2563eb',
              background: pageAllAnswered ? '#2563eb' : '#93c5fd',
              color: '#fff',
              cursor: pageAllAnswered ? 'pointer' : 'not-allowed',
              fontWeight: 600,
            }}
          >
            次の5問へ
          </button>
        ) : (
          <button
            onClick={onResultClick}
            disabled={!answeredAll}
            style={{
              padding: '14px 20px',
              borderRadius: 12,
              border: '1px solid #1d4ed8',
              background: answeredAll ? 'linear-gradient(180deg,#3b82f6 0%,#1d4ed8 100%)' : '#93c5fd',
              color: '#fff',
              cursor: answeredAll ? 'pointer' : 'not-allowed',
              fontWeight: 700,
              fontSize: 18,
              minWidth: 240,
              boxShadow: answeredAll ? '0 8px 20px rgba(29,78,216,0.35)' : 'none',
              transition: 'transform 120ms ease, box-shadow 120ms ease, background 120ms ease',
            }}
            aria-label="診断結果を表示する"
            onMouseDown={(e) => {
              if (!answeredAll) return;
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(1px)';
            }}
            onMouseUp={(e) => {
              if (!answeredAll) return;
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            }}
          >
            結果を見る
          </button>
        )}
      </div>

      {showModalAd?.id === 'midroll1' && (
        <AdSlot id="midroll1" mode="modal" onClose={() => setShowModalAd(null)} />
      )}

      {showModalAd?.id === 'result-intent' && (
        <AdSlot
          id="result-intent"
          mode="modal"
          slot={SLOT_RESULT_INTENT}
          onImpression={onAdImpression}
          onClose={closeModalAndContinue}
        />
      )}

      {showModalAd?.id === 'result-intent' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{ pointerEvents: 'auto', marginBottom: 24 }}>
            <button
              onClick={closeModalAndContinue}
              disabled={!resultReady}
              style={{
                padding: '16px 24px',
                borderRadius: 14,
                border: resultReady ? '1px solid #059669' : '1px solid #a7f3d0',
                background: resultReady ? 'linear-gradient(180deg,#34d399 0%,#10b981 100%)' : '#a7f3d0',
                color: resultReady ? '#052e2b' : '#064e3b',
                cursor: resultReady ? 'pointer' : 'not-allowed',
                fontWeight: 800,
                fontSize: 18,
                minWidth: 260,
                width: 'min(420px, 92vw)',
                boxShadow: resultReady ? '0 10px 26px rgba(16,185,129,0.35)' : 'none',
                transition: 'transform 120ms ease, box-shadow 120ms ease, background 120ms ease, border-color 120ms ease',
              }}
              aria-label="結果ページへ進む"
              onMouseDown={(e) => {
                if (!resultReady) return;
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(1px)';
              }}
              onMouseUp={(e) => {
                if (!resultReady) return;
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              }}
            >
              結果へ進む
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


