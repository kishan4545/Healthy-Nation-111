GRANT SELECT ON public.subscription_requests TO authenticated;
GRANT UPDATE (status) ON public.subscription_requests TO authenticated;

CREATE POLICY "Customers and administrators can read meal plan requests"
ON public.subscription_requests
FOR SELECT
TO authenticated
USING (
  (
    email IS NOT NULL
    AND lower(email) = lower(auth.jwt() ->> 'email')
  )
  OR auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  OR coalesce(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::jsonb) @> '["admin"]'::jsonb
);

CREATE POLICY "Administrators can update meal plan status"
ON public.subscription_requests
FOR UPDATE
TO authenticated
USING (
  auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  OR coalesce(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::jsonb) @> '["admin"]'::jsonb
)
WITH CHECK (
  auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  OR coalesce(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::jsonb) @> '["admin"]'::jsonb
);
