# MarkKeeper

## 🚨 CRITICAL SETUP STEP
**Real-time Data Duplication****
**The Problem:** I implemented both **Optimistic UI updates** (adding the item to the list immediately when the user clicks "Save") and **Real-time Subscriptions** (listening for DB inserts).
This caused a race condition: The local state would add the item, and milliseconds later, the Realtime subscription would fire an "INSERT" event, adding the same item again, resulting in duplicates.

**The Solution:**
In the subscription callback within `Dashboard.tsx`, I added a check:
```typescript
if (payload.eventType === 'INSERT') {
   setBookmarks(prev => {
      // Check if ID already exists to prevent duplicates from optimistic updates
      if (prev.some(b => b.id === payload.new.id)) return prev;
      return [payload.new, ...prev];
   });
}
```

###  Authentication State Flicker
**The Problem:** When reloading the page, there was a brief flash of the "Auth/Login" screen before the Supabase client could confirm the user's session token was valid.

**The Solution:**
- Implemented a strictly typed `isLoading` state in `app/page.tsx`.
- The component now renders a minimal loading spinner (pulsing dot) until `supabase.auth.getSession()` resolves.
- Only once `isLoading` is false do we decide whether to show the `Sidebar` (logged in) or the `Auth` component (logged out).



Run this command immediately:

```bash
npm install
```

After installation finishes, start the app:

```bash
vercel dev
# or
npm run dev
```

## 🧹 Cleanup
The following files are from the previous version of the app and should be deleted to prevent conflicts:
- `index.html`
- `index.tsx`
- `App.tsx`
- `metadata.json`

## 🏗️ Architecture
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase
