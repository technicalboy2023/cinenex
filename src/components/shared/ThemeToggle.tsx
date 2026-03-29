'use client';
import { useTheme } from './ThemeProvider';

const icons = {
  dark: '🌙',
  light: '☀️',
  system: '💻',
};
const labels = {
  dark: 'Dark',
  light: 'Light',
  system: 'System',
};
const cycle: Array<'dark' | 'light' | 'system'> = ['dark', 'light', 'system'];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const next = () => {
    const idx = cycle.indexOf(theme as any);
    const nextTheme = cycle[(idx + 1) % cycle.length];
    setTheme(nextTheme);
  };

  return (
    <button
      id="theme-toggle"
      onClick={next}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border
                 text-foreground text-sm font-medium
                 hover:bg-card-hover hover:border-border-hover
                 transition-all duration-300"
      aria-label={`Theme: ${labels[theme]}. Click to cycle.`}
      title={`Theme: ${labels[theme]}`}
    >
      <span className="text-base">{icons[theme]}</span>
      <span className="hidden sm:inline">{labels[theme]}</span>
    </button>
  );
}
