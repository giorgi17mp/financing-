# Finance v7

This updates the existing Finance application and preserves its manifest, installation identity and URL.

## Data durability

Legacy v6 localStorage records migrate once to IndexedDB. Original v6 keys are retained, never rewritten. Missing or corrupt storage stops initialization instead of falling back to embedded history. Personal historical records are no longer bundled in HTML.

Every mutation commits a checksummed envelope and a version snapshot in one transaction, requesting strict durability where supported. A revision check rejects stale writes from another tab. A separate localStorage mirror is written only after commit; failures are visible. Both copies are browser-local and can be erased together by clearing site data. JSON exports or verified external backups remain necessary.

Versions retain 80 recent saves, up to 60 daily checkpoints, and import/migration/reconciliation versions. Deleted entries go to a recoverable trash. JSON import validates structure, IDs and checksum where present, previews conflicts, and offers merge or full replacement. Historical invalid calendar dates are preserved and flagged, never silently rewritten.

Cloud synchronization requires protocol v2 and an acknowledgement matching the backup ID and SHA-256. Offline and failed sends remain pending across restarts. No opaque/no-cors response is accepted as success. The supplied Apps Script uses a private Script Property token, idempotent writes and read-back verification. It never overwrites/deletes previous Drive backups. This script must be deployed separately in the owner's Google account; live Drive connectivity is not claimed by the application update.

## Functionality

Monthly summaries, category budgets, full-history pagination and filters, CSV, configurable opening balances, and persistent version restore. USD/GEL totals remain separate. Credit repayment and transfers are shown separately from purchases. Current balances exclude future dates. Calendar month navigation, end-of-month bills, overdue reminders and GEL reminder payments are corrected. Mark-only status avoids duplicating an already recorded expense.

The existing mobile design remains, with readable status and a fixed quick-action bar. PWA updates preserve data and never reload an unsaved editor automatically. Close all app tabs/windows and reopen to activate an update; do not clear site data.

## Verification

`npm ci && npm test`

Tests cover legacy migration, malformed storage, aborted transactions, quota failure, competing tabs, checksums, snapshot retention, cents arithmetic, invalid dates, entry save/delete/restore/undo, GEL reminders and cloud acknowledgement failures. Browser checks use synthetic data only.

`npm run build:hash` rebuilds the vendored SHA-256 fallback; see HASH_LICENSE.txt. There are no runtime CDN dependencies.
