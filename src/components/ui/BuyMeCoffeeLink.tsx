import { useI18n } from '@/i18n';

export function BuyMeCoffeeLink({ variant = 'footer' }: { variant?: 'footer' | 'footer-link' | 'inline' }) {
  const href = 'https://buymeacoffee.com/jjmacagnan';
  const { t } = useI18n();

  if (variant === 'inline') {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 underline">
        {t('footer.buyMeCoffee')}
      </a>
    );
  }

  if (variant === 'footer-link') {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-[family-name:var(--font-share-tech-mono)] text-ui-sm uppercase tracking-[2px] text-[var(--pt-text-dim)] transition-colors hover:text-[var(--pt-gold)]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18 3H5a1 1 0 0 0-1 1v9a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V8a3 3 0 0 0-2-2.83V4a1 1 0 0 0-1-1zM18 9h1a1 1 0 1 1 0 2h-1V9zM5 5h12v2H5V5z" />
        </svg>
        {t('footer.buyMeCoffee')}
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-fit items-center gap-2 rounded-none border border-[var(--pt-gold)] bg-[rgba(255,215,0,0.08)] px-3 py-1.5 text-sm text-[var(--pt-gold)] transition-colors hover:border-yellow-500/30 hover:text-yellow-400 font-[family-name:var(--font-share-tech-mono)]"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18 3H5a1 1 0 0 0-1 1v9a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V8a3 3 0 0 0-2-2.83V4a1 1 0 0 0-1-1zM18 9h1a1 1 0 1 1 0 2h-1V9zM5 5h12v2H5V5z" />
      </svg>
      {t('footer.buyMeCoffee')}
    </a>
  );
}
