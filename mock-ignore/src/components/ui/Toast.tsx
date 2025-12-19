import React, { useEffect, useState } from 'react'
import { theme } from '../../styles/theme'

export interface ToastProps{
    message: string
    type?: 'success' | 'error' | 'warning' | 'info'
    duration?: number
    onClose?: () => void
    show: boolean
}

const Toast: React.FC<ToastProps> = ({
    message,
    type = 'info',
    duration = 4000,
    onClose,
    show
}) => {
    const[isVisible, setIsVisible] = useState(show)

    useEffect(() => {
        setIsVisible(show)

        if (show && duration > 0){
            const timer = setTimeout( () => {
                setIsVisible(false)
                onClose?.()
            }, duration)

            return () => clearTimeout(timer)
        }
    }, [show, duration, onClose])

    const getToastStyles = (): React.CSSProperties => {
        const baseStyles: React.CSSProperties = {
            position: 'fixed',
            top: '20px',
            right: '20px',
            minWidth: '300px',
            maxWidth: '500px',
            padding: theme.spacing[4],
            borderRadius: theme.radii.lg,
            boxShadow: theme.shadows.lg,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing[3],
            fontSize: theme.fontSizes.sm,
            fontWeight: theme.fontWeights.medium,
            zIndex: 9999,
            transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.3s ease-in-out',
            backdropFilter: 'blur(10px)',
        }

        switch(type){
            case 'success':
                return {
                ...baseStyles,
                backgroundColor: 'rgba(72, 187, 120, 0.95)',
                color: 'white',
                border: `1px solid ${theme.colors.status.success}`,
                }
            case 'error':
                return {
                ...baseStyles,
                backgroundColor: 'rgba(229, 62, 62, 0.95)',
                color: 'white',
                border: `1px solid ${theme.colors.status.error}`,
                }
            case 'warning':
                return {
                ...baseStyles,
                backgroundColor: 'rgba(214, 158, 46, 0.95)',
                color: 'white',
                border: `1px solid ${theme.colors.status.warning}`,
                }
            default:
                return {
                ...baseStyles,
                backgroundColor: 'rgba(49, 130, 206, 0.95)',
                color: 'white',
                border: `1px solid ${theme.colors.status.info}`,
                }
        }
    }

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <i className="bi bi-check-circle-fill" />
            case 'error':
                return <i className="bi bi-x-circle-fill" />
            case 'warning':
                return <i className="bi bi-exclamation-triangle-fill" />
            default:
                return <i className="bi bi-info-circle-fill" />
        }
    }

    if (!isVisible && !show) return null

    return (
        <div style={getToastStyles()}>
            {getIcon()}
            <span style={{flex: 1}}>{message}</span>
            <button 
            onClick={() => {
                setIsVisible(false)
                onClose?.()
            }}
            style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                fontSize: '1.1rem',
                padding: '0',
                opacity: 0.7,
                transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7' }}
            >
                <i className="bi bi-x" />
            </button>
        </div>
    )
}

export default Toast