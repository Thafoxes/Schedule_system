import React, {useState} from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import { loginSchema, LoginFormData } from '../../utils/validationSchemas'
import { Input, Button, Toast} from '../ui'
import { theme } from '../../styles/theme'

interface LoginFormProps{
    role: 'student' | 'teacher' | 'admin'
    onSubmit: (data: LoginFormData) => void
    loading? : boolean
    customColor? :string
}

const LoginForm: React.FC<LoginFormProps> = ({
    role,
    onSubmit,
    loading = false,
    customColor
}) => {

    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
        show: false,
        message: '',
        type: 'success'
    })

    const { register, handleSubmit, formState: {errors}, watch} = 
    useForm<LoginFormData>({
        resolver : zodResolver(loginSchema),
        defaultValues:{
            email: '',
            password: '',
            rememberMe: false
        }
    })

    const handleFormSubmit = (data: LoginFormData) => {
    // Show loading feedback
    setToast({
        show: true,
        message: 'Validating credentials...',
        type: 'success'
    })
    
    onSubmit(data)
    }

    const watchedPassword = watch('password')

    const getRoleEmailPlaceholder = () => {
        switch(role) {
            case 'student': return 'student@gradute.utm.my'
            case 'teacher': return 'teacher@gradute.utm.my'
            case 'admin': return 'admin_admin@gradute.utm.my'
            default: return 'student@graduate.utm.my'
        }
    }

    const checkboxStyles: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing[2],
        marginBottom: theme.spacing[4],
        fontSize: theme.fontSizes.sm,
        color: theme.colors.text.secondary,
    }

    const checkboxInputStyles: React.CSSProperties = {
        width: '18px',
        height: '18px',
        accentColor: customColor || theme.colors.primary[500],
        cursor: 'pointer',
    }

    const linksContainerStyles: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing[2],
        marginTop: theme.spacing[4],
        textAlign: 'center',
    }

    const linkStyles: React.CSSProperties = {
        color: customColor || theme.colors.primary[500],
        textDecoration: 'none',
        fontSize: theme.fontSizes.sm,
        fontWeight: theme.fontWeights.medium,
        transition: 'opacity 0.2s ease',
    }

    return (
        <>
         <form onSubmit={handleSubmit(handleFormSubmit)}>
            {/* Email Field */}
             <div style={{ marginBottom: theme.spacing[4] }}>
                <Input
                {...register('email')}
                label={`${role.charAt(0).toUpperCase() + role.slice(1)} Email`}
                placeholder={getRoleEmailPlaceholder()}
                type="email"
                fullWidth
                error={errors.email?.message}
                startIcon={<i className="bi bi-envelope" style={{ fontSize: '1rem' }} />}
                />
             </div>
             {/* Password Field */}
            <div style={{ marginBottom: theme.spacing[4] }}>
                <Input
                {...register('password')}
                label="Password"
                placeholder="Enter your password"
                type="password"
                fullWidth
                error={errors.password?.message}
                startIcon={<i className="bi bi-lock" style={{ fontSize: '1rem' }} />}
                showPasswordStrength={role === 'admin'} // Show strength for admin only
                value={watchedPassword}
                />
            </div>

            {/* Remember Me Checkbox */}
            <label style={checkboxStyles}>
                <input
                {...register('rememberMe')}
                type="checkbox"
                style={checkboxInputStyles}
                />
            <span>Remember me for 30 days</span>
            </label>

            {/* Submit Button */}
            <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
                customColor={customColor}
                style={{ marginBottom: theme.spacing[4] }}
            >
                <i className="bi bi-box-arrow-in-right" style={{ marginRight: '0.5rem' }} />
                Login as {role.charAt(0).toUpperCase() + role.slice(1)}
            </Button>

            {/* Links Container */}
            <div style={linksContainerStyles}>
                <a
                href="#forgot-password"
                style={linkStyles}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8' }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
                >
                <i className="bi bi-question-circle" style={{ marginRight: '0.25rem' }} />
                Forgot your password?
                </a>

                <div style={{ fontSize: theme.fontSizes.sm, color: theme.colors.text.light }}>
                New to the system?{' '}
                <a
                    href="#register"
                    style={linkStyles}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8' }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
                >
                    Register here
                </a>
                </div>
            </div>
         </form>
        {
            toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    show={toast.show}
                    onClose={() => setToast(prev => ({ ...prev, show: false }))}
                />
            )
        }
         </>
        

    )

    
}

export default LoginForm