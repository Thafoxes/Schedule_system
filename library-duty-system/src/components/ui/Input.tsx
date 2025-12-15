import React, { forwardRef, useState } from 'react'
import { theme } from '../../styles/theme'
import 'bootstrap-icons/font/bootstrap-icons.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  fullWidth?: boolean
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  showPasswordStrength? : boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  fullWidth = false,
  startIcon,
  endIcon,
  className = '',
  showPasswordStrength = false,
  type,
  value,
  ...props
}, ref) => {

  const [showPassword, setShowPassword] = useState(false)

  //Password strength calculation
  const getPasswordStrength = (password: string) : {
    score: number; 
    label: string;
    color: string
  }=>{
    if (!password) return { score: 0, label: '', color: ''}

    let score = 0
    if (password.length >= 6) score ++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    const strength = [
      { score: 0, label: '', color: '' },
      { score: 1, label: 'Very Weak', color: '#e53e3e' },
      { score: 2, label: 'Weak', color: '#f56565' },
      { score: 3, label: 'Fair', color: '#ed8936' },
      { score: 4, label: 'Good', color: '#38a169' },
      { score: 5, label: 'Strong', color: '#25855a' },
    ]

    return strength[score] || strength[0]
  }

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
    paddingRight: (endIcon || type === 'password') ? theme.spacing[12] : theme.spacing[4],
    boxSizing: 'border-box', // ← Important for proper sizing
    textAlign: 'left',

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
    pointerEvents: type === 'password' ? 'auto' : 'none',
    cursor: type === 'password' ? 'pointer' : 'default',
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

  const strength = showPasswordStrength && type === 'password'? getPasswordStrength(value as string || '') : null


  return (
    <div style={ {
      width: fullWidth? '100%' : 'auto'
    }}>
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
          type = {
            type === 'password' && showPassword? 'text' : type
          }
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
          value={value}
          {...props}
        />
        {(endIcon || type === 'password') && (
          <div 
          style={endIconStyles}
          onClick={type === 'password' ? () => setShowPassword(!showPassword) : undefined}
          >
            {type === 'password'? (
              <i className={showPassword ?  'bi bi-eye-slash-fill': 'bi bi-eye-fill'}
              onMouseEnter={ (e) => {
                e.currentTarget.style.color = theme.colors.primary[500]
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme.colors.gray[500]
              }}
              />
            ): endIcon}
          </div>
        )}
      </div>
      {/* show Password Strength Indicator */}
      {showPasswordStrength && type === 'password' && value && strength && (
        <div style={{marginTop : theme.spacing[1]}}>
          <div style = {
            {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '4px'
            }
          }>
            <span style={{ fontSize: theme.fontSizes.xs, color: strength.color }}>
              {strength.label}
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '4px',
            background: theme.colors.gray[200],
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
              <div style={{
              width: `${(strength.score / 5) * 100}%`,
              height: '100%',
              background: strength.color,
              transition: 'all 0.3s ease'
              }} />
            </div>
        </div>
      )}
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