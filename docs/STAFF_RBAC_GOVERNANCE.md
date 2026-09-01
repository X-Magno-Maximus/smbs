# Staff RBAC Governance

## Purpose

This standard governs staff access for the SMB and Logistics dashboards. It applies least privilege, explicit owner approval, auditable lifecycle changes, and time-bound access.

## Core rules

1. No staff member receives unrestricted SMB-owner access.
2. Owner security, MFA, owner email, ownership transfer, and staff administration are never assignable through staff RBAC.
3. Staff passwords are created and reset by the staff member through a verified email flow.
4. The owner password may verify a privileged action, but it must never be stored, logged, emailed, displayed to staff, or included in an audit event.
5. UI controls are prototypes until authorization, authentication, session revocation, time restrictions, notifications, and audit storage are enforced by the trusted backend.

## Access tiers

### Supervisors and operational staff

Applicable presets:

- Supervisor
- Accounting Staff
- Inventory Staff
- Sales Staff
- Logistics Staff
- Auditor

Each preset has an owner-controlled ON/OFF toggle. Individual permissions are limited to:

- Read
- Write
- Approve
- Audit

The owner may reduce a preset. Increasing access requires owner-password confirmation and an audit event.

### Privileged positions

Applicable positions:

- Management Admin
- IT SuperUser
- VP Operations
- VP Finance
- Custom privileged role

Privileged positions receive no automatic RBAC permissions. The SMB owner must assign each business-area permission manually and confirm the change using the owner’s current password and verified owner email.

An IT SuperUser remains operational support personnel and does not inherit SMB ownership, financial ownership, or unrestricted business-data access.

## Business areas

RBAC may be assigned only for approved business areas:

- Overview
- Orders
- Products
- Inventory
- Marketplace
- Logistics
- Accounting
- Reports

## Authorization and authentication

A staff invitation requires:

- First and last name
- Position
- Private salary record
- Email address (verification pending at invitation time)
- Phone and optional WhatsApp number
- Assigned branch
- Invitation method
- RBAC preset or manual privilege matrix
- Approved working days and hours
- SMB-owner confirmation
- Owner current-password verification

An invitation may be created before the staff email is verified. The account must remain inactive until the staff member completes email authentication.\n\nThe invitation or password-reset email allows the staff member to create their own password. Owners and managers cannot view, set, copy, or receive staff passwords.

Authorization and email authentication are separate events. Both must generate:

- An owner notification
- A timestamped audit event
- Staff identity and affected role
- Action outcome
- Initiating authority
- No passwords or authentication secrets

## Staff-wide and individual controls

The dashboard must provide:

- A master Activate/Deactivate toggle for all staff access
- An individual Activate/Deactivate toggle for every staff member
- Suspension and restoration
- Access revocation
- Password-reset delivery to the verified staff email
- A protected Delete action

Master and individual access changes require owner verification and audit logging.

## Promotions and role changes

Management may recommend a promotion or role change. A recommendation does not change access.

The change becomes effective only after the SMB owner:

1. Reviews the proposed position.
2. Reviews the resulting RBAC privileges.
3. Confirms the action with the owner’s current password.
4. Generates an owner notification and audit event.

A promotion into a privileged position clears automatic presets and requires manual RBAC assignment.

## Working-hour restrictions

Staff activity may be limited by:

- Branch
- Approved weekdays
- Start time
- End time
- Account status
- Master staff-access status

Working schedules and salary are visible only to authorized business owners and explicitly authorized managers. The trusted backend must deny off-hours requests; hiding UI controls is not sufficient.

## Safe deletion

Deletion is a two-stage process:

1. Revoke the staff member’s access.
2. Open a dedicated confirmation dialog, enter the owner password, and click **Delete**.

Deletion must create a final owner notification and audit event. Where legal, tax, employment, security, or incident-retention requirements apply, retain the audit record even if the user-facing staff record is removed.

## Audit events

At minimum, record:

- Invitation created
- Authentication email queued
- Email authentication confirmed
- Authorization activated or deactivated
- Master staff access activated or deactivated
- RBAC preset activated or deactivated
- Manual privilege update
- Password reset requested
- Suspension or restoration
- Promotion recommendation
- Final owner promotion approval
- Revocation
- Deletion

Audit records should be append-only, access-controlled, timestamped, and protected from staff modification.

## Production enforcement checklist

- Deny by default on the backend.
- Verify tenant and branch boundaries on every request.
- Enforce RBAC server-side.
- Enforce working hours server-side.
- Require recent owner reauthentication for privileged actions.
- Revoke sessions immediately after individual deactivation, suspension, master deactivation, or revocation.
- Send owner notifications through a trusted backend service.
- Protect audit logs from update and deletion.
- Rate-limit invitations, password resets, and authentication attempts.
- Require MFA for SMB owners and privileged administrators.

## Revoked-record immutability

After revocation:

- The authorization toggle remains OFF.
- RBAC presets and individual permissions cannot be changed.
- Promotions and role changes cannot be approved.
- Password-reset and authentication actions cannot be initiated.
- The record remains available only for authorized audit review and protected deletion.

A revoked record may be deleted only through the dedicated owner-confirmation dialog. The final audit event must be written before the user-facing record is removed.

## Legacy-role migration

Existing staff records must retain the safest equivalent access when the RBAC model changes.

- Legacy **Read only** maps to read access across approved business areas.
- Legacy operational roles map to their corresponding lower-staff presets.
- Unknown or privileged legacy roles receive no automatic elevated permissions.
- Migration must never silently expand Write, Approve, Audit, owner, security, or staff-administration privileges.

## Notification delivery states

Authorization, authentication, password-reset, RBAC, promotion, suspension, revocation, and deletion events must expose a delivery state:

- Queued
- Sent
- Delivered
- Failed

The current frontend prototype may record **Queued** only. It must not claim that an email was sent or delivered until the trusted notification backend confirms that outcome.

Notification payloads must exclude passwords, password hashes, reset tokens, MFA secrets, session tokens, and authentication answers.

## Verification boundary

A non-empty password field in the frontend demonstrates the approval interaction only. Production authorization requires recent server-verified owner reauthentication.

The trusted backend must:

1. Verify the SMB owner identity and current authentication state.
2. Confirm the verified owner email.
3. Apply tenant, branch, RBAC, and working-hour policies.
4. Commit the access change and immutable audit event atomically.
5. Queue the owner notification only after the change succeeds.
6. Return a non-sensitive result to the interface.

Frontend state, hidden fields, disabled buttons, local storage, or visual toggles are never authoritative security controls.

