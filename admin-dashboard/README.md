# Cinema Machina Admin Dashboard

A premium, internal content management system for the Cinema Machina website.

## Infrastructure
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS (Premium Dark Theme)
- **Database**: Prisma with SQLite
- **Icons**: Lucide React

## Local Development
Run the development server:
```bash
npm install
npx prisma generate
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access the dashboard.

## Dashboard Architecture
- `/overview`: Main dashboard metrics and health.
- `/settings`: Global site-wide configuration.
- `/brand-assets`: Brand identity management.
- `/media-assets`: Photography and gallery management.
- `/ecosystems`: Managing supported platforms.
- `/content-*`: Granular management for individual public pages.
- `/changelog`: Internal tracking of site updates.
- `/verification`: Quality assurance and performance logs.

---
© 2026 Cinema Machina. Confidential.
