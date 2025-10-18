-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('user', 'admin', 'super_admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  department TEXT,
  approver_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create leave_balances table
CREATE TABLE public.leave_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  vacation_days INTEGER NOT NULL DEFAULT 15,
  sick_days INTEGER NOT NULL DEFAULT 10,
  personal_days INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create leave_requests table
CREATE TABLE public.leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  approver_id UUID REFERENCES public.profiles(id),
  type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  comments TEXT,
  approved_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- Create function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'super_admin');
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Super admins can update all profiles"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins can insert profiles"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (public.is_super_admin(auth.uid()));

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins can manage all roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.is_super_admin(auth.uid()));

-- RLS Policies for leave_balances
CREATE POLICY "Users can view own balance"
  ON public.leave_balances FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins can update balances"
  ON public.leave_balances FOR ALL
  TO authenticated
  USING (public.is_super_admin(auth.uid()));

-- RLS Policies for leave_requests
CREATE POLICY "Users can view own requests"
  ON public.leave_requests FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR approver_id = auth.uid() OR public.is_super_admin(auth.uid()));

CREATE POLICY "Users can create own requests"
  ON public.leave_requests FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own requests"
  ON public.leave_requests FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Approvers can update assigned requests"
  ON public.leave_requests FOR UPDATE
  TO authenticated
  USING (approver_id = auth.uid() OR public.is_super_admin(auth.uid()));

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, email, name, department)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', 'Usuario'),
    new.raw_user_meta_data->>'department'
  );
  
  -- Insert default leave balance
  INSERT INTO public.leave_balances (user_id)
  VALUES (new.id);
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_leave_balances_updated_at
  BEFORE UPDATE ON public.leave_balances
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_leave_requests_updated_at
  BEFORE UPDATE ON public.leave_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();