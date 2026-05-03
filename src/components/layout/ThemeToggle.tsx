import { useTheme } from '@/theme/ThemeProvider'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle color theme">
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}

export default ThemeToggle
