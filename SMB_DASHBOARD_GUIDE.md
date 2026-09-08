# Marxia SMB Dashboard — Progress and Section Guide

**Repository:** `X-Magno-Maximus/smbs`  
**Last updated:** September 6, 2026  
**Status:** Living MVP guide — update this document as pages, integrations, permissions, and workflows change.

## 1. Purpose

The Marxia SMB Dashboard is the primary business-management reference for the Marxia platform. It brings together business operations, products, clients, orders, inventory, logistics, accounting, staff access, approvals, and audit history.

The dashboard is being created and corrected one page at a time. Its shared structure and security patterns will guide later product levels:

1. Freemium
2. Individual
3. Freelancer
4. PRO
5. SMB

This file records what each current section is for, what has been implemented in the interface, and what still requires trusted backend integration.

## 2. Current Dashboard Structure

### Overview — `index.html`

The Overview is the SMB's operational landing page.

It currently provides:

- Responsive dashboard shell.
- Left vertical navigation that slides open and closed.
- Search.
- Profile and appearance menu.
- Light and Dark themes.
- English and Spanish selectors.
- Separate IT Tech Support access.
- Business greeting and high-level performance view.
- Client and Product creation cards.
- Revenue and Orders over-time graph.
- Net sales, gross profit, inventory value, and receivables summaries.
- Today, Business Health, Low Stock, and Fulfillment Progress panels.
- Recent Orders and Top Products views.

#### Add Client

Opens the client form.

- Supports Customer or Business records.
- Customer records use the customer name.
- Business records reveal Business Name, Tax ID, and Business Address.
- Business Name and Tax ID are required for Business records.
- Email and contact details support future invoicing and notification delivery.

Actual invoice-email delivery requires the production messaging and invoicing backend.

#### Add Product

Opens the product form.

- Product image.
- Product name.
- Price.
- SKU.
- Stock quantity.
- VAT/tax.
- Availability state.
- Inventory Product Search by product name or SKU.
- Selecting an existing inventory item populates its current product fields.

The current catalog data is an interface dataset. Production inventory must come from the authorized inventory service.

#### Business Summary Connections

- Net Sales opens Orders.
- Gross Profit opens Accounting.
- Inventory Value opens Inventory.
- Business Health opens Accounting.
- Fulfillment Progress opens Logistics.

Destination pages that remain staged must not be represented as production-complete.

#### IT Tech Support

The `?` control opens the Support Request form.

The form includes:

- End-user name.
- Account email.
- Support category.
- Issue details.
- Requested temporary-access period.
- Masked re-authentication field.
- Explicit temporary-support consent.

Passwords must never be added to a support ticket, audit message, or IT Support view. Production re-authentication must be verified only by the authentication service before short-lived support access is issued.

## 3. Logistics — `logistics.html`

The Logistics page is the source view for fulfillment and shipment activity.

It currently provides:

- Fulfillment-progress summary.
- Shipment and order queue.
- Delivery status.
- Carrier assignment.
- Shipment scheduling.
- Search and status filtering.
- Links between shipment records and Accounting.
- Logistics cost and settlement status.

The Logistics page supplies operational shipment events. Accounting remains the financial source of truth for approved expenses, shipping charges, and reconciliation.

Production integration must validate tenant, role, shipment, and order authorization on the server.

## 4. Accounting — `accounting.html`

The Accounting page explains business health and reconciles operational costs.

It currently provides:

- Net Sales MTD.
- Gross Profit MTD.
- Receivables.
- Logistics Costs MTD.
- Business Health.
- Basic accounting flow.
- Logistics cost reconciliation.
- Recent transactions.
- Transaction-entry form.
- Search and reconciliation-status filters.

The accounting sequence follows:

1. Sales Revenue − Returns and Discounts = Net Sales.
2. Net Sales − Cost of Goods Sold = Gross Profit.
3. Gross Profit − Operating Expenses − Other Expenses and Taxes = Net Profit.
4. Opening Capital + Contributions + Net Profit − Withdrawals = Closing Equity.

Displayed figures currently support MVP visualization. Production financial entries require validated business rules, immutable audit records, authorized posting, and server-side reconciliation.

## 5. Settings & Access — `settings-access.html`

Settings & Access controls business identity, employees, roles, approvals, end-user access, notifications, and historical records.

### Business Profile

Business Profile is locked by default and requires SMB Owner authorization before its protected fields can be viewed or changed.

Authorization controls:

- SMB Owner password field.
- `Authorize` button.
- Protected fields remain disabled until authorization.
- The password is cleared and disabled immediately after authorization.
- Explanations for every Business Profile field and button appear on mouse hover rather than as additional visible instructions.

Authorized profile fields:

