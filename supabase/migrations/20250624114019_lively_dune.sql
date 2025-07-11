/*
  # Create Ethiopian Payments Table

  1. New Tables
    - `ethiopian_payments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `course_id` (uuid, foreign key to courses)
      - `course_title` (text)
      - `amount` (decimal)
      - `currency` (text)
      - `payment_method` (text)
      - `payment_method_name` (text)
      - `account_number` (text)
      - `transaction_id` (text)
      - `payment_proof_url` (text)
      - `status` (text)
      - `submitted_at` (timestamptz)
      - `verified_at` (timestamptz)
      - `verified_by` (uuid)
      - `admin_notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Storage
    - Create `payment-proofs` bucket for storing payment screenshots

  3. Security
    - Enable RLS on `ethiopian_payments` table
    - Add policies for users to view their own payments
    - Add policies for admins to manage all payments
*/

-- Create ethiopian_payments table
CREATE TABLE IF NOT EXISTS ethiopian_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  course_title text NOT NULL,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD' NOT NULL,
  payment_method text NOT NULL,
  payment_method_name text NOT NULL,
  account_number text NOT NULL,
  transaction_id text NOT NULL,
  payment_proof_url text NOT NULL,
  status text DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'verified', 'rejected', 'refunded')),
  submitted_at timestamptz DEFAULT now(),
  verified_at timestamptz,
  verified_by uuid REFERENCES users(id),
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE ethiopian_payments ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ethiopian_payments_user_id ON ethiopian_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_ethiopian_payments_course_id ON ethiopian_payments(course_id);
CREATE INDEX IF NOT EXISTS idx_ethiopian_payments_status ON ethiopian_payments(status);
CREATE INDEX IF NOT EXISTS idx_ethiopian_payments_submitted_at ON ethiopian_payments(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_ethiopian_payments_transaction_id ON ethiopian_payments(transaction_id, payment_method);

-- Create unique constraint to prevent duplicate transaction IDs per payment method
CREATE UNIQUE INDEX IF NOT EXISTS idx_ethiopian_payments_unique_transaction 
  ON ethiopian_payments(transaction_id, payment_method);

-- RLS Policies

-- Users can view their own payments
DROP POLICY IF EXISTS "Users can view own ethiopian payments" ON ethiopian_payments;
CREATE POLICY "Users can view own ethiopian payments"
  ON ethiopian_payments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own payments
DROP POLICY IF EXISTS "Users can create own ethiopian payments" ON ethiopian_payments;
CREATE POLICY "Users can create own ethiopian payments"
  ON ethiopian_payments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all payments
DROP POLICY IF EXISTS "Admins can view all ethiopian payments" ON ethiopian_payments;
CREATE POLICY "Admins can view all ethiopian payments"
  ON ethiopian_payments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Admins can update payment status
DROP POLICY IF EXISTS "Admins can update ethiopian payments" ON ethiopian_payments;
CREATE POLICY "Admins can update ethiopian payments"
  ON ethiopian_payments
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create storage bucket for payment proofs
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for payment proofs
DROP POLICY IF EXISTS "Users can upload payment proofs" ON storage.objects;
CREATE POLICY "Users can upload payment proofs"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'payment-proofs' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can view own payment proofs" ON storage.objects;
CREATE POLICY "Users can view own payment proofs"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'payment-proofs' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Admins can view all payment proofs" ON storage.objects;
CREATE POLICY "Admins can view all payment proofs"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'payment-proofs' AND
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_ethiopian_payments_updated_at ON ethiopian_payments;
CREATE TRIGGER update_ethiopian_payments_updated_at
  BEFORE UPDATE ON ethiopian_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create enrollment when payment is verified
CREATE OR REPLACE FUNCTION create_enrollment_on_payment_verification()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create enrollment when status changes to 'verified'
  IF NEW.status = 'verified' AND OLD.status != 'verified' THEN
    -- Check if enrollment doesn't already exist
    IF NOT EXISTS (
      SELECT 1 FROM enrollments
      WHERE user_id = NEW.user_id AND course_id = NEW.course_id
    ) THEN
      -- Create the enrollment
      INSERT INTO enrollments (
        user_id,
        course_id,
        enrolled_at,
        payment_reference,
        payment_amount,
        payment_currency,
        payment_provider
      ) VALUES (
        NEW.user_id,
        NEW.course_id,
        NEW.verified_at,
        NEW.transaction_id,
        NEW.amount,
        NEW.currency,
        'ethiopian_manual'
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for enrollment creation
DROP TRIGGER IF EXISTS create_enrollment_on_payment_verification ON ethiopian_payments;
CREATE TRIGGER create_enrollment_on_payment_verification
  AFTER UPDATE ON ethiopian_payments
  FOR EACH ROW
  EXECUTE FUNCTION create_enrollment_on_payment_verification(); 