export interface RoleTheme{
    primary: string
    secondary: string
    accent:string
    background: {
        start:string 
        middle: string
        end: string
    }
    particles:{
        primary: string
        secondary: string
        tertiary: string
    }
}

export const roleThemes: Record<string, RoleTheme> = {
    default:{
        primary: '#38b2ac',
        secondary: '#48bb78',
        accent: '#319795',
        background: {
        start: '#0a4d47',
        middle: '#1a5f56',
        end: '#2c7a7b'
        },
        particles: {
        primary: 'rgba(56, 178, 172, 0.8)',
        secondary: 'rgba(72, 187, 120, 0.6)',
        tertiary: 'rgba(56, 178, 172, 0.4)'
        }
    },
    student:{
        primary: '#38b2ac',
        secondary: '#48bb78',
        accent: '#319795',
        background: {
        start: '#0a4d47',
        middle: '#1a5f56',
        end: '#2c7a7b'
        },
        particles: {
        primary: 'rgba(56, 178, 172, 0.8)',
        secondary: 'rgba(72, 187, 120, 0.6)',
        tertiary: 'rgba(56, 178, 172, 0.4)'
        }
    },
    teacher:{
        primary: '#dc2626',
        secondary: '#f59e0b',
        accent: '#b91c1c',
        background: {
        start: '#450a0a',
        middle: '#7f1d1d',
        end: '#dc2626'
        },
        particles: {
        primary: 'rgba(220, 38, 38, 0.8)',
        secondary: 'rgba(245, 158, 11, 0.6)',
        tertiary: 'rgba(185, 28, 28, 0.4)'
        }
    },
    admin:{
        primary: '#03bae7ff',
        secondary: '#0994adff',
        accent: '#0e7490',
        background: {
        start: '#083344',
        middle: '#0c4a6e',
        end: '#0891b2'
        },
        particles: {
        primary: 'rgba(8, 145, 178, 0.8)',
        secondary: 'rgba(6, 182, 212, 0.6)',
        tertiary: 'rgba(14, 116, 144, 0.4)'
        }
    }
}

export const getRoleTheme = (role: string): RoleTheme => {
  return roleThemes[role] || roleThemes.default
}