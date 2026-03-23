# Active Context: VN50Up — Membership Registration & Management

## Current State

**App Status**: ✅ Social club membership system fully built and deployed

A full-featured social club membership registration and management system built on Next.js 16 with SQLite (Drizzle ORM).

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] SQLite database via Drizzle ORM (`@kilocode/app-builder-db`)
- [x] Database schema: `members`, `membership_types`, `events`, `event_registrations`
- [x] Database migrations generated
- [x] API routes: `/api/members`, `/api/members/[id]`, `/api/membership-types`, `/api/events`, `/api/seed`
- [x] Home page with hero, live stats, membership plan cards, feature highlights, CTA
- [x] 3-step member registration form (personal info → interests/bio → plan selection)
- [x] Member directory with live search and colorful card layout
- [x] Admin dashboard with stats overview, quick actions, recent members table
- [x] Admin members list with search/filter and inline status updates
- [x] Member edit page with full form (personal info, address, bio, admin notes)
- [x] Shared Navbar and Footer components
- [x] Seed endpoint for demo data (membership types + events)

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Landing/home page | ✅ Built |
| `src/app/layout.tsx` | Root layout with Nav + Footer | ✅ Built |
| `src/app/register/` | Member registration (3-step form) | ✅ Built |
| `src/app/members/` | Public member directory | ✅ Built |
| `src/app/admin/` | Admin dashboard | ✅ Built |
| `src/app/admin/members/` | Admin member list | ✅ Built |
| `src/app/admin/members/[id]/` | Edit individual member | ✅ Built |
| `src/app/api/members/` | Members CRUD API | ✅ Built |
| `src/app/api/membership-types/` | Plans API | ✅ Built |
| `src/app/api/events/` | Events API | ✅ Built |
| `src/app/api/seed/` | Demo data seeder | ✅ Built |
| `src/components/layout/Navbar.tsx` | Navigation bar | ✅ Built |
| `src/components/layout/Footer.tsx` | Footer | ✅ Built |
| `src/db/schema.ts` | Drizzle schema | ✅ Built |
| `src/db/index.ts` | DB client | ✅ Built |
| `src/db/migrations/` | SQL migrations | ✅ Generated |

## Database Schema

### Tables
- **membership_types**: id, name, description, price, duration (months), benefits (JSON), isActive
- **members**: id, firstName, lastName, email, phone, dateOfBirth, address, city, state, zipCode, country, bio, interests (JSON), profilePhoto, membershipTypeId (FK), membershipStatus (pending/active/expired/suspended), membershipStartDate, membershipEndDate, memberNumber, isAdmin, notes
- **events**: id, title, description, eventDate, location, maxAttendees, isPublic, memberOnly
- **event_registrations**: id, eventId (FK), memberId (FK), registeredAt, status

## Key Features

1. **Registration**: 3-step wizard — personal info, interests/bio, plan selection → auto-generates member number (CLB-YYYY-XXXX)
2. **Directory**: Active members in card grid, searchable by name/city/plan
3. **Admin Dashboard**: Stats (total/active/pending/expired/events), quick actions, recent members table
4. **Admin Member Management**: Filterable table, inline status change, delete, full edit form
5. **Seed Data**: POST /api/seed creates 3 membership plans + 3 upcoming events

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-03-23 | Full social club membership system built |
| 2026-03-23 | Rebranded from SocialClub to VN50Up; updated contact address to 12 Koonung St, Balwyn North 3104 |
