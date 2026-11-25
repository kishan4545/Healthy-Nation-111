# Healthy Nation Table

https://www.zomato.com/bangalore/healthy-nation-jp-nagar-bangalore/order go through this and create a best marketing website for this Healthy Nation place

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/cb73b85d-43e3-40dc-af4a-e0ba4d0beeba).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Customer and admin panels

The account and admin panels use Supabase email sign-in. For **each deployment**, configure these variables before building:

```text
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-project-publishable-key>
```

These are the public Supabase URL and publishable/anon key, not a service-role key. The server also accepts `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` as runtime variables. Keep them set on the deployment server if your hosting provider does not expose build-time `VITE_` variables to server functions. Rebuild/redeploy after changing build-time variables.

In Supabase Authentication settings, enable email sign-in, set the production site URL, and allow the deployed callback URLs (`https://<deployment-host>/account` and `https://<deployment-host>/admin`) under **URL Configuration > Redirect URLs**. Each staging or preview host must also be allowed. To use one stable callback host across previews, set `VITE_AUTH_REDIRECT_URL` to that site's origin, for example `https://www.example.com`; that host must be in the Supabase redirect allowlist and must serve both routes.

Apply the SQL migrations in `drizzle/migrations` in order. The access migration lets signed-in customers view requests for their own email and lets admins view and update requests. To grant admin access, set `app_metadata.role` to `admin` for the user's Supabase Auth account, then have them sign out and back in so their access token includes the role. Do not put this role in editable user metadata.
