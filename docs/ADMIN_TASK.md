# ADMIN_TASK.md — Admin Panel Implementation Tasks

Status legend: `[ ]` todo · `[~]` in progress · `[x]` done

---

## Phase A — Dependencies & Configuration

- [ ] **A.1** Install Better Auth dan Google OAuth dependencies:
  ```bash
  pnpm add better-auth
  ```
  Better Auth sudah bundled dengan Google social provider — tidak perlu package tambahan.

- [ ] **A.2** Tambah env vars baru ke `.env` (development):
  ```env
  BETTER_AUTH_SECRET=           # generate: openssl rand -base64 32
  BETTER_AUTH_URL=http://localhost:4321
  GOOGLE_CLIENT_ID=
  GOOGLE_CLIENT_SECRET=
  ```

- [ ] **A.3** Update `.env.example` — tambah placeholder untuk 4 env vars baru.

- [ ] **A.4** Setup Google Cloud Console:
  - Buka https://console.cloud.google.com → APIs & Services → Credentials
  - Buat OAuth 2.0 Client ID (Web application)
  - Authorized redirect URIs:
    - `http://localhost:4321/api/auth/callback/google` (dev)
    - `https://your-netlify-domain.netlify.app/api/auth/callback/google` (prod)
  - Salin Client ID dan Client Secret ke `.env`

- [ ] **A.5** Tambah env vars ke Netlify dashboard:
  - `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
  - Update `BETTER_AUTH_URL` ke URL produksi Netlify

---

## Phase B — Better Auth Core Setup
`
- [ ] **B.1** Buat `src/lib/auth-whitelist.js` — whitelist email admin:
  ```js
  // src/lib/auth-whitelist.js
  // Tambah email Google yang diizinkan masuk ke admin panel
  export const ALLOWED_EMAILS = [
    "hasban.fardani@gmail.com",
    // tambah email lain di sini
  ];
  ```

- [ ] **B.2** Buat `src/lib/auth.ts` — Better Auth server instance:
  - Import `betterAuth` dari `better-auth`
  - Gunakan `libsqlAdapter` dari `better-auth/adapters/libsql`
  - Hubungkan ke Turso client yang sudah ada
  - Aktifkan `socialProviders.google`
  - Tambahkan hook `after.signIn` untuk memblokir email di luar `ALLOWED_EMAILS`
  - Hook: jika email tidak ada di whitelist → throw error (Better Auth akan redirect dengan error query param)

- [ ] **B.3** Jalankan Better Auth database migration untuk membuat tabel auth di Turso:
  ```bash
  pnpm better-auth migrate
  ```
  Verifikasi 4 tabel baru terbuat: `user`, `session`, `account`, `verification`.

- [ ] **B.4** Buat `src/pages/api/auth/[...all].ts` — Better Auth Astro catch-all handler:
  ```ts
  import { auth } from "@/lib/auth";
  import type { APIRoute } from "astro";

  export const ALL: APIRoute = async (ctx) => {
    return auth.handler(ctx.request);
  };
  ```
  Pastikan file ini TIDAK ada `export const prerender = true`.

---

## Phase C — Middleware & Route Protection

- [ ] **C.1** Buat `src/middleware.ts` — session guard untuk semua route `/admin/*`:
  - Import `auth` dari `@/lib/auth`
  - Import `ALLOWED_EMAILS` dari `@/lib/auth-whitelist.js`
  - Untuk setiap request ke `/admin/*` (kecuali `/admin/login`):
    - Ambil session via `auth.api.getSession({ headers: request.headers })`
    - Jika tidak ada session → redirect ke `/admin/login`
    - Jika ada session tapi email tidak di `ALLOWED_EMAILS` → sign out + redirect ke `/admin/login?error=unauthorized`
    - Jika session valid → lanjutkan request
  - Route `/api/auth/*` harus bypass middleware (tidak diproteksi)

---

## Phase D — Admin Pages

### D.1 — Layout & Login

