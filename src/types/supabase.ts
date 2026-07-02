export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          country_code: string | null
          timezone: string | null
          language: string
          reminder_24h: boolean
          reminder_12h: boolean
          reminder_1h: boolean
          reminder_15m: boolean
          subscribed_at: string
          confirmed_at: string | null
          unsubscribed_at: string | null
          last_sent_at: string | null
          send_count: number
          verification_token: string | null
          verification_expires_at: string | null
          status: string
          favorite_driver: string | null
          favorite_constructor: string | null
          favorite_circuit: string | null
          source: string
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          created_at: string
          updated_at: string
        }
      }
      email_logs: {
        Row: {
          id: string
          subscriber_id: string | null
          email: string
          email_type: string
          race_name: string | null
          race_round: number | null
          race_season: number | null
          status: string
          provider_message_id: string | null
          provider_response: Json | null
          error_message: string | null
          error_code: string | null
          queued_at: string
          sent_at: string | null
          delivered_at: string | null
          opened_at: string | null
          clicked_at: string | null
          ip_address: unknown | null
          user_agent: string | null
          created_at: string
        }
      }
      cron_logs: {
        Row: {
          id: string
          job_name: string
          job_type: string
          started_at: string
          completed_at: string | null
          duration_ms: number | null
          status: string
          records_processed: number
          records_failed: number
          error_message: string | null
          error_stack: string | null
          metadata: Json | null
          created_at: string
        }
      }
      api_cache: {
        Row: {
          id: string
          cache_key: string
          api_source: string
          endpoint: string
          data: Json
          expires_at: string
          etag: string | null
          last_modified: string | null
          status_code: number | null
          created_at: string
          updated_at: string
        }
      }
    }
  }
}
