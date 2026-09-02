# Deploy PawCare

## GitHub Pages
1. Put the project files in a GitHub repository.
2. Update `supabase-config.js`.
3. GitHub → Settings → Pages → Deploy from branch.
4. Select `main` and `/root`.
5. Open the generated Pages URL.

## Netlify / Vercel
This project is also suitable for static hosting. Upload the root folder or connect the GitHub repository.

## Supabase
Run `schema.sql` first. Then deploy the Edge Function from the `supabase` folder using the Supabase CLI.
