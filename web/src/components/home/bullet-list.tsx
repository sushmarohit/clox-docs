export function BulletList({
  items,
  tone = 'dark',
}: {
  items: readonly string[];
  tone?: 'dark' | 'danger' | 'success' | 'light';
}) {
  const mark = tone === 'danger' ? '✕' : '✓';
  const markClass =
    tone === 'danger'
      ? 'text-red-500'
      : tone === 'success'
        ? 'text-emerald-400'
        : 'text-clox-orange';

  return (
    <ul className="mt-6 space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-[1.05rem] font-medium ${
            tone === 'dark'
              ? 'border-transparent bg-transparent text-slate-600'
              : 'border-white/15 bg-black/60 text-white shadow-[0_4px_16px_rgba(0,0,0,0.35)]'
          }`}
        >
          <span className={`mt-0.5 font-black ${markClass}`}>{mark}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
