import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  /**
   * Specify what prefix the client-side variables must have.
   * This is enforced both on type-level and at runtime.
   */
  clientPrefix: 'PUBLIC_',
  server: {
    APP_MODE: z.enum(['static', 'ssr']),
  },
  client: {
    PUBLIC_CMS_BASE_URL: z.string().url(),
    PUBLIC_CMS_ENDPOINT: z.string().url(),
    PUBLIC_CMS_API_TOKEN: z.string().min(1),
    PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']),
  },
  /**
   * What object holds the environment variables at runtime.
   * Often `process.env` or `import.meta.env`
   */
  runtimeEnv: import.meta.env,
});
