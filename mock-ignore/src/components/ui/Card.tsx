import React from 'react'
import { theme } from '../../styles/theme'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
  shadow?: 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
  onClick?: () => void
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'md',
  hover = false,
  onClick,
  ...props
}) => {
  const getPaddingStyles = () => {
    switch (padding) {
      case 'sm':
        return theme.spacing[4]
      case 'md':
        return theme.spacing[6]
      case 'lg':
        return theme.spacing[8]
      default:
        return theme.spacing[6]
    }
  }

  const getShadowStyles = () => {
    switch (shadow) {
      case 'sm':
        return theme.shadows.sm
      case 'md':
        return theme.shadows.md
      case 'lg':
        return theme.shadows.lg
      case 'xl':
        return theme.shadows.xl
      default:
        return theme.shadows.md
    }
  }

  const baseStyles: React.CSSProperties = {
    background: theme.colors.background.card,
    borderRadius: theme.radii.xl,
    padding: getPaddingStyles(),
    boxShadow: getShadowStyles(),
    transition: theme.transitions.normal,
    cursor: onClick ? 'pointer' : 'default',
  }

  const hoverClass = hover ? 'card-hover' : ''

  return (
    <div
      style={baseStyles}
      className={`${hoverClass} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card