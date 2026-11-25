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

The account and admin panels use Supabase email sign-in. Enable email authentication and add the deployed site's `/account` and `/admin` URLs to the Supabase redirect URL allowlist.

Apply the SQL migrations in `drizzle/migrations` in order. The access migration lets signed-in customers view requests for their own email and lets admins view and update requests. To grant admin access, set `app_metadata.role` to `admin` for the user's Supabase Auth account, then have them sign out and back in so their access token includes the role. Do not put this role in editable user metadata.
