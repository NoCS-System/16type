'use client';

import React, { useEffect, useRef } from 'react';

type Mode = 'inline' | 'modal';

export interface AdSlotProps {
  id: string;
  mode?: Mode;
  slot?: string | undefined;
  onImpression?: () => void;
  onClose?: () => void; // modal時のクローズ制御
  className?: string;
}

function FocusTrap({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  const startRef = useRef<HTMLButtonElement | null>(null);
  const endRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prevActive = document.activeElement as HTMLElement | null;
    startRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      prevActive?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="広告"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)',
        padding: 16,
      }}
      onClick={(e) => {
        if (e.target === containerRef.current) onClose();
      }}
    >
      <div
        style={{
          background: '#fff',
          width: 'min(560px, 92vw)',
          maxHeight: '90vh',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            aria-label="閉じる"
            onClick={onClose}
            style={{
              lineHeight: 1,
              padding: 12,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: 18,
            }}
          >
            ×
          </button>
        </div>
        <button ref={startRef} style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }} aria-hidden />
        <div style={{ padding: 16 }}>{children}</div>
        <button ref={endRef} style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }} aria-hidden onFocus={() => startRef.current?.focus()} />
      </div>
    </div>
  );
}

export const AdSlot: React.FC<AdSlotProps> = ({ id, mode = 'inline', slot, onImpression, onClose, className }) => {
  const shownRef = useRef(false);

  // 「環境変数が未設定ならスケルトンだけ」
  const adsEnabled = !!slot;

  useEffect(() => {
    if (shownRef.current) return;
    // 簡易インプレッション発火（実運用はIntersectionObserver等に置換）
    const t = setTimeout(() => {
      shownRef.current = true;
      onImpression?.();
    }, 300);
    return () => clearTimeout(t);
  }, [onImpression]);

  const content = (
    <div
      id={`ad-${id}`}
      className={className}
      style={{
        width: '100%',
        minHeight: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: adsEnabled ? '#f8fafc' : 'linear-gradient(90deg,#eee 25%,#ddd 37%,#eee 63%)',
        backgroundSize: '400% 100%',
        animation: adsEnabled ? undefined : 'ad-skeleton 1.2s ease-in-out infinite',
        borderRadius: 8,
        border: '1px solid #e5e7eb',
      }}
    >
      {adsEnabled ? (
        <div style={{ fontSize: 12, color: '#475569' }}>Ad slot: {slot}</div>
      ) : (
        <div style={{ fontSize: 12, color: '#64748b' }}>広告プレースホルダー</div>
      )}
      <style>
        {`@keyframes ad-skeleton {
          0% { background-position: 100% 50%; }
          100% { background-position: 0 50%; }
        }`}
      </style>
    </div>
  );

  if (mode === 'modal') {
    return <FocusTrap onClose={() => onClose?.()}>{content}</FocusTrap>;
  }
  return content;
};

export default AdSlot;