- Business name.
- Tax ID.
- Business address.
- Business email.
- Business phone.
- Owner-email notifications for staff access, role, and promotion changes.

The authorization-change notification setting appears immediately before Save Business Profile. Production must verify the password through the authentication service; the browser interface must not store it or treat a non-empty value as authoritative verification.

### Employees & Staff

Displays the employee directory with:

- Employee name.
- Position.
- Status.
- Last access.
- Review.
- Request Password Reset.
- Suspend or Restore Access.
- Delete Access.

Security behavior:

- Password Reset requests a secure, expiring reset link; passwords are never displayed or emailed.
- Suspend represents immediate access suspension and active-session revocation for lost or stolen devices.
- Delete Access removes application access only.
- Employee identity, employment record, account history, and audit history remain preserved.

#### Add New Employee

The form collects:

- First name.
- Last name.
- Address.
- Email.
- Phone.
- Selected position.

Available positions are displayed as clickable buttons. The selected position remains highlighted.

The form includes the mandatory Account & Authentication package:

- Authorization.
- Authentication.
- Multifactor authentication.
- Automatic session lock.
- Notify Owner about new sign-ins.

These requirements are checked, grayed, and locked because they are automatically applied and cannot be removed during employee creation.

The instruction is:

> Once the record has been created, it needs approval; request approval by clicking the Request Approval button above.

#### Existing Employee Search

The Add New Employee form also searches existing employees by exact full name or email.

When an existing employee is found:

- Their record and current role populate the form.
- `Approved` is disabled and gray to show existing Supervisor or Manager approval.
- Request Approval remains available.
- Promote remains available.
- Deactivate remains available.
- Delete remains available.

Promote, Deactivate, and Delete select a proposed change. They do not silently apply it. The Supervisor or Manager must submit Request Approval, and the requested action is recorded and sent for final SMB Owner authorization.

#### New Employee Approval Request

Request Approval requires the requester to type or paste the selected position before proceeding.

The request records:

- Employee.
- Requested position or access change.
- Requesting authenticated user.
- Date and time.
- Pending approval status.
- Business Owner notification state.

Creating or updating an employee record does not independently grant or modify application access.

### Account, Roles & Approvals

This dropdown contains the remaining RBAC and approval controls.

#### Business Owner Authorization

Sensitive approvals require Owner re-authentication. Passwords must be verified by the authentication service and must never be stored in this page or written to audit records.

#### Roles & Access Permissions

Current role categories include:

- Supervisor.
- Employee / Staff.
- Independent Contractor.

Every role displays:

- Predetermined access purpose.
- Current approval/activity status.
- Staff assigned to the role.
- Assignment count.
- Request Owner Approval.
- Approve.
- Deactivate/Activate.
- Delete.

Current demonstrated assignments:

- Supervisor: Isaac Silva.
- Employee / Staff: Luis Mora.
- Independent Contractor: no staff assigned.

An empty assignment is shown explicitly rather than inventing an employee.

#### Approvals & Promotions

Used for role changes and privileged access requiring Owner review.

It includes:

- Promotion requests.
- Management Admin access.
- IT SuperUser privileged-role requests.
- Request Owner Approval.
- Approve.
- Deactivate/Activate.
- Delete.

The IT SuperUser role is intentionally located under Approvals & Promotions because it requires direct SMB Owner authorization.

### End-User Access — Usuario

Used to search and manage end-user application access.

Search supports:

- First name.
- Last name.
- Email.

Every end-user record displays:

- First name and last name.
- Email.
- Access status.
- Approve.
- Deactivate.
- Delete.
- Request Owner's Approval.
- Password Reset.

Completed actions become disabled, gray, and past tense:

- Approve → Approved.
- Deactivate → Deactivated.
- Delete → Deleted.
- Request Owner's Approval → Requested.

Password Reset remains reusable. Delete removes application access while preserving identity and historical records.

Every action creates a timestamped audit entry.

### Notifications & Audit History

This is a read-only historical viewer.

It provides:

- Approval and access event.
- Requester or actor.
- Business Owner email-notification record.
- Decision or result.
- Date and time.
- 30-day filter.
- 3-month filter.
- 6-month filter.
- 12-month filter.
- Custom date range within the available 12 months.

Historical approval information is also retained through Business Owner email notifications.

## 6. Shared RBAC Requirements

The dashboard follows least privilege and separation of duties.

### Employee / Staff

- Assigned operational screens and tasks only.
- No administrative or Owner authority.

### Independent Contractor

- Time-bound access.
- Assigned work only.
- No general dashboard access.

### Supervisor

- Operational review.
- Staff task oversight.
- Limited management approval.
- Cannot provide final Owner authorization.

### Manager

- Department operations.
- Employee review.
- Promotion and access recommendations.
- Cannot replace ultimate SMB Owner approval.

