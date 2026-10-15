import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    globals: true,
    env: {
      JWT_SECRET: 'test-secret',
      ADMIN_EMAIL: 'admin@test.local',
      ADMIN_PASSWORD: 'test-password',
      SUPPLIER_PROVIDER: 'none',
    },
  },
});
