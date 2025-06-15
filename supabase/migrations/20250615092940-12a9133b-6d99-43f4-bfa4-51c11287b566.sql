-- Enable realtime for hydration logs table
ALTER TABLE public."hydration logs" REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public."hydration logs";

-- Enable realtime for symptoms logs table  
ALTER TABLE public."symptoms logs" REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public."symptoms logs";

-- Enable realtime for medicines table
ALTER TABLE public.medicines REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.medicines;