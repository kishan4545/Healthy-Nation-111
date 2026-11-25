CREATE TABLE public.subscription_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_name text NOT NULL,
  duration text NOT NULL CHECK (duration IN ('Weekly', 'Monthly')),
  diet text NOT NULL CHECK (diet IN ('Vegetarian', 'Non-vegetarian', 'Vegan')),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 80),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 8 AND 20),
  email text,
  address text,
  notes text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'active', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.subscription_requests TO anon, authenticated;
GRANT ALL ON public.subscription_requests TO service_role;

ALTER TABLE public.subscription_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visitors can submit a meal plan request"
ON public.subscription_requests FOR INSERT
TO anon, authenticated
WITH CHECK (true);