import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.routta.commuter',
  appName: 'Routta',
  webDir: 'dist',
  backgroundColor: '#003028',
  android: {
    backgroundColor: '#003028',
  },
  ios: {
    backgroundColor: '#003028',
    contentInset: 'automatic',
  },
  server: {
    androidScheme: 'https',
  },
};

export default config;
