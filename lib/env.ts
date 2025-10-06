export const env = {
  hasN8N: !!process.env.N8N_WEBHOOK_BOOKING,
  hasAvail: !!process.env.N8N_WEBHOOK_AVAIL,
  hasUpload: !!process.env.UPLOAD_SECRET,
  databaseUrl: process.env.DATABASE_URL || '',
  n8nWebhookBooking: process.env.N8N_WEBHOOK_BOOKING || '',
  n8nWebhookAvail: process.env.N8N_WEBHOOK_AVAIL || '',
  uploadSecret: process.env.UPLOAD_SECRET || '',
  googleCalId: process.env.GOOGLE_CAL_ID || 'primary',
} as const
