# Milestone verification UI — browser demo (M1–M5)

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
| Carrier (BID_ELIGIBLE / canBid) | `carrier.qa@yopmail.com` |
| Driver (ACTIVE / canBeAssigned) | `driver.qa@yopmail.com` |

Open [yopmail.com](https://yopmail.com) → enter the local-part (e.g. `sender.qa`) to read OTP mail when SMTP delivers.  
If SMTP is skipped, the login UI still shows **Dev OTP** (`EXPOSE_OTP_IN_RESPONSE`).

Dev OTP appears on the login screen when API returns `debugCode`.

## Demo script

### 1) M1 — six-role login
1. Open admin → login as each seed email (or at least Super, State, Local, Carrier, Driver).  
2. Confirm sidebar shows role (`admin/STATE_MASTER`, `user/TRANSPORT_COMPANY`, `user/DRIVER`, …).  
3. **Account & sessions** — see current session.  
4. As State/Local/Sender: confirm **Leads** is not in nav (Super-only).

### 2) M2 — carrier submit (legacy QA path)
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

### 6) M4 — new carrier happy path
1. Logout → **Register as carrier** (`/register/carrier`) with a fresh email.  
2. OTP login → **Carrier onboarding** wizard:  
   Legal (ABN) → Docs (PL + cargo) → Stripe Connect (mock setup + confirm) → Vehicle → Driver invite → Capabilities → Submit to Ops.  
3. Super/State **Approve** `CARRIER_KYB` → company `BID_ELIGIBLE`.  
4. Carrier refreshes → `canBid=true` only if Connect + fleet + capabilities complete.  
5. Optional: bid stub returns `CARRIER_NOT_BID_ELIGIBLE` when Connect/fleet incomplete.

### 7) M4 — seed carrier smoke
1. Login as `carrier.qa@yopmail.com` → onboarding shows **Done** / `canBid=true` (after seed: Connect + vehicle + driver).

### 8) M5 — new driver invite path
1. As carrier → **Drivers** step → invite a fresh email → copy **Invite URL** (shown when SMTP skipped).  
2. Logout → open `/driver/invite/:token` → **Accept invite**.  
3. OTP login as that email → **Driver onboarding** → licence class/number/expiry + NHVR → **Submit & activate**.  
4. Confirm `ACTIVE` / `canBeAssigned=true`.  
5. Carrier may **Resend** while still `INVITED`.

### 9) M5 — seed driver smoke
1. Login as `driver.qa@yopmail.com` → onboarding shows **Driver active** / canBeAssigned true.

## Pass criteria
- [ ] Happy path without Postman  
- [ ] Local cannot final-approve  
- [ ] State/Super can approve  
- [ ] Role gating visible in UI  
- [ ] Sender active only after Ops + payment (mock OK)  
- [ ] Carrier bid-eligible only after Ops + Connect + fleet (mock OK)  
- [ ] Driver active only after invite accept + licence + NHVR  
- [ ] No card PAN / bank secrets in DB/logs  
