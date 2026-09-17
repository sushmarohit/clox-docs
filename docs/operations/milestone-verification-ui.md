# Milestone verification UI — browser demo (M1/M2)

**App:** http://localhost:5174 (`admin/`)  
**API:** http://localhost:3001/v1  

This is the **mandatory demo gate** before M3. See [PHASE-1-IMPLEMENTATION-PLAN.md](../PHASE-1-IMPLEMENTATION-PLAN.md) § Milestone verification UI gate.

## Seed logins (OTP)

| Role | Email |
|------|--------|
| Super | `cloxadmin@yopmail.com` |
| State VIC | `state.vic@clox.test` |
| Local MEL | `local.mel@clox.test` |
| Sender | `sender.qa@clox.test` |
| Carrier | `carrier.qa@clox.test` |
| Driver | `driver.qa@clox.test` |

Dev OTP appears on the login screen when API returns `debugCode`.

## Demo script (~10 min)

### 1) M1 — six-role login
1. Open admin → login as each seed email (or at least Super, State, Local, Carrier).  
2. Confirm sidebar shows role (`admin/STATE_MASTER`, `user/TRANSPORT_COMPANY`, …).  
3. **Account & sessions** — see current session.  
4. As State/Local/Sender: confirm **Leads** is not in nav (Super-only).

### 2) M2 — carrier submit
1. Login as `carrier.qa@clox.test`.  
2. **QA: upload & submit**  
   - Upload `PUBLIC_LIABILITY` PDF/image  
   - Upload `CARGO_INSURANCE`  
   - **Submit compliance case**  
3. Note success message (company → `PENDING_REVIEW`).

### 3) M2 — Ops decide
1. Login as `local.mel@clox.test` → **Compliance queue** → open case.  
2. Try **Approve** if shown — should fail / not available; use **Escalate**.  
3. Login as `state.vic@clox.test` or Super → open case → **Approve**.  
4. Confirm company status becomes `BID_ELIGIBLE`.

### 4) M2 — sender path (optional)
1. Login as `sender.qa@clox.test` → upload `ABN_EXTRACT` → submit `SENDER_KYB`.  
2. Super/State **Approve** → company `PENDING_PAYMENT` (active waits M3 Stripe).

## Pass criteria
- [ ] Happy path without Postman  
- [ ] Local cannot final-approve  
- [ ] State/Super can approve  
- [ ] Role gating visible in UI  
