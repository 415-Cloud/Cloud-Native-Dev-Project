export const theme = {
  colors: {
    background: '#000000',
    surface: '#1a1a1a',
    surfaceLight: '#2a2a2a',
    primary: '#ffffff',
    secondary: '#888888',
    accent: '#ff6b35',
    accentSecondary: '#ff8c42',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    border: '#333333',
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
      muted: '#666666',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
  },
};

