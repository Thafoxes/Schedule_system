import './App.css'
import './index.css'
import './styles/animation.css'
import { Suspense, lazy, useEffect, useState } from 'react'
import { Button, Input, Card as UICard, Tabs } from './components/ui'
import { getRoleTheme, RoleTheme, roleThemes } from './utils/RoleTheme'
import { theme } from './styles/theme'

// Works also with SSR
const LazyCard = lazy(() => import('./Card'))

// Component to create animated particles with dynamic colors
interface AnimatedBackgroundProps{
  roleTheme: RoleTheme
  currentRole: string
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = (
  {
    roleTheme,
    currentRole
  }
)=> {
  const [particles, setParticles] = useState<number[]>([])
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  
  useEffect(() => {
    const handleResize = () =>{

      //check sizing 
      if (typeof window === 'undefined') return
      
      const width = window.innerWidth
      if (width < 768) {
        setScreenSize('mobile')
      } else if (width < 1024) {
        setScreenSize('tablet')
      } else {
        setScreenSize('desktop')
      }
    }

    // set initial screen size
    if( typeof window != 'undefined'){
      handleResize()

      // Add event listener
      window.addEventListener('resize', handleResize)

      // Cleanup
      return () => window.removeEventListener('resize', handleResize)

    }
   
    
  }, [])

  useEffect(() => {
    // // Create 15 particles for the animation
    // const particleArray = Array.from({ length: 25 }, (_, i) => i)
    // setParticles(particleArray)
    let particleCount = 25

    if (screenSize === 'mobile'){
      particleCount = 10
    }else if (screenSize === 'tablet'){
      particleCount = 15
    }

    const particleArray = Array.from({ length: particleCount}, (_,i) => i)
    setParticles(particleArray)
  }, [screenSize])

  //dynamic background style
  const backgroundStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${roleTheme.background.start} 0%, ${roleTheme.background.middle} 50%, ${roleTheme.background.end} 100%)`,
    transition: `background 10s ease-out`,
  }

  //dynamic particle styles
  const getParticleStyle = (index:number): React.CSSProperties =>{
    const colors = [
      roleTheme.particles.primary,
      roleTheme.particles.secondary,
      roleTheme.particles.tertiary
    ]

    const colorIndex = index % 3

    return {
      background: colors[colorIndex],
      boxShadow: `0 0 6px ${colors[colorIndex]}`,
    }
  }

  //dynamic wave style
  const waveStyle: React.CSSProperties = {
    background: `linear-gradient(
      0deg,
      ${roleTheme.particles.primary.replace('0.8', '0.15')} 0%,
      ${roleTheme.particles.secondary.replace('0.6', '0.08')} 30%,
      ${roleTheme.particles.tertiary.replace('0.4', '0.04')} 60%,
      transparent 100%
    )`,
  }

  return (
    <div className="animated-background" style={backgroundStyle} data-role={currentRole}>
      <div className="xmb-particles">
        {particles.map((particle, index) => (
          <div
            key={particle}
            className="xmb-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${index * 0.5}s`,
              ...getParticleStyle(index),
            }}
          />
        ))}
      </div>
      <div className="xmb-waves" style={waveStyle}/>
    </div>
  )
}

