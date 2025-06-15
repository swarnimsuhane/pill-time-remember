-- Fix INSERT policies for hydration logs
DROP POLICY IF EXISTS "Users can insert own hydration" ON "hydration logs";
CREATE POLICY "Users can insert own hydration" 
ON "hydration logs" 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Fix INSERT policies for symptoms logs  
DROP POLICY IF EXISTS "Users can insert own symptoms" ON "symptoms logs";
CREATE POLICY "Users can insert own symptoms" 
ON "symptoms logs" 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Fix INSERT policies for medicines
DROP POLICY IF EXISTS "Users can create their own medicines" ON medicines;
CREATE POLICY "Users can create their own medicines" 
ON medicines 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add DELETE policies for hydration and symptoms
CREATE POLICY "Users can delete own hydration" 
ON "hydration logs" 
FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own symptoms" 
ON "symptoms logs" 
FOR DELETE 
USING (auth.uid() = user_id);