- [ ] **D.1.1** Buat `src/layouts/AdminLayout.astro`:
  - Props: `title: string`
  - HTML shell terpisah dari `Layout.astro` publik (tidak ada Navbar, SEO publik, LogoStrip)
  - Sidebar kiri: navigasi ke Projects, Writing, Publications, Speaking
  - Header kanan atas: nama user (dari session) + tombol "Sign out" (form POST ke `/api/auth/sign-out`)
  - Gunakan design tokens existing (`bg-background`, `bg-card`, `border-border`, dll)
  - `export const prerender = false` di semua halaman admin

- [ ] **D.1.2** Buat `src/pages/admin/login.astro`:
  - `export const prerender = false`
  - Jika sudah ada session valid → redirect ke `/admin`
  - Tampilkan error message jika query param `error=unauthorized`
  - Tombol "Login with Google" → fetch POST ke `/api/auth/sign-in/social` dengan `{ provider: "google" }`
    atau gunakan redirect langsung ke Better Auth endpoint
  - Desain: centered card, sesuai design tokens

### D.2 — Dashboard

- [ ] **D.2.1** Buat `src/pages/admin/index.astro`:
  - `export const prerender = false`
  - Gunakan `AdminLayout`
  - Tampilkan summary card: jumlah rows tiap tabel (query Turso COUNT(*))
  - 4 cards: Projects (n), Writing (n), Publications (n), Speaking (n)
  - Klik card → navigasi ke halaman tabel

### D.3 — Projects CRUD

- [ ] **D.3.1** Buat `src/pages/admin/projects/index.astro`:
  - Query `SELECT * FROM projects ORDER BY id ASC`
  - Tabel dengan kolom: ID, Title, Stack, Screenshot URL, Actions
  - Actions: Edit (link ke `/admin/projects/{id}`) + Delete (inline form POST)
  - Tombol "+ Add Project" → `/admin/projects/new`

- [ ] **D.3.2** Buat `src/pages/admin/projects/new.astro`:
  - Form fields: `title`, `slug`, `description`, `json_source`, `stack`, `screenshot_url`, `blueprint_snippet`
  - POST handler di frontmatter: `INSERT INTO projects ...`
  - Validasi: semua field required
  - Sukses → redirect ke `/admin/projects`

- [ ] **D.3.3** Buat `src/pages/admin/projects/[id].astro`:
  - Fetch row by ID dari Turso
  - Form pre-filled dengan data existing
  - POST handler: `UPDATE projects SET ... WHERE id = ?`
  - Tombol Delete (terpisah): `DELETE FROM projects WHERE id = ?`
  - Sukses → redirect ke `/admin/projects`

### D.4 — Writing CRUD

- [ ] **D.4.1** Buat `src/pages/admin/writing/index.astro`:
  - Kolom tabel: ID, Title, Category, URL, Date, Actions

- [ ] **D.4.2** Buat `src/pages/admin/writing/new.astro`:
  - Fields: `title`, `category`, `description`, `url`, `published_date`

- [ ] **D.4.3** Buat `src/pages/admin/writing/[id].astro`:
  - Edit + Delete

### D.5 — Publications CRUD

- [ ] **D.5.1** Buat `src/pages/admin/publications/index.astro`:
  - Kolom tabel: ID, Title, Journal, Type, Date, Actions

- [ ] **D.5.2** Buat `src/pages/admin/publications/new.astro`:
  - Fields: `title`, `journal`, `published_date`, `abstract`, `doi_url`, `type` (dropdown: journal/citation)

- [ ] **D.5.3** Buat `src/pages/admin/publications/[id].astro`:
  - Edit + Delete

### D.6 — Speaking CRUD

- [ ] **D.6.1** Buat `src/pages/admin/speaking/index.astro`:
  - Kolom tabel: ID, Title, Provider, Role, Date, Actions

- [ ] **D.6.2** Buat `src/pages/admin/speaking/new.astro`:
  - Fields: `title`, `provider`, `event_date`, `role`, `description`, `link`, `modules` (textarea JSON)

