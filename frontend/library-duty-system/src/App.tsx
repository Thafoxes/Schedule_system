import React, { useState } from 'react';
import './App.css';
import WaveBackground from './WaveBackground';

// TypeScript interfaces
interface InputWithIconProps {
  type: string;
  name: string;
  placeholder: string;
  icon: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
const InputWithIcon: React.FC<InputWithIconProps> = ({ 
  type, name, placeholder, icon, value, onChange, required = false 
}) => {
  return (
    <div className="input-group">
      <div className="input-icon">
        <i className={`bi bi-${icon}`}></i>
      </div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="form-input"
      />
    </div>
  );
};

function App() {
  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    studentId: ''
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSignUp) {
      console.log('Sign Up Data:', formData);
      alert(`Student Sign Up Successful!\nName: ${formData.firstName} ${formData.lastName}\nEmail: ${formData.email}`);
    } else {
      console.log('Login Data:', { role: selectedRole, ...formData });
      alert(`Login as ${selectedRole.toUpperCase()}\nEmail: ${formData.email}`);
    }
    // Reset form
    setFormData({ email: '', password: '', firstName: '', lastName: '', studentId: '' });
  };

  const handleForgotPassword = () => {
    setIsForgotPassword(true);
    setFormData({ email: '', password: '', firstName: '', lastName: '', studentId: '' });
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.email) {
      alert(`Password reset link has been sent to:\n${formData.email}\n\nPlease check your inbox.`);
      setIsForgotPassword(false);
      setFormData({ email: '', password: '', firstName: '', lastName: '', studentId: '' });
    }
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    setIsSignUp(false);
    setFormData({ email: '', password: '', firstName: '', lastName: '', studentId: '' });
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
                      value={formData.email}
                      onChange={handleInputChange}
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
                            value={formData.firstName}
                            onChange={handleInputChange}
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
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="studentId">Student ID</label>
                        <InputWithIcon
                          type="text"
                          name="studentId"
                          placeholder="Enter your student ID"
                          icon="card-text"
                          value={formData.studentId}
                          onChange={handleInputChange}
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
                      value={formData.email}
                      onChange={handleInputChange}
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
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="submit-btn"
                    style={{ background: roleColors[selectedRole] }}
                  >
                    {isSignUp ? 'Sign Up' : 'Login'}
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

