
-- Clean up duplicate and fix RLS policies

-- First, drop all existing policies and recreate them properly
DROP POLICY IF EXISTS "Users can view their own hydration logs" ON public."hydration logs";
DROP POLICY IF EXISTS "Users can create their own hydration logs" ON public."hydration logs";
DROP POLICY IF EXISTS "Users can update their own hydration logs" ON public."hydration logs";
DROP POLICY IF EXISTS "Users can delete their own hydration logs" ON public."hydration logs";
DROP POLICY IF EXISTS "Users can view own hydration" ON public."hydration logs";
DROP POLICY IF EXISTS "Users can insert own hydration" ON public."hydration logs";
DROP POLICY IF EXISTS "Users can update own hydration" ON public."hydration logs";
DROP POLICY IF EXISTS "Users can delete own hydration" ON public."hydration logs";

-- Create clean hydration logs policies
CREATE POLICY "Users can view their own hydration logs" 
ON public."hydration logs" 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own hydration logs" 
ON public."hydration logs" 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hydration logs" 
ON public."hydration logs" 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hydration logs" 
ON public."hydration logs" 
FOR DELETE 
USING (auth.uid() = user_id);

-- Clean up symptoms logs policies
DROP POLICY IF EXISTS "Users can view their own symptoms logs" ON public."symptoms logs";
DROP POLICY IF EXISTS "Users can create their own symptoms logs" ON public."symptoms logs";
DROP POLICY IF EXISTS "Users can update their own symptoms logs" ON public."symptoms logs";
DROP POLICY IF EXISTS "Users can delete their own symptoms logs" ON public."symptoms logs";
DROP POLICY IF EXISTS "Users can view own symptoms" ON public."symptoms logs";
DROP POLICY IF EXISTS "Users can insert own symptoms" ON public."symptoms logs";
DROP POLICY IF EXISTS "Users can update own symptoms" ON public."symptoms logs";
DROP POLICY IF EXISTS "Users can delete own symptoms" ON public."symptoms logs";

-- Create clean symptoms logs policies
CREATE POLICY "Users can view their own symptoms logs" 
ON public."symptoms logs" 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own symptoms logs" 
ON public."symptoms logs" 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own symptoms logs" 
ON public."symptoms logs" 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own symptoms logs" 
ON public."symptoms logs" 
FOR DELETE 
USING (auth.uid() = user_id);

-- Clean up doctors policies
DROP POLICY IF EXISTS "Users can view their own doctors" ON public.doctors;
DROP POLICY IF EXISTS "Users can create their own doctors" ON public.doctors;
DROP POLICY IF EXISTS "Users can update their own doctors" ON public.doctors;
DROP POLICY IF EXISTS "Users can delete their own doctors" ON public.doctors;
DROP POLICY IF EXISTS "Users can view own doctors" ON public.doctors;
DROP POLICY IF EXISTS "Users can insert own doctors" ON public.doctors;
DROP POLICY IF EXISTS "Users can update own doctors" ON public.doctors;
DROP POLICY IF EXISTS "Users can delete own doctors" ON public.doctors;

-- Create clean doctors policies
CREATE POLICY "Users can view their own doctors" 
ON public.doctors 
FOR SELECT 
USING (auth.uid() = users_id);

CREATE POLICY "Users can create their own doctors" 
ON public.doctors 
FOR INSERT 
WITH CHECK (auth.uid() = users_id);

CREATE POLICY "Users can update their own doctors" 
ON public.doctors 
FOR UPDATE 
USING (auth.uid() = users_id);

CREATE POLICY "Users can delete their own doctors" 
ON public.doctors 
FOR DELETE 
USING (auth.uid() = users_id);

-- Fix the medicines table default value issue
ALTER TABLE public.medicines ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Add RLS policies for users table if needed
CREATE POLICY "Users can view their own profile" 
ON public.users 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.users 
FOR UPDATE 
USING (auth.uid() = id);

-- Ensure realtime is properly configured for all tables
ALTER TABLE public."hydration logs" REPLICA IDENTITY FULL;
ALTER TABLE public."symptoms logs" REPLICA IDENTITY FULL;
ALTER TABLE public.medicines REPLICA IDENTITY FULL;
ALTER TABLE public.doctors REPLICA IDENTITY FULL;

-- Add tables to realtime publication if not already added
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'doctors'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.doctors;
    END IF;
END $$;
