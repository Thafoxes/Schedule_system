import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, RegistrationFormData } from '../../utils/validationSchemas'
import { Input, Button, Toast } from '../ui'
import { theme } from '../../styles/theme'

interface RegisterFormProps {
    role: 'student' | 'teacher' | 'admin'
    onSubmit: (data: RegistrationFormData) => void
    onBackToLogin: () => void
    loading?: boolean
    customColor?: string
}

const RegisterForm: React.FC<RegisterFormProps> = ({
    role,
    onSubmit,
    onBackToLogin,
    loading = false,
    customColor
}) => {
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
        show: false,
        message: '',
        type: 'success'
    })

    const { register, handleSubmit, formState: {errors}, watch } = 
    useForm<RegistrationFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues:{
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            studentId: '',
        }
    })

    const watchedPassword = watch('password')

    const handleFormSubmit = (data: RegistrationFormData) => {
        setToast({
            show: true,
            message: 'Creating your account...',
            type: 'success'
        })

        setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }))
        }, 1500)
        
        onSubmit(data)
    }

    const getRoleEmailPlaceholder = () => {

        switch(role) {
            case 'student': return 'your.name@graduate.utm.my'
            case 'teacher': return 'teacher.name@utm.my'
            case 'admin': return 'admin.name@utm.my'
            default: return 'your.email@utm.my'
        }
    }

    const getRoleSpecificFields = () => {
        switch(role){
            case 'student':
                return(
                     <div style={{ marginBottom: theme.spacing[4] }}>
                        <Input
                            {...register('studentId')}
                            label="Student Matrix Number"
                            placeholder="A12CS1234"
                            fullWidth
                            error={errors.studentId?.message}
                            startIcon={<i className="bi bi-person-badge" style={{ fontSize: '1rem' }} />}
                        />
                    </div>
                )
            default: //only student needs the matrix number
                return null
        }
    }

    return(
        <>
        
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                {/* first name */}
                <div style={{marginBottom: theme.spacing[4]}}>
                    <Input 
                    {...register('firstName')}
                    label = "First Name"
                    placeholder='John'
                    fullWidth
                    error={errors.firstName?.message}
                    startIcon={<i className="bi bi-person" style={{ fontSize: '1rem' }} />}
                        />
                </div>

                {/* last name */}
                <div style={{marginBottom: theme.spacing[4]}}>
                    <Input 
                    {...register('lastName')}
                    label = "Last Name"
                    placeholder='Doe'
                    fullWidth
                    error={errors.lastName?.message}
                    startIcon={<i className="bi bi-person" style={{ fontSize: '1rem' }} />}
                        />
                </div>

                {/* email */}
                <div style={{marginBottom: theme.spacing[4]}}>
                    <Input
                    {...register('email')}
                    label={`${role.charAt(0).toUpperCase() + role.slice(1)} Email`}
                    placeholder={getRoleEmailPlaceholder()}
                    type='email'
                    fullWidth
                    error={errors.email?.message}
                    startIcon={<i className="bi bi-envelope" style={{ fontSize: '1rem' }} />}
                    />
                </div>

                {/* Role-specific fields */}
                {getRoleSpecificFields()}

                {/* Password */}
                <div style={{ marginBottom: theme.spacing[4] }}>
                    <Input
                        {...register('password')}
                        label="Password"
                        placeholder="Create a strong password"
                        type="password"
                        fullWidth
                        error={errors.password?.message}
                        startIcon={<i className="bi bi-lock" style={{ fontSize: '1rem' }} />}
                        showPasswordStrength={true}
                        value={watchedPassword}
                    />
                </div>

                {/* Confirm Password */}
                <div style={{ marginBottom: theme.spacing[4] }}>
                    <Input
                        {...register('confirmPassword')}
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        type="password"
                        fullWidth
                        error={errors.confirmPassword?.message}
                        startIcon={<i className="bi bi-lock-fill" style={{ fontSize: '1rem' }} />}
                    />
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={loading}
                    customColor={customColor}
                    style={{ marginBottom: theme.spacing[4] }}
                >
                    <i className="bi bi-person-plus" style={{ marginRight: '0.5rem' }} />
                    Create {role.charAt(0).toUpperCase() + role.slice(1)} Account
                </Button>

                {/* Back to Login Link */}
                <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: theme.fontSizes.sm, color: theme.colors.text.light }}>
                        Already have an account?{' '}
                        <a
                            href="#login"
                            onClick={(e) => {
                                e.preventDefault()
                                onBackToLogin()
                            }}
                            style={{ 
                                color: customColor || theme.colors.primary[500], 
                                textDecoration: 'none',
                                fontWeight: theme.fontWeights.medium
                            }}
                        >
                            Login here
                        </a>
                    </span>
                </div>


            </form>
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    show={toast.show}
                    onClose={() => setToast(prev => ({ ...prev, show: false }))}
                />
            )}
        </>
    )
}

export default RegisterForm