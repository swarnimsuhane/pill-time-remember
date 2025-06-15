import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.053824ff51574090bc07372d73c5d3b6',
  appName: 'pill-time-remember',
  webDir: 'dist',
  server: {
    url: 'https://053824ff-5157-4090-bc07-372d73c5d3b6.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0EA5E9',
      showSpinner: false
    }
  }
};

export default config;