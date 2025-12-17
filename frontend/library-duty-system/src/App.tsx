import React, { useState } from 'react';
import './App.css';
import WaveBackground from './WaveBackground';
import authService from './services/authService';
import { LoginRequest, RegisterRequest } from './services/authService';


// TypeScript interfaces
interface InputWithIconProps {
  type: string;
  name: string;
  placeholder: string;
  icon: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

interface FormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  studentId: string;
}

type Role = 'student' | 'teacher' | 'admin';

// Reusable Input Component with Icon
const InputWithIcon: React.memo<InputWithIconProps> = ({ 
  type, name, placeholder, icon, value, onChange, required = false 
}) => {
  const inputProps: any = {
    type,
    name,
    placeholder,
    required,
    className: "form-input"
  };

  // Only add value and onChange if value is provided (controlled)
  if (value !== undefined) {
    inputProps.value = value;
    inputProps.onChange = onChange;
  }

  return (
    <div className="input-group">
      <div className="input-icon">
        <i className={`bi bi-${icon}`}></i>
      </div>
      <input {...inputProps} />
    </div>
  );
};

function App() {

  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');



  const roleColors = {
    student: 'radial-gradient(ellipse at center, #1a5c1a 0%, #0d3d0d 50%, #051a05 100%)',
    teacher: 'radial-gradient(ellipse at center, #5c1a1a 0%, #3d0d0d 50%, #1a0505 100%)',
    admin: 'radial-gradient(ellipse at center, #1a4d5c 0%, #0d2d3d 50%, #05141a 100%)'
  };

  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);
    setIsSignUp(false);
    setIsForgotPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Form submit triggered');
    
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    // Get form data directly from the form
    const form = e.currentTarget;
    const formDataObj = new FormData(form);
    
    const email = formDataObj.get('email') as string;
    const password = formDataObj.get('password') as string;
    const firstName = formDataObj.get('firstName') as string;
    const lastName = formDataObj.get('lastName') as string;
    const studentId = formDataObj.get('studentId') as string;
    
    try {
      if (!isSignUp) {
        // Login
        console.log('Attempting login for role:', selectedRole);
        const loginData: LoginRequest = {
          email,
          password,
          role: selectedRole
        };

        const response = await authService.login(loginData);
        console.log('Login successful:', response.user);
        
        setSuccessMessage(`Welcome back, ${response.user.firstName}!`);
        
        // Clear form on success
        form.reset();
        
      } else {
        // Register
        console.log('Attempting registration for role:', selectedRole);
        const registerData: RegisterRequest = {
          email,
          firstName,
          lastName,
          password,
          role: selectedRole,
          ...(selectedRole === 'student' && { studentMatricNumber: studentId })
        };

        const response = await authService.register(registerData);
        console.log('Registration successful:', response);
        
        setSuccessMessage('Account created successfully! Please log in.');
        
        // Clear form and switch to login mode
        form.reset();
        setIsSignUp(false);
      }
    } catch (error: any) {
      console.error('Authentication error caught in handleSubmit:', error);
      
      // Prevent any navigation by stopping event propagation again
      e.preventDefault();
      e.stopPropagation();
      
      // Handle different types of errors
      if (error.response?.status === 401) {
        console.log('401 Unauthorized error - setting error message');
        setErrorMessage('Invalid email or password. Please try again.');
      } else if (error.response?.status === 400) {
        console.log('400 Bad Request error:', error.response.data);
        setErrorMessage(error.response.data?.message || 'Invalid request. Please check your information.');
      } else if (error.response?.data?.message) {
        console.log('API error message:', error.response.data.message);
        setErrorMessage(error.response.data.message);
      } else if (error.message) {
        console.log('Error message:', error.message);
        setErrorMessage(error.message);
      } else {
        console.log('Unknown error:', error);
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
      
      // Force component to stay on current page
      return false;
    } finally {
      setIsLoading(false);
      console.log('Form submission completed');
    }
  };

  const handleForgotPassword = () => {
    setIsForgotPassword(true);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formDataObj = new FormData(form);
    const email = formDataObj.get('email') as string;
    
    if (email) {
      alert(`Password reset link has been sent to:\n${email}\n\nPlease check your inbox.`);
      setIsForgotPassword(false);
      form.reset();
    }
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    setIsSignUp(false);
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className="app" style={{ background: roleColors[selectedRole] }}>
      {/* Particles/Sparkles */}
      <div className="particles">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}></div>
        ))}
      </div>
      
      {/* Canvas Wave Background */}
      <WaveBackground />
      <div className="main-title">
        <div className="title-icon">📚</div>
        <div className="title-text-large">Library Duty</div>
        <div className="title-text-small">Assignment System</div>
      </div>
      
      <div className="login-container">
        <div className={`login-box ${selectedRole}-theme`}>
          {/* Role selector - only show on login page */}
          {!isSignUp && !isForgotPassword && (
            <div className="role-selector">
              <button
                className={`role-btn ${selectedRole === 'student' ? 'active' : ''}`}
                onClick={() => handleRoleChange('student')}
                style={{ 
                  background: selectedRole === 'student' ? roleColors.student : '#f0f0f0',
                  color: selectedRole === 'student' ? 'white' : '#333'
                }}
              >
                Student
              </button>
              <button
                className={`role-btn ${selectedRole === 'teacher' ? 'active' : ''}`}
                onClick={() => handleRoleChange('teacher')}
                style={{ 
                  background: selectedRole === 'teacher' ? roleColors.teacher : '#f0f0f0',
                  color: selectedRole === 'teacher' ? 'white' : '#333'
                }}
              >
                Teacher
              </button>
              <button
                className={`role-btn ${selectedRole === 'admin' ? 'active' : ''}`}
                onClick={() => handleRoleChange('admin')}
                style={{ 
                  background: selectedRole === 'admin' ? roleColors.admin : '#f0f0f0',
                  color: selectedRole === 'admin' ? 'white' : '#333'
                }}
              >
                Admin
              </button>
            </div>
          )}

          <div className="form-container">
            {/* Forgot Password Form */}
            {isForgotPassword ? (
              <>
                <h2 className="form-title">Reset Password</h2>
                <p className="form-subtitle">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                
                <form onSubmit={handleForgotPasswordSubmit}>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <InputWithIcon
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      icon="envelope"

                      required
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="submit-btn"
                   
                    style={{ background: roleColors[selectedRole] }}
                  >
                    Send Reset Link
                  </button>
                </form>

                <div className="toggle-form">
                  <p>
                    Remember your password?
                    <button 
                      className="toggle-btn"
                      onClick={handleBackToLogin}
                    >
                      Back to Login
                    </button>
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Login / Sign Up Form */}
                <h2 className="form-title">
                  {isSignUp ? 'Student Sign Up' : `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Login`}
                </h2>
                
                {errorMessage && (
                  <div className="error-message" style={{
                    background: 'linear-gradient(135deg, rgba(255, 82, 82, 0.15), rgba(255, 107, 107, 0.08))',
                    border: '1px solid rgba(255, 107, 107, 0.4)',
                    borderLeft: '4px solid #ff6b6b',
                    color: '#ff4757',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    marginBottom: '20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(255, 107, 107, 0.1)',
                    animation: 'slideIn 0.3s ease-out'
                  }}>
                    <i className="bi bi-exclamation-triangle-fill" style={{ marginRight: '8px' }}></i>
                    {errorMessage}
                  </div>
                )}

                {successMessage && (
                  <div className="success-message" style={{
                    background: 'linear-gradient(135deg, rgba(46, 213, 115, 0.15), rgba(123, 237, 159, 0.08))',
                    border: '1px solid rgba(46, 213, 115, 0.4)',
                    borderLeft: '4px solid #2ed573',
                    color: '#27ae60',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    fontSize: '16px',
                    fontWeight: '600',
                    textAlign: 'center',
                    boxShadow: '0 6px 20px rgba(46, 213, 115, 0.15)',
                    animation: 'slideIn 0.4s ease-out',
                    letterSpacing: '0.5px'
                  }}>
                    <i className="bi bi-check-circle-fill" style={{ marginRight: '10px', fontSize: '18px' }}></i>
                    {successMessage}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  {isSignUp && (
                    <>
                      <div className="name-row">
                        <div className="form-group">
                          <label htmlFor="firstName">First Name</label>
                          <InputWithIcon
                            type="text"
                            name="firstName"
                            placeholder="John"
                            icon="person"

                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="lastName">Last Name</label>
                          <InputWithIcon
                            type="text"
                            name="lastName"
                            placeholder="Doe"
                            icon="person-badge"

                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="studentId">Student Metric Number</label>
                        <InputWithIcon
                          type="text"
                          name="studentId"
                          placeholder="Enter your student matric number"
                          icon="card-text"
                          required
                        />
                      </div>
                    </>
                  )}
                  
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <InputWithIcon
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      icon="envelope"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <InputWithIcon
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      icon="lock"
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={isLoading}
                    style={{ background: roleColors[selectedRole] }}
                  >
                    {isLoading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Login')} 
                  </button>
                </form>

                {!isSignUp && (
                  <div className="forgot-password">
                    <button 
                      className="forgot-password-btn"
                      onClick={handleForgotPassword}
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                {selectedRole === 'student' && (
                  <div className="toggle-form">
                    <p>
                      {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                      <button 
                        className="toggle-btn"
                        onClick={() => setIsSignUp(!isSignUp)}
                      >
                        {isSignUp ? 'Login' : 'Sign Up'}
                      </button>
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

