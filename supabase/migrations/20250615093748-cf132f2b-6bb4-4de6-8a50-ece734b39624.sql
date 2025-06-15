-- Fix doctors table foreign key constraint and add missing RLS policies
-- Remove the problematic foreign key constraint
ALTER TABLE public.doctors DROP CONSTRAINT IF EXISTS doctors_users_id_fkey;

-- Add RLS policies for doctors table
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- Create policies for doctors (drop if exists first)
DROP POLICY IF EXISTS "Users can view their own doctors" ON public.doctors;
DROP POLICY IF EXISTS "Users can create their own doctors" ON public.doctors;
DROP POLICY IF EXISTS "Users can update their own doctors" ON public.doctors;
DROP POLICY IF EXISTS "Users can delete their own doctors" ON public.doctors;

CREATE POLICY "Users can view their own doctors" 
ON public.doctors 
FOR SELECT 
USING (auth.uid()::text = users_id::text);

CREATE POLICY "Users can create their own doctors" 
ON public.doctors 
FOR INSERT 
WITH CHECK (auth.uid()::text = users_id::text);

CREATE POLICY "Users can update their own doctors" 
ON public.doctors 
FOR UPDATE 
USING (auth.uid()::text = users_id::text);

CREATE POLICY "Users can delete their own doctors" 
ON public.doctors 
FOR DELETE 
USING (auth.uid()::text = users_id::text);

-- Add RLS policies for hydration logs
ALTER TABLE public."hydration logs" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own hydration logs" ON public."hydration logs";
DROP POLICY IF EXISTS "Users can create their own hydration logs" ON public."hydration logs";
DROP POLICY IF EXISTS "Users can update their own hydration logs" ON public."hydration logs";
DROP POLICY IF EXISTS "Users can delete their own hydration logs" ON public."hydration logs";

CREATE POLICY "Users can view their own hydration logs" 
ON public."hydration logs" 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own hydration logs" 
ON public."hydration logs" 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own hydration logs" 
ON public."hydration logs" 
FOR UPDATE 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own hydration logs" 
ON public."hydration logs" 
FOR DELETE 
USING (auth.uid()::text = user_id::text);

-- Add RLS policies for symptoms logs
ALTER TABLE public."symptoms logs" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own symptoms logs" ON public."symptoms logs";
DROP POLICY IF EXISTS "Users can create their own symptoms logs" ON public."symptoms logs";
DROP POLICY IF EXISTS "Users can update their own symptoms logs" ON public."symptoms logs";
DROP POLICY IF EXISTS "Users can delete their own symptoms logs" ON public."symptoms logs";

CREATE POLICY "Users can view their own symptoms logs" 
ON public."symptoms logs" 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own symptoms logs" 
ON public."symptoms logs" 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own symptoms logs" 
ON public."symptoms logs" 
FOR UPDATE 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own symptoms logs" 
ON public."symptoms logs" 
FOR DELETE 
USING (auth.uid()::text = user_id::text);