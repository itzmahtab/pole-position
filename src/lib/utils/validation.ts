import { z } from 'zod';

export const emailSchema = z.string().email('Please enter a valid email address');

export const subscribeSchema = z.object({
  email: emailSchema,
  country_code: z.string().optional(),
  timezone: z.string().optional(),
  language: z.string().default('en'),
  reminder_24h: z.boolean().default(true),
  reminder_12h: z.boolean().default(false),
  reminder_1h: z.boolean().default(true),
  reminder_15m: z.boolean().default(false),
});

export const settingsSchema = z.object({
  timezone: z.string(),
  country: z.string(),
  language: z.string(),
  theme: z.enum(['light', 'dark', 'system']),
  animationsEnabled: z.boolean(),
  reducedMotion: z.boolean(),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