function App() {
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [currentTab, setCurrentTab] = useState<string>('student') // Track current tab
  const [loading, setLoading] = useState<string>('')
  const [windowWidth, setWindowWidth] = useState<number>(1200)

  // Get current theme based on selected tab (immediate) or confirmed role
  const currentTheme = getRoleTheme(currentTab)

   useEffect(() => {
    // Check if we're on the client side
    if (typeof window !== 'undefined') {
      // Set initial width
      setWindowWidth(window.innerWidth)
      
      // Add resize listener
      const handleResize = () => {
        setWindowWidth(window.innerWidth)
      }
      
      window.addEventListener('resize', handleResize)
      
      // Cleanup
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleRoleSelection = (role: string) => {
    setSelectedRole(role)
    setLoading(role)
    
    // Simulate loading
    setTimeout(() => {
      setLoading('')
      alert(`Selected ${role} role!`)
    }, 2000)
  }

  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId) // Update background immediately when tab changes
    console.log(`Switched to ${tabId} tab`)
  }

  //Helper functions for responsive values
  const isMobile = windowWidth < 768
  const isTablet = windowWidth >= 768 && windowWidth < 1024


  // Test data for tabs
  const loginTabs = [
    {
      id: 'student',
      label: 'Student',
      content: (
        <div>
          <Input 
            label="Student Email" 
            placeholder="student@university.edu"
            fullWidth
            
          />
          <Input 
            label="Password" 
            type="password"
            placeholder="Enter your password"
            fullWidth
          />
          <Button 
            variant="primary" 
            fullWidth
            loading={loading === 'student'}
            onClick={() => handleRoleSelection('student')}
            customColor={currentTheme.primary}
          >
            Login as Student
          </Button>
        </div>
      )
    },
    {
      id: 'teacher',
      label: 'Teacher',
      content: (
        <div>
          <Input 
            label="Teacher Email" 
            placeholder="teacher@university.edu"
            fullWidth
            
          />
          <Input 
            label="Password" 
            type="password"
            placeholder="Enter your password"
            fullWidth
            
          />
          <Button 
            variant="primary" 
            fullWidth
            loading={loading === 'teacher'}
            onClick={() => handleRoleSelection('teacher')}
            customColor={currentTheme.primary}
          >
            Login as Teacher
          </Button>
        </div>
      )
    },
    {
      id: 'admin',
      label: 'Admin',
      content: (
        <div>
          <Input 
            label="Admin Email" 
            placeholder="admin@university.edu"
            fullWidth
           
          />
          <Input 
            label="Password" 
            type="password"
            placeholder="Enter admin password"
            fullWidth
           
          />
          <Button 
            variant="primary" 
            fullWidth
            loading={loading === 'admin'}
            onClick={() => handleRoleSelection('admin')}
            customColor={currentTheme.primary}

          >
            Login as Admin
          </Button>
        </div>
      )
    }
  ]

  return (
    <>
      <AnimatedBackground roleTheme={currentTheme} currentRole={currentTab}/>
      <main style={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile? '1rem': '2rem',
        boxSizing: 'border-box',
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
              width: isMobile? '50px' : '60px',
              height: isMobile? '50px' : '60px',
              background: currentTheme.primary,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile? '1.5rem':'2rem',
              transition: 'background 0.5s ease'
            }}>
              📚
            </div>
          </div>

          <h1 className="slide-in-up hero-title" style={{
            fontSize: isMobile? '2rem' : isTablet? '2.5rem' :'3rem',
            fontWeight: '700',
            marginBottom: '1rem',
            backgroundImage: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            transition: 'background-image 0.5s ease'
          }}>
            Library Duty
          </h1>

          <p className="slide-in-up hero-subtitle" style={{
            fontSize: isMobile? '1.2rem': isTablet? '1.3rem': '1.5rem',
            opacity: 0.9,
            marginBottom: '2rem',
            animationDelay: '0.2s'
          }}>
            Assignment System
          </p>

          {/* Role indicator */}
          <div style={{
            fontSize: isMobile? '0.8rem':'1rem',
            opacity: 0.7,
            textTransform: 'capitalize',
            color: `#ffffff`, // ADDED: Dynamic indicator
            fontWeight: 'bold',
            transition: 'background 0.5s ease'
          }}>
             Current Theme: {currentTab}
          </div>
        </div>

        {/* Enhanced Login Card with Tabs */}
        <UICard hover className="slide-in-up" padding="lg" shadow="xl" 
        style={{ 
          maxWidth: '500px', 
          width: '100%',
          background: 'rgba(255, 255, 255, 0.98)', // ← Make it more opaque
          backdropFilter: 'blur(10px)', 
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: isMobile? '0.75em' : '1em', //responsive padding
          margin: isMobile ? '0 0.5em' : '0', //mobile margin
          boxSizing: 'border-box',
          
           }}>
          <h2 style={{ 
            color: theme.colors.text.primary, 
            marginBottom: '2rem',
            fontSize: isMobile? '1.2rem' : '1.5rem',
            textAlign: 'center',
            
          }}>
            Login to the System
          </h2>
          
          <Tabs 
            tabs={loginTabs}
            defaultTab="student"
            onChange={handleTabChange}
            activeColor={currentTheme.secondary}
            inactiveColor='#ffffffff'
          />
        </UICard>


      </main>
    </>
  )
}

export default App