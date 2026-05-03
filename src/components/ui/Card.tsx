interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

export function Card({ children, className = '', padding = 'md', hover = false }: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  return (
    <div 
      className={`
        bg-surface border border-border rounded-xl
        ${paddingClasses[padding]}
        ${hover ? 'transition-all duration-200 hover:shadow-lg hover:border-accent/30' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
