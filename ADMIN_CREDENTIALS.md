# CareerOS AI — Admin Credentials

## Admin Dashboard

- **URL:** `/admin` (or `/admin/dashboard` when logged in)
- **Email:** `admin@careeros.ai`
- **Password:** `Admin123!`

## First-Time Setup

After deploying the backend and running the database seed, the admin user is created automatically. To seed the database manually:

```bash
cd backend
npm run db:seed
```

## Security Notes

1. **Change the default password** immediately after first login in production.
2. Keep this file private and do not commit it to public repositories.
3. Store credentials in a password manager for production use.
