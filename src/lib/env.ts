import { z } from 'zod'
import { createEnv } from '@t3-oss/env-core'

export const env = createEnv({
  server: {},
  client: {
    VITE_SUPABASE_URL: z.string().url(),
    VITE_SUPABASE_ANON_KEY: z.string().min(1),
  },
  runtimeEnv: import.meta.env,
})