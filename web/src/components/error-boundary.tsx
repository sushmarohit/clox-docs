import { Component, type ErrorInfo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  children: ReactNode;
  title?: string;
};

type State = {
  error: Error | null;
};

function ErrorFallback({
  title,
  onRetry,
  homeHref = '/',
}: {
  title?: string;
  onRetry: () => void;
  homeHref?: string;
}) {
  const { t } = useTranslation('common');
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-clox-navy px-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-clox-orange">
          {t('brand')}
        </p>
        <h1 className="mt-4 text-2xl font-bold">{title ?? t('errorTitle')}</h1>
        <p className="mt-3 text-sm text-white/70">{t('errorBody')}</p>
        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            className="rounded-full bg-clox-orange px-4 py-2.5 text-sm font-semibold text-white"
            onClick={onRetry}
          >
            {t('tryAgain')}
          </button>
          <a
            href={homeHref}
            className="rounded-full border border-white/30 px-4 py-2.5 text-sm font-semibold text-white"
          >
            {t('backHome')}
          </a>
        </div>
      </div>
    </main>
  );
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('UI error boundary', error, info.componentStack);
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <ErrorFallback
        title={this.props.title}
        onRetry={() => this.setState({ error: null })}
      />
    );
  }
}
