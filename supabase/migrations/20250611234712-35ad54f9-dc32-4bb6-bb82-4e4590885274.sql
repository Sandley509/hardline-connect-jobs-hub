
-- Remove all triggers and dependencies with CASCADE
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles CASCADE;
DROP TRIGGER IF EXISTS on_profile_created_assign_role ON public.profiles CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;

-- Drop the trigger functions with CASCADE
DROP FUNCTION IF EXISTS public.handle_new_user_role() CASCADE;

-- Remove the user_roles table that uses app_role
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- Drop the app_role type with CASCADE
DROP TYPE IF EXISTS public.app_role CASCADE;

-- Create a simple admins table instead
CREATE TABLE IF NOT EXISTS public.admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- Recreate the simple user profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'username', 'User'));
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update the admin check functions to use the new admins table
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admins
    WHERE user_id = _user_id
  );
$$;

-- Remove the old role-based functions with CASCADE
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role) CASCADE;
DROP FUNCTION IF EXISTS public.is_moderator(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.is_moderator_or_admin(uuid) CASCADE;
