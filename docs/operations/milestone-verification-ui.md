# Milestone verification UI — browser demo (M1–M3)

**App:** http://localhost:5174 (`admin/`)  
**API:** http://localhost:3001/v1  

See [PHASE-1-IMPLEMENTATION-PLAN.md](../PHASE-1-IMPLEMENTATION-PLAN.md) § Milestone verification UI gate.

## Seed logins (OTP)

| Role | Email |
|------|--------|
| Super | `cloxadmin@yopmail.com` |
| State VIC | `state.vic@yopmail.com` |
| Local MEL | `local.mel@yopmail.com` |
| Sender (ACTIVE / canBook) | `sender.qa@yopmail.com` |
| Carrier | `carrier.qa@yopmail.com` |
| Driver | `driver.qa@yopmail.com` |

Open [yopmail.com](https://yopmail.com) → enter the local-part (e.g. `sender.qa`) to read OTP mail when SMTP delivers.  
If SMTP is skipped, the login UI still shows **Dev OTP** (`EXPOSE_OTP_IN_RESPONSE`).

Dev OTP appears on the login screen when API returns `debugCode`.

## Demo script

### 1) M1 — six-role login
1. Open admin → login as each seed email (or at least Super, State, Local, Carrier).  
2. Confirm sidebar shows role (`admin/STATE_MASTER`, `user/TRANSPORT_COMPANY`, …).  
3. **Account & sessions** — see current session.  
4. As State/Local/Sender: confirm **Leads** is not in nav (Super-only).

### 2) M2 — carrier submit
1. Login as `carrier.qa@yopmail.com`.  
2. **QA: upload & submit**  
   - Upload `PUBLIC_LIABILITY` PDF/image  
   - Upload `CARGO_INSURANCE`  
   - **Submit compliance case**  
3. Note success message (company → `PENDING_REVIEW`).

### 3) M2 — Ops decide
1. Login as `local.mel@yopmail.com` → **Compliance queue** → open case.  
2. Try **Approve** if shown — should fail / not available; use **Escalate**.  
3. Login as `state.vic@yopmail.com` or Super → open case → **Approve**.  
4. Confirm company status becomes `BID_ELIGIBLE`.

### 4) M3 — new sender happy path
1. Logout → **Register** (`/register/sender`) with a fresh email.  
2. OTP login → **Sender onboarding** wizard: Business/Individual → invoice → upload doc → Submit to Ops.  
3. Super/State **Approve** in Compliance → company `PENDING_PAYMENT`.  
4. Sender refreshes → **Create SetupIntent** (mock) → **Confirm payment ready** → `ACTIVE` / `canBook=true`.  
5. Optional: `POST /v1/jobs` as incomplete sender returns `SENDER_NOT_BOOKING_READY`.

### 5) M3 — seed sender smoke
1. Login as `sender.qa@yopmail.com` → onboarding shows **Done** / canBook true (after seed).

## Pass criteria
- [ ] Happy path without Postman  
- [ ] Local cannot final-approve  
- [ ] State/Super can approve  
- [ ] Role gating visible in UI  
- [ ] Sender active only after Ops + payment (mock OK)  
- [ ] No card PAN in DB/logs  
