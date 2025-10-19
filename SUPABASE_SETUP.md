# Supabase Setup Instructions for SOHUB Connect

## Database Setup

### Step 1: Run Database Schema
1. Go to your Supabase project: https://rvatwrpnfsngngszfbjv.supabase.co
2. Navigate to SQL Editor
3. Copy and paste the contents of `database_schema.sql`
4. Click "Run" to create all tables and policies

### Step 2: Create Super Admin User
1. In Supabase Dashboard, go to Authentication > Users
2. Click "Add user" and create a user with:
   - **Email:** admin@sohub.com
   - **Password:** Admin@123456
   - **Email Confirm:** Yes (check the box)

### Step 3: Run Sample Data
1. Go back to SQL Editor
2. Copy and paste the contents of `sample_data.sql`
3. Click "Run" to insert sample data and configure the admin user

## Super Admin Credentials

After completing the setup, you can login with:
- **Email:** admin@sohub.com
- **Password:** Admin@123456

## Environment Variables

The following environment variables are already configured in `.env`:
```
VITE_SUPABASE_URL=https://rvatwrpnfsngngszfbjv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2YXR3cnBuZnNuZ25nc3pmYmp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MjE2NTEsImV4cCI6MjA3NjM5NzY1MX0.vo2KJdjHIZ55CcG2qFRA6wbztrSEHuGEEsE2vX2VKx0
```

## Database Tables Created

1. **profiles** - User profiles and roles
2. **extensions** - Phone extensions management
3. **tickets** - Support ticket system
4. **ticket_types** - Ticket categories
5. **call_logs** - Call history and recordings
6. **ring_groups** - Call distribution groups
7. **ring_group_members** - Group membership
8. **ivr_menus** - Interactive voice response
9. **ivr_options** - IVR menu options
10. **notifications** - User notifications

## Security Features

- Row Level Security (RLS) enabled on all tables
- Role-based access control
- Secure authentication with Supabase Auth
- Protected API endpoints

## Next Steps

1. Run the database setup scripts in Supabase
2. Create the admin user
3. Start the development server: `npm run dev`
4. Login with the admin credentials
5. Test all features and functionality

## Troubleshooting

If you encounter any issues:
1. Check that all SQL scripts ran without errors
2. Verify the admin user was created in Authentication > Users
3. Ensure environment variables are correctly set
4. Check browser console for any authentication errors