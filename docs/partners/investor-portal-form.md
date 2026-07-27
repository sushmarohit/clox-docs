# Investor Portal Form (Canonical)

**Source:** `clox_investor_portal_form.pdf` (2 pages)  
**Program:** CLOX Investor Portal — Early-Access Equity Round Registration & Pre-Qualification  
**Status:** Canonical client form for capital / investor pre-qualification  
**Related:** [pre-launch-strategy.md](pre-launch-strategy.md) · [admin-eoi-form.md](admin-eoi-form.md) · [clox-about-us.md](../company/clox-about-us.md)

**Important:** This is **not** the Admin Partner EOI.  
`Pre-Launch/investorportal.html` currently clones the **Admin EOI** HTML and must be replaced with this investor form content for digital parity.

**Submission channels (PDF):** `invest@clox.com.au` or secure portal at `www.clox.com.au/investors`  
**HQ:** CLOX HQ · Clyde North, Victoria, Australia

---

## Form title

**CLOX INVESTOR PORTAL**  
Early-Access Equity Round Registration & Pre-Qualification Form

---

## Confidentiality notice (form copy)

> All information submitted via this form is protected under the CLOX Master Non-Disclosure Agreement (NDA) and will be utilized exclusively to evaluate investor status compliance under Australian Corporations Act 2001 regulations.

---

## 1. Primary investor information

| Field | Required | Notes |
|-------|----------|-------|
| Full Entity / Individual Name | Yes | |
| Contact Person Name (if Entity) | Conditional | Required when applicant is an entity |
| Email Address | Yes | |
| ABN / ACN (if applicable) | No | Capture when Australian entity |
| Phone Number | Yes | |
| Principal Country / State of Residence | Yes | |

---

## 2. Investor classification & accreditation

Applicant checks **all that apply**:

| Classification | Criteria (form wording) |
|----------------|-------------------------|
| **Sophisticated Investor** | Gross income ≥ $250k/yr for last 2 yrs **OR** net assets ≥ $2.5M with Accountant Certificate |
| **Professional Investor** | Financial services licensee, body corporate ≥ $10M assets, or regulated entity |
| **Strategic Industry Partner** | Logistics provider, fleet owner, or corporate sender ecosystem affiliate |

**Phase 0 engineering:** store as multi-select array. Do **not** auto-verify accreditation — Super Admin / legal review offline. Accountant certificates are out-of-band attachments for Phase 0 (optional upload later).

---

## 3. Investment profile & commitment target

### Intended capital allocation (AUD) — select one

| Band |
|------|
| $25,000 – $99,999 |
| $100,000 – $249,999 |
| $250,000 – $499,999 |
| $500,000+ (Institutional / Lead) |

### Ecosystem value-add focus area — select one (or primary)

| Focus area |
|------------|
| Pure Financial Growth Capital |
| Strategic Carrier Fleet Integration |
| Enterprise Corporate Sender Pipeline |
| Regional Admin / Network Expansion |

---

## 4. Strategic value & network alignment notes

| Field | Prompt | Required |
|-------|--------|----------|
| Strategic notes | Briefly outline any strategic networks or industry lanes you can accelerate within CLOX | Yes (recommended; treat as required for digital form) |

---

## 5. Investor declaration & NDA acknowledgment

> I confirm that all statements made herein are accurate, and I agree to be bound by the ongoing confidentiality terms regarding the CLOX algorithmic 4PL operational structures.

### Signature block (PDF)

| Field |
|-------|
| Authorized Signature |
| Date |

**Digital Phase 0 equivalent:** declaration checkbox + typed name + timestamp.

---

## Post-submission process

1. Capture via `POST /v1/leads/investor` (preferred) or email to `invest@clox.com.au`
2. Notify Super Admin / designated investor inbox
3. Manual Corporations Act 2001 / accreditation review (offline)
4. NDA already acknowledged on form; deeper diligence out of band
5. **Do not** auto-provision platform admin roles from investor leads

---

## Field → API mapping (Phase 0)

| Form field | API / Lead column |
|------------|-------------------|
| Lead type | `type` = `INVESTOR` (new) |
| Full Entity / Individual Name | `companyName` (or `payload.fullName` if individual) |
| Contact Person Name | `payload.contactPersonName` |
| Email / Phone | `email` / `phone` |
| ABN / ACN | `abn` / `acn` |
| Residence | `state` and/or `payload.residence` |
| Classifications[] | `payload.investorClassifications` |
| Capital band | `payload.capitalAllocation` |
| Value-add focus | `payload.ecosystemFocus` |
| Strategic notes | `payload.strategicNotes` |
| Declaration | `payload.declarationAccepted` = true |
| Full snapshot | `payload` JSON |
| Default status | `UNDER_REVIEW` |

---

## Separation from Admin EOI

| | Admin EOI | Investor Portal |
|--|-----------|-----------------|
| Purpose | Recruit State Master / Local BDE operators | Equity / capital pre-qualification |
| Revenue messaging | 10% / 5% admin splits | Capital bands + investor accreditation |
| Legal frame | Master Admin Agreement + non-compete | Corporations Act 2001 + NDA |
| Public route | `/partner/eoi` | `/investors` |
| Admin queue | EOI queue | Investor queue |
| Email | Super Admin notify | Super Admin + `invest@clox.com.au` (configurable) |
