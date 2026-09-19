'use client';

import type { InputHTMLAttributes, ReactNode } from 'react';

const choiceControlBase =
  'mt-[3px] h-4 w-4 shrink-0 cursor-pointer accent-clox-orange';

function joinClassNames(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(' ');
}

/** Native checkbox aligned to the first line of its label. */
export function ChoiceCheckbox({
  className,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  return (
    <input
      {...props}
      type="checkbox"
      className={joinClassNames(choiceControlBase, className)}
    />
  );
}

/** Native radio aligned to the first line of its label. */
export function ChoiceRadio({
  className,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  return (
    <input
      {...props}
      type="radio"
      className={joinClassNames(choiceControlBase, className)}
    />
  );
}

/** Standard option row: control + label text (single or multi-line). */
export function ChoiceRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <label
      className={joinClassNames(
        'flex cursor-pointer items-start gap-3 text-sm leading-snug text-slate-600',
        className,
      )}
    >
      {children}
    </label>
  );
}

/** Bordered selectable card (e.g. investor classifications). */
export function ChoiceCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <label
      className={joinClassNames(
        'block cursor-pointer rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4',
        className,
      )}
    >
      <div className="flex items-start gap-3">{children}</div>
    </label>
  );
}

/** Radio option inside a bordered strip. */
export function ChoiceOption({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <label
      className={joinClassNames(
        'flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm leading-snug text-slate-700',
        className,
      )}
    >
      {children}
    </label>
  );
}
