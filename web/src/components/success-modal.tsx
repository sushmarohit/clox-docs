'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

type SuccessModalProps = {
  open: boolean;
  title: string;
  body: string;
  onClose: () => void;
};

export function SuccessModal({ open, title, body, onClose }: SuccessModalProps) {
  const { t } = useTranslation('common');

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label={t('close')}
        className="absolute inset-0 bg-clox-navy/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-modal-title"
        aria-describedby="success-modal-body"
        className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl sm:p-8"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden
          >
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2
          id="success-modal-title"
          className="mt-4 text-xl font-bold text-clox-navy sm:text-2xl"
        >
          {title}
        </h2>
        <p id="success-modal-body" className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
          {body}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-clox-navy py-3 text-sm font-bold text-white shadow sm:text-base"
        >
          {t('gotIt')}
        </button>
      </div>
    </div>,
    document.body,
  );
}
