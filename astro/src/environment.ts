import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  /**
   * Specify what prefix the client-side variables must have.
   * This is enforced both on type-level and at runtime.
   */
  clientPrefix: 'PUBLIC_',
  server: {},
  client: {
    PUBLIC_CMS_BASE_URL: z.string().url(),
    PUBLIC_CMS_ENDPOINT: z.string().url(),
    PUBLIC_CMS_API_TOKEN: z.string().min(1),
  },
  /**
   * What object holds the environment variables at runtime.
   * Often `process.env` or `import.meta.env`
   */
  runtimeEnv: import.meta.env,
});
