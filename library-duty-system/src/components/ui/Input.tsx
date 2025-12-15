import React, { forwardRef } from 'react'
import { theme } from '../../styles/theme'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  fullWidth?: boolean
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  fullWidth = false,
  startIcon,
  endIcon,
  className = '',
  ...props
}, ref) => {
  const inputStyles: React.CSSProperties = {
    width: fullWidth ? '100%' : 'auto',
    padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
    border: `2px solid ${error ? theme.colors.status.error : theme.colors.gray[300]}`,
    borderRadius: theme.radii.lg,
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.body,
    backgroundColor: theme.colors.white,
    color: theme.colors.text.primary,
    outline: 'none',
    transition: theme.transitions.normal,
    paddingLeft: startIcon ? theme.spacing[12] : theme.spacing[4],
    paddingRight: endIcon ? theme.spacing[12] : theme.spacing[4],
    boxSizing: 'border-box', // ← Important for proper sizing

  }

  const focusStyles: React.CSSProperties = {
    borderColor: theme.colors.primary[500],
    boxShadow: `0 0 0 3px ${theme.colors.primary[100]}`,
  }

  const containerStyles: React.CSSProperties = {
    position: 'relative',
    width: fullWidth ? '100%' : 'auto',
    marginBottom: theme.spacing[1],
  }

  const labelStyles: React.CSSProperties = {
    display: 'block',
    marginBottom: theme.spacing[2],
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.text.primary,
    textAlign: 'left',
    padding: '1px',
  }

  const iconStyles: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    color: theme.colors.gray[400],
    pointerEvents: 'none',
    zIndex: 1,
  }

  const startIconStyles: React.CSSProperties = {
    ...iconStyles,
    left: theme.spacing[4],
  }

  const endIconStyles: React.CSSProperties = {
    ...iconStyles,
    right: theme.spacing[4],
  }

  const errorTextStyles: React.CSSProperties = {
    marginTop: theme.spacing[1],
    fontSize: theme.fontSizes.sm,
    color: theme.colors.status.error,
  }

  const helperTextStyles: React.CSSProperties = {
    marginTop: theme.spacing[1],
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text.light,
  }

  return (
    <div>
      {label && (
        <label style={labelStyles}>
          {label}
        </label>
      )}
      <div style={containerStyles}>
        {startIcon && (
          <div style={startIconStyles}>
            {startIcon}
          </div>
        )}
        <input
          ref={ref}
          style={inputStyles}
          className={className}
          onFocus={(e) => {
            Object.assign(e.target.style, focusStyles)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? theme.colors.status.error : theme.colors.gray[300]
            e.target.style.boxShadow = 'none'
            props.onBlur?.(e)
          }}
          {...props}
        />
        {endIcon && (
          <div style={endIconStyles}>
            {endIcon}
          </div>
        )}
      </div>
      {error && (
        <div style={errorTextStyles}>
          {error}
        </div>
      )}
      {!error && helperText && (
        <div style={helperTextStyles}>
          {helperText}
        </div>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input