### Management Admin

- Administrative management.
- Direct SMB Owner approval required.
- No automatic Owner-level authority.

### IT SuperUser

- Approved technical support and troubleshooting only.
- Purpose-limited and time-limited access.
- Direct SMB Owner authorization required.
- No unrestricted business-data entitlement.

### Director

- Department oversight.
- Reporting.
- Approval recommendations.
- Final access depends on Owner authorization.

### Vice President

- Executive and cross-department oversight.
- Direct SMB Owner approval required.
- No ability to override the Business Owner.

### Business Owner

- Ultimate authorization for employee access, privileged roles, promotions, and sensitive changes.
- Owner authority cannot be assigned through the normal employee form.
- Sensitive approvals require Owner re-authentication.

## 7. Product-Level Foundation

The SMB dashboard is the most complete operating reference. Later tiers should reuse its shared shell, accessibility, theme, language, security, and audit patterns while limiting features by approved entitlement.

| Tier | Intended foundation |
|---|---|
| Freemium | Essential account, limited catalog/client tools, basic activity view |
| Individual | Single operator, personal business activity, products or services, clients |
| Freelancer | Client, contract, service, invoice, receivable, and schedule workflows |
| PRO | Expanded reporting, automation, integrations, and professional controls |
| SMB | Full staff RBAC, approvals, inventory, orders, logistics, accounting, support, and audit history |

This table establishes the product direction, not final pricing or production entitlement rules. Every tier's exact limits must be separately approved before enforcement.

## 8. Security and Governance Baseline

The intended control direction uses principles from NIST, CISA, OWASP, and PCI DSS.

Current design requirements include:

- Deny by default.
- Least privilege.
- Tenant isolation.
- Role-based access control.
- Separation of duties.
- Explicit Owner authorization.
- Re-authentication for sensitive actions.
- Multifactor authentication.
- Automatic session locking.
- New sign-in notifications.
- Secure password-reset links.
- Short-lived support access.
- Server-side validation.
- Audit logging.
- Protected deletion.
- No password exposure.
- No payment-card storage in dashboard pages.

These principles represent the intended architecture. They do not by themselves constitute compliance certification.

## 9. Interface-Ready vs Backend-Required

### Interface-ready

- Responsive pages and navigation.
- Light and Dark presentation.
- English and Spanish selection controls.
- Dialogs and forms.
- Search and filtering.
- Visual role and approval states.
- Staff assignment lists.
- Audit-history viewer.
- Cross-page navigation.
- Client, Product, Employee, Logistics, Accounting, and Support workflows.

### Trusted backend still required

- Real authentication and re-authentication.
- MFA enrollment and verification.
- Authoritative tenant and RBAC enforcement.
- Owner-approval delivery and processing.
- Transactional inventory reduction.
- Sales posting.
- Order Taker integration.
- Invoice and notification delivery.
- Password-reset delivery.
- Session revocation.
- Support-access token issuance and expiration.
- Durable, tamper-resistant audit storage.
- Logistics and accounting persistence.
- Payment processing.
- Production monitoring and fraud analysis.

Browser state, hidden controls, or local storage must never be treated as authoritative authorization.

## 10. Planned Page Stages

The shared navigation includes additional pages that will continue to be built and corrected independently:

- Orders.
- Products.
- Inventory.
- Marketplace.
- Reports.

Each page should reuse the approved dashboard shell and connect only to the data and actions required by its role.

## 11. Update Procedure

For every future dashboard change:

1. Confirm the exact page and section.
2. Preserve unrelated functionality.
3. Confirm role and Owner-approval boundaries.
4. Confirm Light and Dark contrast.
5. Confirm desktop, laptop, tablet, and mobile behavior.
6. Confirm mouse, keyboard, and accessible labels.
7. Confirm actions, links, triggers, and dialogs.
8. Confirm sensitive data is not exposed.
9. Identify whether the behavior is interface-only or backend-enforced.
10. Update this guide when the section's purpose or behavior changes.
11. Commit through a focused pull request.
12. Verify the merged `main` branch.

## 12. Change Log

### September 6, 2026

- Re-established the SMB Overview dashboard.
- Added Client and Product creation workflows.
- Added Inventory Product Search.
- Connected Business Health to Accounting.
- Connected Fulfillment Progress to Logistics.
- Created Logistics and Accounting pages.
- Created Settings & Access.
- Added Business Profile controls.
- Added employee directory access controls.
- Added New Employee and Existing Employee workflows.
- Moved Account & Authentication requirements into Add New Employee.
- Consolidated Roles & Access Permissions and Approvals & Promotions.
- Moved IT SuperUser to Approvals & Promotions.
- Added staff-assignment lists under RBAC roles.
- Added searchable End-User Access.
- Added read-only 12-month Notifications & Audit History.
- Improved button size, tooltips, and Light/Dark contrast.

