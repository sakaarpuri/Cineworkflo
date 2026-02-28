# Auth setup notes (Supabase)

The app now expects these Supabase Auth settings:

1. Email/password sign-up enabled.
2. Email confirmations enabled.
3. Redirect URL includes production app URL (`https://cineworkflo.com/`) and local URL for development.
4. Confirmation email template uses HTML and includes the `{{ .ConfirmationURL }}` clickable link.

Current app behavior:

- Sign-up uses email/password and sends users into a confirmation state in UI.
- Sign-up includes `emailRedirectTo` so confirmation links route back into the app.
- Password rules in UI: at least 6 characters and must include a number or symbol.
- User display uses `full_name` from auth metadata (fallback to email prefix).

Database/schema dependency noted:

- Name is stored in `auth.users.user_metadata.full_name` via Supabase `updateUser`.
- If you later add a public `profiles` table, keep it synced with `full_name` using a trigger or RPC.
