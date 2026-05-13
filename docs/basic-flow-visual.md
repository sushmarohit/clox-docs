# Clox Basic Flow Visual

```mermaid
flowchart TD
    senderOnboarding["Sender Onboarding (OTP + KYC/KYB)"] --> jobCreation["Job Creation (Pickup, Drop, Load, Pricing Mode)"]
    carrierOnboarding["Carrier Onboarding (Compliance Gate)"] --> bidEligibility["Bid Eligibility Enabled"]
    jobCreation --> vehicleRecommendation["Vehicle Recommendation (Min Compliant Class)"]
    vehicleRecommendation --> jobBroadcast["Job Broadcast to Eligible Carriers"]
    bidEligibility --> jobBroadcast
    jobBroadcast --> bidSubmission["Carrier Bid Submission (Vehicle + Driver + ETA)"]
    bidSubmission --> senderReview["Sender Reviews and Accepts One Proposal"]
    senderReview --> assignmentLock["Assignment Lock (Vehicle + Driver Locked)"]
    assignmentLock --> conflictCheck["Conflict Check (Expire Overlapping Bids Only)"]
    conflictCheck --> preTripGates["Pre-Trip Gates (Safety Check + Mass Check)"]
    preTripGates -->| "Mismatch Found" | surchargeFlow["Surcharge Flow (Approval/Payment Required)"]
    surchargeFlow --> preTripGates
    preTripGates -->| "Gates Passed" | tripStart["Trip Start Enabled"]
    tripStart --> liveTracking["Live Tracking Enabled"]
    liveTracking --> geofenceArrival["Geofence Arrival (Wait Timer Starts)"]
    geofenceArrival --> tripExecution["Loading, Transit, Delivery Events"]
    tripExecution --> breakdownFlow["Breakdown/Exception Flow (Replace/Repair/Cancel)"]
    breakdownFlow --> tripExecution
    tripExecution --> podCapture["POD Capture (SOG + Photos + Server Timestamp + GPS)"]
    podCapture --> billingSettlement["Billing and Settlement (Sender Charges + Carrier/Admin Payouts)"]
    billingSettlement --> adminOversight["Admin Oversight (Audit, Disputes, Compliance Monitoring)"]
```

## Notes
- Hourly local jobs may include up to four pickup stops.
- Per-km jobs remain single pickup and single drop.
- Trip start remains locked until mandatory pre-trip gates pass.
- Billing adjustments depend on policy-driven surcharge and dwell-time rules.