---

This is a living guide. Update it as the Marxia SMB Dashboard is corrected, expanded, integrated, tested, security-tested, moved through BETA, and prepared for production.


## Responsive overview graph — September 7, 2026

The Revenue & Orders graph uses the full content width and a viewport-based plotting height with a 320px desktop minimum, replacing the fixed 170px plot. Other overview cards follow below the graph. On phones the plot uses 340px height and fewer date labels to avoid overlap. Canvas rendering follows its measured CSS dimensions and device pixel ratio; ResizeObserver redraws during sidebar width changes. Legend, date, and axis labels are larger; the dark-theme legend matches the sales line. Existing chart data and reporting periods are unchanged.

Verification: JavaScript syntax checked; responsive sizing and label spacing reviewed in source. Browser visual verification remains pending.


## Larger overview cards and explanatory text — September 7, 2026

The three attention items are now separate taller cards. Financial cards use a 220px minimum height and switch to two columns below 1400px and one column on phones. Every card includes a visible 14px explanation below a divider, translated into Spanish through the existing language system. Text wraps freely and card heights can grow. Explanation colors are #45554e on white and #d4e2dc on the dark surface. Existing data and click behavior are preserved; explanations describe the metrics without claiming unfinished destinations work. Receivables retain the existing aging-group wording until its age basis is defined.

Validation: translation JavaScript parses; all seven explanations and Spanish translations are present. Layout rules reviewed for narrow screens and wrapping. Browser visual verification remains pending.


## Full-width card rows and deferred rendering

The attention row uses three equal columns and financial metrics four equal columns when the dashboard content area exceeds 1000px. Container queries respond to actual available width as the sidebar opens or closes. Financial cards wrap to two columns at 1000px, and all cards use one column at 650px. Desktop cards have minimum heights of 190px (attention) and 250px (financial), with flexible text wrapping and existing bilingual explanations.

The Today/Business health/stock/fulfillment grid and the transaction tables use native content-visibility:auto to defer off-screen layout and paint. Intrinsic fallback heights reserve scroll space; browser-measured heights replace estimates. Unsupported browsers render normally. Print renders all sections. This is lazy rendering of existing static sections, not deferred backend data fetching or a claim of reduced network payload. No business records are loaded from a backend by this change.

Validation: all seven explanation elements retained; container breakpoints and print fallback checked in source. Browser visual and performance verification remains pending.


## IT Support popup on every dashboard screen

Overview, Accounting, Logistics, and Settings & Access now use the same top-bar question-mark button and support.js module. The module creates the existing Support Request form on first click and opens it in place, without navigation. Newly added dashboard pages must include the shared script and data-support-open button. The dialog supports native Escape dismissal, explicit close and Cancel, outside clicks, focus return, responsive existing form styling, and English/Spanish text. Dialog construction occurs after page-specific handlers have registered, so generic transaction/settings handlers do not submit or close it.

Password fields are cleared on close, submit, and page exit and are never logged, stored, or sent by this UI. There is no connected support/authentication service yet: submitting keeps the form open and clearly states that the request has not been sent. No access grant, email, ticket creation, or identity verification is claimed. Existing form fields and authorization controls are retained.

Validation: all four HTML screens contain one shared opener and one shared module; duplicate Overview support markup and handlers removed; JavaScript syntax checked. Browser interaction verification remains pending.


## Staff Roles, Access & Activity — September 8, 2026

Settings now offers one shared directory with Permissions and Activity views. The former Roles group links to this directory; the former End-User Access list is incorporated. Employee identities/job titles reference the existingEmployees objects. Existing unassigned example accounts and privileged role identities are retained without inventing jobs or login history. Both views share the same in-memory permission drafts. Activity view shows the proposed permissions as muted read-only reference; Permissions view shows activity as muted read-only context. Search matches name, email, and job.

Each person can prepare application activation and per-screen Read/Write/Approve/Audit proposals. All current permissions remain unknown until authoritative data is available; initial unchecked proposals are not claims of current access. Owner-review preparation is explicitly not submission, approval, or live authorization. Nothing is persisted as authorization, no email is claimed, and no audit event is fabricated. Integration must supply authenticated tenant-scoped identity/activity, verified owner approvals, and server audit events before applying changes. Privileged roles require manual owner review. Drafts are temporary until reload. Existing approval/promotion workflows outside this section are unchanged.

Activity fields include last login with timezone, branch, device/browser, approximate location, and session status. All use Not available pending real records. EN/ES, contrast, narrow-screen layout, and keyboard controls included. Syntax and reference checks completed; browser visual/interaction verification pending.
