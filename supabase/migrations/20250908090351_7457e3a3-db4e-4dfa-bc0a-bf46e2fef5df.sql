-- Enable Row Level Security on the admins table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the admins table
-- Only admins can view admin data
CREATE POLICY "Only admins can view admin data" 
ON public.admins 
FOR SELECT 
USING (public.is_admin(auth.uid()));

-- Only admins can insert new admin records
CREATE POLICY "Only admins can create admin records" 
ON public.admins 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

-- Only admins can update admin records
CREATE POLICY "Only admins can update admin records" 
ON public.admins 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

-- Only admins can delete admin records
CREATE POLICY "Only admins can delete admin records" 
ON public.admins 
FOR DELETE 
USING (public.is_admin(auth.uid()));