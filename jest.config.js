/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  setupFiles: ['@shopify/flash-list/jestSetup'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // Mesmo alias do tsconfig: o Metro resolve o @/ sozinho, o Jest não.
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // O jest-expo resolve a condição "react-native", que no Lucide aponta para .mjs (não transformado).
    '^lucide-react-native$':
      '<rootDir>/node_modules/lucide-react-native/dist/cjs/lucide-react-native.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|react-native-svg|nativewind|react-native-css-interop|lucide-react-native|standard-navigation|@shopify/flash-list)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/**',
    '!src/shared/testing/**',
    '!src/core/database/testing/**',
  ],
};
