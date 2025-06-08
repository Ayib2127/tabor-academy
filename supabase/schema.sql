-- Create users table (formerly profiles)
CREATE TABLE IF NOT EXISTS users (
    id UUID REFERENCES auth.users ON DELETE CASCADE,
    email TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'student' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (id)
);

-- Enable Row Level Security for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Public users are viewable by everyone."
    ON users FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own user data."
    ON users FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own user data."
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- Create function to handle new user signup and insert into users table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, avatar_url, role)
    VALUES (new.id, new.email, NULL, NULL, 'student'); -- Set default full_name, avatar_url, and role
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup on auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- NOTE: You will need to apply this updated schema to your Supabase project manually.
-- This typically involves copying the contents and running it in the SQL Editor in Supabase, or using Supabase CLI migrations. 