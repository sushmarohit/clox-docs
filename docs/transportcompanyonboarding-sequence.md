# Transport Company Onboarding - Sequence Diagrams

Visual companion to [transportcompanyonboarding.md](transportcompanyonboarding.md). **Web-first (Phase 1).** Two variants: **automatic activation** when all gates pass, and **Ops-gated activation** for manual intervention or policy.

## Configuration (product policy)

- **Auto path:** Use when `automated_gates_all_pass` and no risk/manual-review flags (e.g., KYB verified, documents valid, Stripe payout verified, min one compliant vehicle + driver).
- **Ops path:** Use when policy requires human sign-off for all new carriers, or when any gate is inconclusive, KYB fails, document mismatch, Stripe `requires_action`, or fraud/risk score exceeds threshold.
- **Hybrid (recommended):** Default to auto when clean; route to Ops whenever any exception applies.

---

## 1) Auto-approved activation (no Ops step on success)

```mermaid
sequenceDiagram
    participant CompanyWeb as TransportCompany_web
    participant CloxApi as Clox_API
    participant KybSvc as KYB_Provider
    participant DocSvc as Document_Storage
    participant Stripe as Stripe_Connect
    participant Notify as Notifications

    CompanyWeb->>CloxApi: Register account OTP credentials
    CloxApi-->>CompanyWeb: state_draft

    CompanyWeb->>CloxApi: Submit legal identity ABN_ACN
    CloxApi->>KybSvc: Verify KYB
    KybSvc-->>CloxApi: verified
    CloxApi-->>CompanyWeb: pending_compliance_docs

    CompanyWeb->>CloxApi: Upload insurance RWC permits
    CloxApi->>DocSvc: Store docs and expiry metadata
    CloxApi-->>CompanyWeb: pending_settlement_setup

    CompanyWeb->>CloxApi: Add payout_bank_details
    CloxApi->>Stripe: Connect account payout verification
    Stripe-->>CloxApi: payouts_enabled
    CloxApi-->>CompanyWeb: pending_fleet_readiness

    CompanyWeb->>CloxApi: Register vehicles drivers mapping
    CloxApi-->>CompanyWeb: gates_complete

    CompanyWeb->>CloxApi: Submit_for_activation
    CloxApi->>CloxApi: Evaluate_activation_gates
    Note over CloxApi: All gates pass no exception flags
    CloxApi->>Notify: Bid_eligible welcome
    CloxApi-->>CompanyWeb: approved_bid_eligible

    loop Compliance_watchdog
        CloxApi->>CompanyWeb: Expiry_warnings
        alt Breach
            CloxApi-->>CompanyWeb: suspended_non_compliant
        end
    end
```

---

## 2) Ops-approved activation (manual intervention)

```mermaid
sequenceDiagram
    participant CompanyWeb as TransportCompany_web
    participant CloxApi as Clox_API
    participant KybSvc as KYB_Provider
    participant DocSvc as Document_Storage
    participant Stripe as Stripe_Connect
    participant OpsPortal as Ops_Admin_web
    participant Notify as Notifications

    CompanyWeb->>CloxApi: Register Submit_KYB_and_docs_and_payout_and_fleet
    CloxApi->>KybSvc: Verify KYB
    alt KYB_fail_or_inconclusive
        KybSvc-->>CloxApi: fail_or_review
        CloxApi->>OpsPortal: Queue pending_review KYB
        OpsPortal->>CloxApi: Approve_KYB_override or Reject
        CloxApi->>Notify: Company outcome
    else KYB_verified
        KybSvc-->>CloxApi: verified
    end

    CompanyWeb->>CloxApi: Upload documents
    CloxApi->>DocSvc: Store and validate
    alt Document_exception
        CloxApi->>OpsPortal: Queue pending_review docs
    end

    CompanyWeb->>CloxApi: Payout setup
    CloxApi->>Stripe: Verify Connect
    alt Stripe_requires_action
        CloxApi-->>CompanyWeb: Prompt complete verification
        CompanyWeb->>CloxApi: Complete Stripe requirements
    end

    CompanyWeb->>CloxApi: Submit_for_activation

    alt Policy_always_ops
        CloxApi->>OpsPortal: Queue mandatory final review
    else Exception_flagged
        CloxApi->>OpsPortal: Queue risk_or_data_mismatch
    end

    OpsPortal->>CloxApi: Approve company
    Note over OpsPortal,CloxApi: Or Reject terminal state

    CloxApi->>Notify: Activated or rejected
    CloxApi-->>CompanyWeb: approved_bid_eligible or rejected

    loop Compliance_watchdog
        CloxApi->>OpsPortal: Optional alert on expiry
        CloxApi-->>CompanyWeb: suspended_non_compliant if remediate fails
    end
```

---

## Notes

- **KYB / Stripe / documents** can enter Ops at multiple points; diagram 2 collapses early steps for readability while showing the decision pattern.
- **Monoova** outbound payouts are optional and not required to complete onboarding activation; add when settlement policy uses NPP/Osko (see [thirdparty-integration.md](thirdparty-integration.md)).
- **Notifications:** single logical actor; channel mix is product/ops policy.
