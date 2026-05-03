# VMORA Security Audit (2026-03-21)

## Scope
- Frontend: React/Vite app routing, global UX behavior, client admin token handling.
- Backend: Vercel serverless endpoints in `api/`.
- Infra config: `vercel.json` headers.

## Method
- Static code review of API entry points and auth flow.
- Configuration review for transport/security headers.
- Targeted hardening changes applied and re-validated via production build.

## Risk Summary
- Critical: 0
- High: 1 (fixed)
- Medium: 4 (3 fixed, 1 open)
- Low: 4 (fixed)

## Findings

### 1) Hardcoded admin fallback token (HIGH) - FIXED
- Risk: predictable fallback credential allows unauthorized admin access if env var is missing.
- Evidence: previous `api/_lib/admin-auth.js` had default token fallback.
- Fix:
  - Removed fallback token.
  - Enforced `ADMIN_TOKEN` presence.
  - Added constant-time token compare to reduce timing side-channel risk.

### 2) Internal error leakage in JSON responses (MEDIUM) - FIXED
- Risk: raw exception messages expose implementation details.
- Affected endpoints (fixed):
  - `api/content.js`
  - `api/diamonds.js`
  - `api/jewelry.js`
  - `api/user-state.js`
  - `api/admin-content.js`
  - `api/admin-diamonds-delete.js`
  - `api/admin-import-revert.js`
  - `api/admin-imports.js`
  - `api/admin-jewelry.js`
  - `api/admin-stats.js`
- Fix: return generic 500 messages and keep details server-side only.

### 3) Missing defensive headers on API routes (MEDIUM) - FIXED
- Risk: weaker browser-side protections (sniffing, framing, policy leakage).
- Fix:
  - Added reusable security helper in `api/_lib/security.js`.
  - Added common security headers on audited routes:
    - `X-Content-Type-Options: nosniff`
    - `X-Frame-Options: DENY`
    - `Referrer-Policy: strict-origin-when-cross-origin`
    - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - Added baseline edge headers in `vercel.json`, including HSTS.

### 4) No CSRF-style origin validation on writes (MEDIUM) - FIXED (selected routes)
- Risk: cross-origin write attempts to stateful/admin endpoints.
- Fix:
  - Added `rejectIfCrossOriginWrite` and applied to:
    - `api/user-state.js`
    - `api/admin-content.js`
    - `api/admin-diamonds-delete.js`
    - `api/admin-import-revert.js`
    - `api/admin-jewelry.js`

### 5) No request throttling on user-state write path (MEDIUM) - FIXED
- Risk: abusive write bursts, elevated DB load.
- Fix:
  - Added in-memory rate limiter for `api/user-state.js`.
  - Added request size guard and bounded list sizes.

### 6) Missing OPTIONS handling on several APIs (LOW) - FIXED
- Risk: brittle browser/intermediary behavior and CORS preflight failure.
- Fix: explicit `OPTIONS` handling added on audited APIs.

### 7) Inconsistent cache behavior for sensitive API responses (LOW) - FIXED
- Risk: accidental caching of state/admin responses.
- Fix:
  - Applied `no-store` policy on admin and user-state endpoints.
  - Applied short public cache policy on catalog/content endpoints.

### 8) Admin token stored in localStorage (MEDIUM) - OPEN
- Risk: token theft possible under XSS conditions.
- Current status: not changed to avoid breaking existing admin UX flow.
- Recommended next step:
  - Move to httpOnly, secure, sameSite cookies with short-lived session tokens.
  - Add server-side session invalidation and rotation.

### 9) Input validation depth on admin payloads (LOW) - PARTIAL
- Risk: malformed but non-SQL payloads can still reach business logic.
- Current status: basic validation exists; parameterized SQL prevents injection.
- Recommended next step:
  - Add schema validation (e.g., Zod) for all admin write endpoints.

## Changes Applied
- `api/_lib/security.js` (new)
- `api/_lib/admin-auth.js`
- `api/user-state.js`
- `api/content.js`
- `api/diamonds.js`
- `api/jewelry.js`
- `api/admin-content.js`
- `api/admin-diamonds-delete.js`
- `api/admin-import-revert.js`
- `api/admin-imports.js`
- `api/admin-jewelry.js`
- `api/admin-stats.js`
- `vercel.json`

## Verification
- Build command: `npm run build`
- Result: success.

## Recommended Follow-up (Priority Order)
1. Replace localStorage admin token with secure cookie-based session auth.
2. Add schema validation for all API writes.
3. Add centralized request logging and security event alerts (429/401/403 rates).
4. Add periodic dependency audit in CI (`npm audit --production`).
