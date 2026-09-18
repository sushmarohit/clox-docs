/** Scroll/focus the first invalid field for multi-step and lead forms. */
export function focusFirstFormError(
  errors: Record<string, string | undefined>,
  order: readonly string[],
) {
  const first = order.find((key) => errors[key]);
  if (!first) return;
  const el = document.querySelector<HTMLElement>(
    `[name="${first}"], [data-error-field="${first}"]`,
  );
  el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  if (el instanceof HTMLElement) {
    const focusable =
      el.matches('input, select, textarea, button')
        ? el
        : el.querySelector<HTMLElement>('input, select, textarea, button');
    focusable?.focus();
  }
}
