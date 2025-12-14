import './App.css'
import './index.css'
import './styles/animation.css'
import { Suspense, lazy, useEffect, useState } from 'react'

// Works also with SSR as expected
const Card = lazy(() => import('./Card'))

// Component to create animated particles
const AnimatedBackground = () => {
  const [particles, setParticles] = useState<number[]>([])

  useEffect(() => {
    // Create 15 particles for the animation
    const particleArray = Array.from({ length: 25 }, (_, i) => i)
    setParticles(particleArray)
  }, [])

  return (
    <div className="animated-background">
      <div className="xmb-particles">
        {particles.map((particle, index) => (
          <div
            key={particle}
            className="xmb-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${index * 0.5}s`,
            }}
          />
        ))}
      </div>
      <div className="xmb-waves" />
    </div>
  )
}

function App() {
  return (
    <>
      <AnimatedBackground />
      <main style={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        {/* Hero section */}
        <div style={{
          textAlign: 'center',
          color: 'white',
          marginBottom: '3rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {/* Library Icon */}
            <div style={{
              width: '60px',
              height: '60px',
              background: '#38b2ac',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem'
            }}>
              📚
            </div>
          </div>

          <h1 className="slide-in-up" style={{
            fontSize: '3rem',
            fontWeight: '700',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #38b2ac 0%, #48bb78 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Library Duty
          </h1>

          <p className="slide-in-up" style={{
            fontSize: '1.5rem',
            opacity: 0.9,
            marginBottom: '2rem',
            animationDelay: '0.2s'
          }}>
            Assignment System
          </p>
        </div>

        {/* Test card */}
        <div className="card-hover slide-in-up" style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '2rem',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
          animationDelay: '0.4s'
        }}>
          <h2 style={{ 
            color: '#2d3748', 
            marginBottom: '1rem',
            fontSize: '1.5rem'
          }}>
            Welcome to the System
          </h2>
          
          <p style={{ 
            color: '#4a5568', 
            marginBottom: '2rem' 
          }}>
            Choose your role to get started
          </p>

          {/* Test buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            flexDirection: 'column'
          }}>
            <button 
              className="button-pulse"
              style={{
                background: '#38b2ac',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Student Login
            </button>
            
            <button 
              style={{
                background: '#48bb78',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Teacher Login
            </button>
            
            <button 
              style={{
                background: '#2c7a7b',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Admin Login
            </button>
          </div>
        </div>

        {/* Loading test */}
        <div style={{
          marginTop: '2rem',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <span>Loading animation test:</span>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        {/* Original Suspense Card */}
        <div style={{
          marginTop: '2rem'
        }}>
          <Suspense fallback={
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          }>
            <Card />
          </Suspense>
        </div>
      </main>
    </>
  )
}

export default App