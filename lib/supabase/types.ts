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
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          location: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string
          thumbnail_url: string | null
          instructor_id: string
          level: string | null
          duration: number | null
          price: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          thumbnail_url?: string | null
          instructor_id: string
          level?: string | null
          duration?: number | null
          price?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          thumbnail_url?: string | null
          instructor_id?: string
          level?: string | null
          duration?: number | null
          price?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          content: string | null
          video_url: string | null
          duration: number | null
          position: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          content?: string | null
          video_url?: string | null
          duration?: number | null
          position: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string | null
          content?: string | null
          video_url?: string | null
          duration?: number | null
          position?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      ethiopian_payments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          course_title: string
          amount: number
          currency: string
          payment_method: string
          payment_method_name: string
          account_number: string
          transaction_id: string
          payment_proof_url: string
          status: 'pending_verification' | 'verified' | 'rejected' | 'refunded'
          submitted_at: string
          verified_at: string | null
          verified_by: string | null
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          course_title: string
          amount: number
          currency?: string
          payment_method: string
          payment_method_name: string
          account_number: string
          transaction_id: string
          payment_proof_url: string
          status?: 'pending_verification' | 'verified' | 'rejected' | 'refunded'
          submitted_at?: string
          verified_at?: string | null
          verified_by?: string | null
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          course_title?: string
          amount?: number
          currency?: string
          payment_method?: string
          payment_method_name?: string
          account_number?: string
          transaction_id?: string
          payment_proof_url?: string
          status?: 'pending_verification' | 'verified' | 'rejected' | 'refunded'
          submitted_at?: string
          verified_at?: string | null
          verified_by?: string | null
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Add more table definitions as needed
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}