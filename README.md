PawCare — Full-Stack Pet Care Platform
A polished internship-ready pet-care web app with a calm healthcare-style interface.
Included modules
Pet owner authentication
Multi-pet profiles
Veterinary directory and appointment booking
Vaccination / medicine / grooming reminders
Pet-care history
Pet store, categories, cart and checkout flow
AI Pet Care Assistant
Emergency help
Supabase database + Row Level Security foundation
Database-ready veterinarian and admin roles
Run locally
Because this is a browser app, the easiest setup is to serve the folder with a small static server.
Example:
VS Code + Live Server
Python: python -m http.server 5500
Then open http://localhost:5500.
Connect Supabase
Create a Supabase project.
Open schema.sql in Supabase SQL Editor and run it.
Copy your Supabase project URL and Publishable/Anon key into supabase-config.js.
Reload the app.
Create an account from the login screen.
The app intentionally uses the publishable/anon key in the browser and relies on RLS for data protection. Never put a service-role key in supabase-config.js.
AI assistant
The frontend calls the Supabase Edge Function:
supabase/functions/pet-ai/index.ts
Deploy it with the Supabase CLI and configure a secret named:
GEMINI_API_KEY
The API key stays server-side in the Edge Function.
If Supabase is not configured, the UI opens in a demo mode so the design and main workflows can still be presented.
Important internship/demo note
Payment processing, live map/clinic APIs, real SMS/email reminders, inventory fulfillment, and production-grade admin authorization need provider-specific credentials and server-side policies. The supplied architecture leaves those integration points cleanly separated rather than exposing secrets in frontend code.
Suggested next production integrations
Google Maps / Places for real nearby emergency clinics
Razorpay or Stripe for live checkout
Resend / Twilio for email and SMS reminders
Supabase Storage for medical records and prescriptions
Calendar integration
Proper admin and veterinarian role policies
Audit logs and analytics
