# Mock-Test

The app now uses Firebase Realtime Database. Data is stored under these paths:

- `tests`
- `questions`
- `student_attempts`

## Supabase migration

The migration preserves the existing record IDs, timestamps, and foreign-key values. Run it from the project root with the Supabase project URL and a server-side key:

```bash
SUPABASE_URL="https://your-project.supabase.co" \
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key" \
npm run migrate:supabase-to-firebase
```

Use `SUPABASE_ANON_KEY` instead only when the Supabase policies permit reading every table. Never put a service-role key in `src` or a Vite environment variable exposed to the browser.

The Firebase Realtime Database must allow the migration request to write. After migration, configure Firebase Authentication and database rules appropriate for production; the current no-sign-in UI requires public reads and writes, which is not suitable for untrusted deployments.

## Restore test data

The complete seed data can be restored with:

```bash
FIREBASE_DATABASE_URL="$VITE_FIREBASE_DATABASE_URL" npm run restore:all-tests
```

This recreates the English test with 100 questions and the Geography Resources test with 31 questions. The script replaces the `tests` and `questions` collections, so use it only when those collections should be restored from this seed data.

## Admin authentication

Enable **Email/Password** under Firebase Authentication, then create the admin user there using the admin email and password. The app signs in through Firebase Auth; admin passwords are never stored in source code, `.env`, or the browser bundle. Keep the local `.env` file uncommitted; it is ignored by Git.
