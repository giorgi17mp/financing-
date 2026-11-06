# Finance v8

An in-place upgrade of the existing PWA. Same origin, manifest, IndexedDB database, legacy keys and versioned backup format. No real financial records or private credentials are bundled.

## Daily use

- Focused home: tappable debit, credit and GEL accounts; dual credit target/limit meters; quick entry; upcoming/overdue bills; calendar and recent five records. Full history and reports have separate tabs. No floating bottom plus.
- Direct GEL income credits only the Georgia account. USD-to-GEL transfer remains a separate operation.
- Compact reminder rows open details with record-and-mark, mark-only, snooze, edit and unmark. Unmark retains the ledger expense. Month-end dates clamp correctly; tracked overdue bills survive month rollover. Existing bills begin overdue tracking at upgrade month, avoiding fabricated historical debts.
- Opening balances and their cutoff date can be edited from the top of Settings. Prior versions and ledger records are retained.

## Three independent destinations

The phone's IndexedDB and localStorage mirror count as ONE destination. Owner-deployed GoogleDriveBackupV3.gs writes immutable, checksummed versions to Google Drive and a scoped Dropbox App folder. Each remote destination gets independent read-back verification. An unavailable third destination never blocks verified Drive storage and is never marked successful. Failed phone sends retry; the optional hourly server trigger retries pending Dropbox copies. Read-back checks prove integrity, not encryption or guaranteed future availability.

The home badge counts only acknowledgements for the current snapshot (1/3, 2/3, 3/3). Downloads and Web Share requests are not counted as confirmed external copies. Old external versions are retained; the owner must monitor storage quotas. Offline changes cannot reach external destinations until connectivity returns. Local browser data can be erased together; retaining external exports is still useful.

## Phone notifications

Bundled Firebase Cloud Messaging supports background/closed-app delivery and a foreground listener on every authorized launch. Owner-configured Apps Script uses a service account kept exclusively in private Script Properties, an hourly trigger, timezone-aware bill checks and per-device daily deduplication. Lock-screen text includes counts only. Permission, connectivity, OS delivery and service quotas still apply; HTTP acceptance is not handset receipt. Scheduling uses the last synced snapshot.

**Activation required:** install the v3 script in the owner's Google account, authorize a Dropbox App folder with an offline refresh token, configure Firebase, install the hourly trigger, then enable/test notifications on the actual phone. See setup.html. No live cloud credentials, real-device notification receipt or 3/3 protection was verified during development. No Samsung Cloud integration is claimed.

## Validation

37 automated tests cover atomic failure, migration, concurrent tabs, checksums, independent backup failures, backend idempotency, reminder rollover/deduplication, direct GEL income, account entry shortcuts, opening-balance edits and duplicate-expense prevention. Backend tests mock external services. Browser QA uses synthetic records at 390px mobile width. Service-worker tests verify reload-cache installation, canonical index navigation (including version query strings), and scoped cache cleanup. Root navigation never reuses a separate stale cached home document.

Run `npm ci && npm test`. `npm run build:push` rebuilds the vendored Firebase client and worker bundles. Apache 2.0 license: FIREBASE_LICENSE.txt. No runtime CDN scripts.

---

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
