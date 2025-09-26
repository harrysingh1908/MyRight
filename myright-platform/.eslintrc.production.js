// ESLint configuration overrides for production builds
module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    // Allow console.log in development mode checks
    'no-console': ['error', { 
      allow: ['warn', 'error'] 
    }],
    // Allow any type for embedding vectors and service responses
    '@typescript-eslint/no-explicit-any': ['warn'],
    // Production build overrides
    ...(process.env.NODE_ENV === 'production' && {
      'no-console': 'off', // Disable console warnings for production builds with conditional checks
    }),
  },
  overrides: [
    {
      files: ['src/services/**/*.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'warn', // Allow any for service layer APIs
      },
    },
    {
      files: ['src/app/**/*.tsx', 'src/components/**/*.tsx'],
      rules: {
        'no-console': ['error', { 
          allow: ['warn', 'error'] 
        }],
      },
    },
  ],
};