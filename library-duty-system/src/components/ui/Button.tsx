import React from 'react'
import { theme } from '../../styles/theme'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  disabled?: boolean
  loading?: boolean
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: theme.colors.primary[500],
          color: theme.colors.white,
          border: 'none',
          boxShadow: '0 0 0 0 rgba(56, 178, 172, 0.5)',
        }
      case 'secondary':
        return {
          background: theme.colors.secondary[500],
          color: theme.colors.white,
          border: 'none',
        }
      case 'outline':
        return {
          background: 'transparent',
          color: theme.colors.primary[500],
          border: `2px solid ${theme.colors.primary[500]}`,
        }
      case 'ghost':
        return {
          background: 'transparent',
          color: theme.colors.primary[500],
          border: 'none',
        }
      default:
        return {}
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
          fontSize: theme.fontSizes.sm,
        }
      case 'md':
        return {
          padding: `${theme.spacing[3]} ${theme.spacing[6]}`,
          fontSize: theme.fontSizes.md,
        }
      case 'lg':
        return {
          padding: `${theme.spacing[4]} ${theme.spacing[8]}`,
          fontSize: theme.fontSizes.lg,
        }
      default:
        return {}
    }
  }

  const baseStyles: React.CSSProperties = {
    borderRadius: theme.radii.lg,
    fontWeight: theme.fontWeights.medium,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: theme.transitions.normal,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[2],
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled || loading ? 0.6 : 1,
    fontFamily: theme.fonts.body,
    outline: 'none',
    ...getVariantStyles(),
    ...getSizeStyles(),
  }

  return (
    <button
      type={type}
      style={baseStyles}
      className={`${variant === 'primary' ? 'button-pulse' : ''} ${className}`}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
      {!loading && children}
    </button>
  )
}

export default Button