- [ ] **D.6.3** Buat `src/pages/admin/speaking/[id].astro`:
  - Edit + Delete

---

## Phase E — Security Hardening

- [ ] **E.1** Verifikasi `BETTER_AUTH_SECRET` tidak terexpose di client bundle:
  ```bash
  grep -r "BETTER_AUTH_SECRET" src/ --include="*.ts" --include="*.astro"
  ```
  Hanya boleh muncul di `src/lib/auth.ts` via `import.meta.env`.

- [ ] **E.2** Pastikan semua halaman admin punya `export const prerender = false` — cek satu per satu.

- [ ] **E.3** Test skenario unauthorized:
  - Akses `/admin` tanpa login → harus redirect ke `/admin/login`
  - Login dengan Google account yang tidak ada di whitelist → harus muncul pesan error, tidak boleh masuk
  - Login dengan email yang ada di whitelist → berhasil masuk ke dashboard

- [ ] **E.4** Tambah ALLOWED_EMAILS ke `.env.example` sebagai komentar panduan (bukan nilai real):
  ```
  # Edit src/lib/auth-whitelist.js untuk mengatur email yang diizinkan
  ```

---

## Phase F — Build Verification

- [ ] **F.1** Jalankan `pnpm build` — pastikan 0 TypeScript errors.
  Expected output: semua halaman admin sebagai Netlify Functions (SSR), bukan static.

- [ ] **F.2** Test lokal dengan `pnpm dev`:
  - Flow login Google lengkap
  - CRUD satu tabel (misal Writing) dari add → edit → delete
  - Middleware redirect test

- [ ] **F.3** Deploy ke Netlify dan test flow OAuth di production URL.

---

## Dependency Graph (urutan implementasi)

```
A.1 → A.2 → A.3 → A.4 (manual)
                      ↓
B.1 → B.2 → B.3 → B.4
               ↓
              C.1
               ↓
        D.1.1 → D.1.2 → D.2.1
                            ↓
              D.3.x → D.4.x → D.5.x → D.6.x
                                           ↓
                                    E.1 → E.2 → E.3 → E.4
                                                          ↓
                                                   F.1 → F.2 → F.3
```

---

## File Summary (semua file baru)

| File | Tipe | Keterangan |
|---|---|---|
| `src/lib/auth-whitelist.js` | Config | Array email yang diizinkan |
| `src/lib/auth.ts` | Server | Better Auth instance + Google provider + whitelist hook |
| `src/middleware.ts` | Server | Session guard semua `/admin/*` |
| `src/pages/api/auth/[...all].ts` | API | Better Auth catch-all handler |
| `src/layouts/AdminLayout.astro` | Layout | Shell admin (sidebar + header) |
| `src/pages/admin/login.astro` | Page SSR | Login dengan Google |
| `src/pages/admin/index.astro` | Page SSR | Dashboard summary |
| `src/pages/admin/projects/index.astro` | Page SSR | List projects |
| `src/pages/admin/projects/new.astro` | Page SSR | Form tambah project |
| `src/pages/admin/projects/[id].astro` | Page SSR | Edit/delete project |
| `src/pages/admin/writing/index.astro` | Page SSR | List writing |
| `src/pages/admin/writing/new.astro` | Page SSR | Form tambah artikel |
| `src/pages/admin/writing/[id].astro` | Page SSR | Edit/delete artikel |
| `src/pages/admin/publications/index.astro` | Page SSR | List publications |
| `src/pages/admin/publications/new.astro` | Page SSR | Form tambah publikasi |
| `src/pages/admin/publications/[id].astro` | Page SSR | Edit/delete publikasi |
| `src/pages/admin/speaking/index.astro` | Page SSR | List speaking |
| `src/pages/admin/speaking/new.astro` | Page SSR | Form tambah event |
| `src/pages/admin/speaking/[id].astro` | Page SSR | Edit/delete event |

Total file baru: **19 files**
