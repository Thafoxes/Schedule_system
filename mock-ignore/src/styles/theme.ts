export const theme = {
    colors:{
        primary:{
            50: '#e6fffa',
            100: '#b2f5ea',
            200: '#81e6d9',
            300: '#4fd1c7',
            400: '#38b2ac',
            500: '#319795', // Main teal color
            600: '#2c7a7b',
            700: '#285e61',
            800: '#234e52',
            900: '#1d4044',
        },
        secondary:{
            50: '#f0fff4',
            100: '#c6f6d5',
            200: '#9ae6b4',
            300: '#68d391',
            400: '#48bb78',
            500: '#38a169', // Green accent
            600: '#2f855a',
            700: '#276749',
            800: '#22543d',
            900: '#1c4532',
        },
        gray:{
            50: '#f7fafc',
            100: '#edf2f7',
            200: '#e2e8f0',
            300: '#cbd5e0',
            400: '#a0aec0',
            500: '#718096',
            600: '#4a5568',
            700: '#2d3748',
            800: '#1a202c',
            900: '#171923',
        },
        white: '#ffffff',
        background:{
            primary: '#0a4d47', // Dark teal background
            secondary: '#1a5f56',
            card: 'rgba(255, 255, 255, 0.95)',
            overlay: 'rgba(10, 77, 71, 0.9)',
        },
        text: {
        primary: '#1a202c',
        secondary: '#4a5568',
        light: '#718096',
        white: '#ffffff',
        },
        status: {
        success: '#38a169',
        warning: '#d69e2e',
        error: '#e53e3e',
        info: '#3182ce',
        }
    },
    fonts:{
        body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        mono: '"Fira Code", "Monaco", "Cascadia Code", monospace',
    },
    fontSizes:{
        xs: '0.75rem',    // 12px
        sm: '0.875rem',   // 14px
        md: '1rem',       // 16px
        lg: '1.125rem',   // 18px
        xl: '1.25rem',    // 20px
        '2xl': '1.5rem',  // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem', // 36px
        '5xl': '3rem',    // 48px
    },
    fontWeights: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },
    lineHeights: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.625,
    },
    spacing: {
        0: '0',
        1: '0.25rem',   // 4px
        2: '0.5rem',    // 8px
        3: '0.75rem',   // 12px
        4: '1rem',      // 16px
        5: '1.25rem',   // 20px
        6: '1.5rem',    // 24px
        8: '2rem',      // 32px
        10: '2.5rem',   // 40px
        12: '3rem',     // 48px
        16: '4rem',     // 64px
        20: '5rem',     // 80px
        24: '6rem',     // 96px
    },
    radii: {
        none: '0',
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
    },
    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        card: '0 10px 30px rgba(0, 0, 0, 0.15)',
        glow: '0 0 20px rgba(56, 178, 172, 0.3)',
    },
    breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
    },
    zIndices: {
        hide: -1,
        auto: 'auto',
        base: 0,
        docked: 10,
        dropdown: 1000,
        sticky: 1100,
        banner: 1200,
        overlay: 1300,
        modal: 1400,
        popover: 1500,
        skipLink: 1600,
        toast: 1700,
        tooltip: 1800,
    },
    transitions: {
        fast: '150ms ease',
        normal: '250ms ease',
        slow: '350ms ease',
    },
} as const;

export type Theme = typeof theme;

// Helper function to create media queries
export const mediaQuery = (breakpoint: keyof typeof theme.breakpoints) => `@media (min-width: ${theme.breakpoints[breakpoint]})`;