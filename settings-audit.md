# Settings Page Audit Report

**Date:** 2026-10-01  
**Scope:** Admin settings page and its backend APIs, models, and user-management calls.  
**Method:** Static code review; no live API or penetration testing was performed.

## Executive Summary

The admin page presents nine settings sections and saves most settings through a shared settings document. The backend has section-level validation and a dynamic integration runner, but its settings and user routes are not protected by authentication or authorization middleware. Integration credentials are returned with settings, and the integration editor's payload does not match the backend schema. These access-control and credential-handling issues should be addressed before exposing the backend beyond a trusted local environment.

## What the Admin Page Contains

| Section | Current behavior |
| --- | --- |
| General | Store name, tagline, email, phone, timezone, language, and logo URL. |
| Store Information | Business details and postal address. |
| Payment Methods | Add, edit, enable/disable, and remove named payment methods. |
| Shipping | Manage zones, regions, rates, free-shipping threshold, and default method. |
| Notifications | Toggle five notification preferences. |
| Users & Roles | List users and delete them. No create, edit, role assignment, or permission editor is shown here. |
| Security | Informational placeholder; says password changes and 2FA are unavailable through this settings API. |
| API / Integrations | Configure REST service URLs, auth type, credentials, endpoints, and enabled state. |
| Appearance | Save theme, compact sidebar, breadcrumbs, and animation preferences. |

The page loads settings on entry, loads users when the Users & Roles section is selected, and saves settings one section at a time. The admin API client attaches `adminToken` when present.

## Backend Behavior

- `GET /api/settings` returns the earliest settings document, or `{}` when none exists.
- `PUT /api/settings` accepts section updates, merges object sections, validates a few types and shipping amounts, and saves one settings document.
- The settings router also exposes generic `GET`, `PUT`, and `DELETE /api/settings/:id` routes. These operate directly on a settings document and bypass the section-level normalization used by `PUT /api/settings`.
- `POST /api/settings/execute` runs a configured integration endpoint with its saved URL, headers, and credentials.
- Settings are stored in a Mongoose `Setting` document with timestamps. Integrations include authentication credentials, headers, endpoints, webhooks, and connection state.
- The admin page's Users & Roles view calls `/api/users` and `/api/users/:id`. The users API supports list, create, update, and delete operations; the create route is also publicly mounted.

## Findings

### Critical: Settings and user APIs have no server-side access control

The Express app mounts `/api/settings` and `/api/users` without auth/admin middleware. The route files also attach no protection, and the corresponding middleware files are empty. The login endpoint issues a JWT, and the frontend sends it, but these API routes do not verify it. As currently wired, callers can read or change settings, call the generic settings-by-ID read/update/delete routes, execute integrations, enumerate or create users, update user records, and delete users without proving they are an admin. The `@access Admin` comments in the user controller do not enforce authorization.

**Recommendation:** Require JWT authentication and enforce admin/permission checks on every settings, integration-execution, and user-management route. Do not treat frontend login or CORS as authorization.

### Critical: Integration execution can be used to make server-side requests

The integration runner sends HTTP requests to the `baseUrl` stored in settings. There is no visible scheme/host allowlist, private-network/IP-range block, or request timeout. Combined with the unprotected settings write and execute routes, this creates a server-side request forgery (SSRF) path and may expose internal services or credentials.

**Recommendation:** Protect both configuration and execution routes; restrict destination hosts and protocols, block loopback/private/link-local destinations after DNS resolution, validate redirects, set strict timeouts and response-size limits, and limit outbound network access.

### High: Integration credentials are stored and returned without redaction

`GET /api/settings` returns the complete Mongoose document, including `authCredentials.apiKey`, `username`, and `password`. The schema stores these as ordinary strings; no encryption or response redaction is visible. Any party able to call the route can retrieve integration secrets.

**Recommendation:** Keep secrets out of general settings responses, return masked/presence-only values, support secret replacement without echoing existing values, restrict access, and use a secret-management or encryption-at-rest approach appropriate to deployment.

### High: New integration payload does not satisfy the backend schema

The UI builds integrations with a `category` field. The backend normalizer preserves `serviceSlug`, `title`, and connection settings but does not map `category` to `usageType`. The Mongoose integration schema requires `usageType`, so saving a newly configured integration can fail validation. The UI also offers category values such as `SMS` and `ANALYTICS`, while the schema enum uses `SMS_NOTIFICATION` and `API`.

**Recommendation:** Agree on one category field and enum across UI, normalizer, and schema; map/validate it explicitly and add a test that creates and updates an integration through the API.

### High: Integration authentication form cannot configure all supported auth types

For `BASIC`, the UI has no password input; it shows a generic API key field and username, but the backend uses `username:password`. For `CUSTOM_HEADER`, the UI edits the header name but provides no value field, while the backend sends `authCredentials.apiKey` as the header value. Those modes cannot be configured correctly from the current form.

**Recommendation:** Provide separate, appropriately masked inputs for each auth mode and verify the produced request headers with focused tests.

### Medium: Users & Roles is only a user list with delete

Despite the section name, the admin panel does not create users, edit roles, activate/deactivate accounts, or manage permissions. The User model has roles and a settings-permissions structure, but this page does not edit them and the routes do not enforce those permissions.

**Recommendation:** Either rename the section to match its current scope or implement role/permission management together with server-side authorization. Preserve at least one active super-admin account when deleting users.

### Low: `apiSettings` is declared in the frontend but unsupported by the backend

`SettingsSection` and `SettingsDocument` include `apiSettings`, but the backend allowlist and `Setting` schema do not. The current visible API / Integrations section saves `integrations`, so this mismatch appears to be stale or unfinished wiring; a direct `apiSettings` update is rejected as an unknown section.

**Recommendation:** Remove the unused `apiSettings` contract or implement it consistently if it is intended to be a real section.

### Low: Forms allow values that the database rejects

The UI allows blank payment method names, shipping zone names, and integration endpoint names. Corresponding schema fields are required, and the page has no field-level validation before save, so users may get a generic API error after submission.

**Recommendation:** Add client-side required-field validation and show the failing field/message; keep server-side schema validation as the source of truth.

## Recommended Fix Order

1. Add and verify server-side authentication and admin authorization for settings, integrations, and user routes.
2. Restrict integration destinations and execution behavior to mitigate SSRF.
3. Stop returning integration secrets and review how they are stored.
4. Align integration fields and auth forms with the Mongoose schema; cover create/update/execute with tests.
5. Decide the intended scope of Users & Roles and the unused `apiSettings` contract; improve form validation.

## Code Reviewed

- Admin page: [admin/app/setting/page.tsx](admin/app/setting/page.tsx)
- Admin settings panels: [admin/components/layout/SettingsPanels.tsx](admin/components/layout/SettingsPanels.tsx)
- Admin service and API client: [admin/services/settingsService.ts](admin/services/settingsService.ts), [admin/services/api.ts](admin/services/api.ts)
- Settings routes/controller/model: [backend/routes/settings.js](backend/routes/settings.js), [backend/controllers/settingController.js](backend/controllers/settingController.js), [backend/models/Setting.js](backend/models/Setting.js)
- User routes/controller/model: [backend/routes/users.js](backend/routes/users.js), [backend/controllers/userController.js](backend/controllers/userController.js), [backend/models/User.js](backend/models/User.js)
- Server route mounting and login flow: [backend/server.js](backend/server.js), [backend/controllers/authController.js](backend/controllers/authController.js)