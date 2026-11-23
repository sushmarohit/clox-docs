#!/usr/bin/env python3
"""Generate a plain-language Clox database guide PDF for tech + QA readers."""

from __future__ import annotations

from datetime import date
from pathlib import Path

from fpdf import FPDF

OUT = Path(__file__).resolve().parents[1] / "docs" / "database" / "CLOX-Database-Guide-for-Everyone.pdf"


# ---------------------------------------------------------------------------
# Content: keep wording simple for QA / HLD / non-technical readers
# ---------------------------------------------------------------------------

GLOSSARY = [
    (
        "Table",
        "A named list of rows. Example: Company holds one row per business on Clox.",
    ),
    (
        "Row / record",
        "One real-world item inside a table (one company, one job, one trip).",
    ),
    (
        "Field / column",
        "One piece of information on a row (email, status, amount).",
    ),
    (
        "Primary key (PK)",
        "The unique ID of that row. Almost always named id. Never shared with another row in the same table.",
    ),
    (
        "Foreign key (FK)",
        "A field that points to another table's id. Example: Job.senderCompanyId points to Company.id. This is how tables link.",
    ),
    (
        "Status field",
        "A short label for where something is in its life (DRAFT, ACTIVE, COMPLETED). QA often tests by checking status after each action.",
    ),
    (
        "Money fields",
        "Stored as whole cents (integer), not dollars. 5000 means $50.00 AUD. Fields often end with Cents.",
    ),
    (
        "createdAt / updatedAt",
        "When the row was first saved, and when it last changed. Almost every table has these.",
    ),
]

STORY = [
    "1. A person or company signs up (User + Company).",
    "2. Ops checks documents (ComplianceDocument + ComplianceCase).",
    "3. A carrier adds trucks and drivers (Vehicle + Driver).",
    "4. A sender posts a freight job with stops (Job + JobStop).",
    "5. Carriers place bids (Proposal). Sender accepts one.",
    "6. That creates an Assignment, then a Trip for the live journey.",
    "7. Payment is recorded (PaymentEvent). Extra fees may appear (Surcharge).",
    "8. Money is later shared out (SettlementLine + SettlementCycle).",
    "9. Problems, disputes, fatigue diary, and admin setup sit in supporting tables.",
]

# Sections: (section_title, intro, [tables...])
# Each table: name, friendly, why, pk, links (list of "field -> Table"), fields [(name, meaning)]

SECTIONS: list[tuple[str, str, list[dict]]] = [
    (
        "1. People, companies, and geography",
        "Who uses Clox, which business they belong to, and which Australian state/area they sit in.",
        [
            {
                "name": "User",
                "friendly": "Marketplace login person",
                "why": "Every sender staff, carrier staff, or driver who logs into the app is a User.",
                "pk": "id",
                "links": [
                    "companyId -> Company (optional: which business they work for)",
                ],
                "fields": [
                    ("email", "Login email (unique)"),
                    ("phone", "Phone number"),
                    ("role", "SENDER, TRANSPORT_COMPANY, or DRIVER"),
                    ("status", "PENDING / ACTIVE / SUSPENDED / DISABLED"),
                    ("name", "Display name"),
                    ("locale", "Language preference: en, hi, or pa"),
                    ("companyId", "FK to Company"),
                ],
            },
            {
                "name": "AdminUser",
                "friendly": "Ops / partner admin account",
                "why": "Super Admin, State Master, and Local BDE accounts that run the back office.",
                "pk": "id",
                "links": [
                    "companyId -> Company (admin partner company, if any)",
                    "leadId -> Lead (invite source, if any)",
                ],
                "fields": [
                    ("email", "Admin login email (unique)"),
                    ("role", "SUPER_ADMIN, STATE_MASTER, or LOCAL_BDE"),
                    ("status", "Invite and approval life: INVITED ... ACTIVE ..."),
                    ("active", "Quick on/off flag (true only when ACTIVE)"),
                    ("name / phone", "Contact details"),
                    ("locale", "Language preference"),
                    ("inviteTokenHash / inviteExpiresAt", "Secure invite link details"),
                    ("profileJson", "Extra partner onboarding answers"),
                ],
            },
            {
                "name": "Company",
                "friendly": "Business on the platform",
                "why": "The main business record for a sender, carrier, or admin partner. Jobs, trucks, and payments hang off this.",
                "pk": "id",
                "links": [
                    "homeRegionId -> Region",
                    "referredByAdminUserId -> AdminUser (Local BDE who brought them in)",
                ],
                "fields": [
                    ("type", "SENDER, CARRIER, or ADMIN_PARTNER"),
                    ("status", "Onboarding / trading life (DRAFT ... ACTIVE / BID_ELIGIBLE ...)"),
                    ("legalName / tradingName", "Legal and trading names"),
                    ("abn / acn", "Australian business numbers"),
                    ("email / phone", "Company contact"),
                    ("senderAccountType", "BUSINESS or INDIVIDUAL (senders)"),
                    ("invoice*", "Invoice address fields"),
                    ("gstRegistered", "Whether GST applies"),
                    ("paymentReady / stripe*", "Payment readiness and Stripe IDs"),
                    ("capabilities", "Special skills list e.g. DG, REEFER"),
                    ("serviceRegionCodes", "States the carrier serves"),
                    ("reliabilityScore", "0-100 trust score"),
                    ("suspended*", "Soft-suspend reason and prior status"),
                ],
            },
            {
                "name": "Region",
                "friendly": "Australian state / region",
                "why": "Defines which states are open for marketplace traffic (e.g. VIC).",
                "pk": "id",
                "links": [],
                "fields": [
                    ("code", "Short code e.g. VIC, NSW (unique)"),
                    ("name", "Full name"),
                    ("enabled", "If false, marketplace is closed for this region"),
                ],
            },
            {
                "name": "LocalTerritory",
                "friendly": "Local area inside a state",
                "why": "Smaller areas used for Local BDE coverage and job origin tracking.",
                "pk": "id",
                "links": ["regionId -> Region (required)"],
                "fields": [
                    ("code / name", "Territory code and display name"),
                    ("enabled", "Whether this local area is active"),
                ],
            },
            {
                "name": "AdminScope",
                "friendly": "Which area an admin covers",
                "why": "Links an AdminUser to a state and/or local territory so they only see their patch.",
                "pk": "id",
                "links": [
                    "adminUserId -> AdminUser",
                    "regionId -> Region",
                    "localTerritoryId -> LocalTerritory",
                ],
                "fields": [
                    ("scopeType", "STATE or LOCAL"),
                ],
            },
        ],
    ),
    (
        "2. Pre-launch leads and Local BDE growth",
        "Interest forms, invites, and the Local BDE pipeline before (or while) a company fully registers.",
        [
            {
                "name": "Lead",
                "friendly": "Pre-launch interest form",
                "why": "Captures registry, EOI, and investor interest before full onboarding.",
                "pk": "id",
                "links": ["assigneeId -> AdminUser"],
                "fields": [
                    ("type", "Who they are: sender registry, carrier, state EOI, local EOI, investor"),
                    ("status", "Pipeline status: NEW ... APPROVED ..."),
                    ("email / phone / companyName", "Contact and company hints"),
                    ("abn / acn / state / territory", "Business and location hints"),
                    ("payload", "Full form answers (flexible JSON)"),
                    ("priority", "Flag for urgent follow-up"),
                    ("source", "Where the lead came from"),
                ],
            },
            {
                "name": "LeadNote",
                "friendly": "Admin note on a lead",
                "why": "Internal comments while working a lead.",
                "pk": "id",
                "links": ["leadId -> Lead", "authorId -> AdminUser"],
                "fields": [("body", "Note text")],
            },
            {
                "name": "LeadEvent",
                "friendly": "Lead activity log",
                "why": "Audit trail of actions taken on leads (contacted, invited, etc.).",
                "pk": "id",
                "links": ["leadId -> Lead", "actorId -> AdminUser"],
                "fields": [
                    ("action", "What happened"),
                    ("metadata", "Extra details"),
                ],
            },
            {
                "name": "Prospect",
                "friendly": "Local BDE CRM prospect",
                "why": "A growth pipeline row owned by one Local BDE (before or linked to a Company).",
                "pk": "id",
                "links": [
                    "ownerAdminUserId -> AdminUser",
                    "companyId -> Company (when converted)",
                ],
                "fields": [
                    ("companyType", "SENDER or CARRIER target"),
                    ("legalName / contactName / email / phone", "Who to chase"),
                    ("stage", "LEAD ... WON / LOST"),
                    ("notes", "Free-text notes"),
                ],
            },
            {
                "name": "CompanyInvite",
                "friendly": "Invite link to register",
                "why": "Secure invite from a Local BDE so a sender/carrier can create a Company.",
                "pk": "id",
                "links": [
                    "invitedByAdminUserId -> AdminUser",
                    "prospectId -> Prospect",
                    "companyId -> Company (after accept)",
                ],
                "fields": [
                    ("tokenHash", "Hashed invite token (unique)"),
                    ("expiresAt / acceptedAt", "Invite window and acceptance time"),
                    ("companyType / email / legalNameHint", "Who was invited"),
                ],
            },
        ],
    ),
    (
        "3. Login and security",
        "How people prove who they are and stay logged in.",
        [
            {
                "name": "OtpChallenge",
                "friendly": "One-time login code",
                "why": "Stores a hashed OTP for admin or marketplace login / step-up checks.",
                "pk": "id",
                "links": ["adminUserId -> AdminUser", "userId -> User"],
                "fields": [
                    ("purpose", "LOGIN or STEP_UP"),
                    ("codeHash", "Hashed code (not plain text)"),
                    ("expiresAt / consumedAt", "Validity and use"),
                    ("attempts", "How many tries so far"),
                ],
            },
            {
                "name": "AuthSession",
                "friendly": "Logged-in device session",
                "why": "One row per device/login. Refresh tokens rotate here for security.",
                "pk": "id",
                "links": ["adminUserId -> AdminUser", "userId -> User"],
                "fields": [
                    ("principalType", "ADMIN or USER"),
                    ("refreshTokenHash", "Current refresh token (hashed)"),
                    ("familyId", "Links a refresh-token chain"),
                    ("deviceLabel / userAgent", "Device hints"),
                    ("expiresAt / revokedAt / lastUsedAt", "Session life"),
                ],
            },
        ],
    ),
    (
        "4. Fleet: vehicles, drivers, and costs",
        "Carrier trucks, combination units, drivers, fuel/cost logs, and class pricing config.",
        [
            {
                "name": "Vehicle",
                "friendly": "Truck / combination on the fleet",
                "why": "A carrier's vehicle that can be assigned to jobs and bids.",
                "pk": "id",
                "links": ["companyId -> Company (required)"],
                "fields": [
                    ("status", "DRAFT ... ACTIVE ... MAINTENANCE / RETIRED"),
                    ("label / registration", "Nickname and plate"),
                    ("vehicleClass", "Class code used for pricing floors"),
                    ("combinationConfig", "NONE, SEMI, BDOUBLE, etc."),
                    ("tareKg / gvmKg / gcmKg", "Weight ratings"),
                    ("fuelType / service* / cost*", "Fleet+ cost and service profile"),
                    ("maintenanceCause / maintenanceStartedAt", "Why it is in maintenance"),
                    ("disabled*", "Soft-disable reason"),
                ],
            },
            {
                "name": "VehicleUnit",
                "friendly": "Physical unit in a combo (prime mover / trailer)",
                "why": "For multi-unit trucks, each registered piece can have its own rego and compliance docs.",
                "pk": "id",
                "links": ["vehicleId -> Vehicle"],
                "fields": [
                    ("role", "POWERED, TRAILER_1, TRAILER_2, TRAILER_3"),
                    ("registration / label", "Plate and nickname for that unit"),
                ],
            },
            {
                "name": "Driver",
                "friendly": "Driver profile",
                "why": "Extra driver details linked 1:1 to a User with role DRIVER.",
                "pk": "id",
                "links": [
                    "userId -> User (unique, required)",
                    "companyId -> Company",
                    "facePhotoDocumentId -> ComplianceDocument",
                ],
                "fields": [
                    ("status", "INVITED ... ACTIVE ... DISABLED"),
                    ("licenceNo / licenceClass / licenceExpiry", "Licence details"),
                    ("emergencyContact*", "Emergency contact"),
                    ("address* / suburb / state / postcode", "Home address"),
                    ("invite*", "Invite token life"),
                    ("reliabilityScore", "0-100 score"),
                    ("fatigueScheme", "STANDARD / BFM / AFM"),
                    ("baseTimezone", "Driver home timezone"),
                ],
            },
            {
                "name": "DriverScheduleEntry",
                "friendly": "Driver leave / availability block",
                "why": "Planned time off or overtime availability so matching does not book them wrongly.",
                "pk": "id",
                "links": [
                    "driverId -> Driver",
                    "companyId -> Company",
                    "createdById -> User",
                    "reviewedById -> User",
                ],
                "fields": [
                    ("type", "ANNUAL_LEAVE, MEDICAL_LEAVE, ROSTERED_OFF, etc."),
                    ("status", "PENDING / APPROVED / REJECTED / CANCELLED"),
                    ("startAt / endAt / isAllDay", "When they are unavailable"),
                    ("reason / notes / rejectionReason", "Why / review notes"),
                ],
            },
            {
                "name": "VehicleFuelLog",
                "friendly": "Fuel fill-up log",
                "why": "Records fuel litres and cost against a vehicle for Fleet+ reporting.",
                "pk": "id",
                "links": ["vehicleId -> Vehicle", "companyId -> Company"],
                "fields": [
                    ("liters / amountAud", "Fuel volume and money spent"),
                    ("odometerKm", "Odometer at fill"),
                    ("source", "MANUAL / TRIP_ODOMETER / TELEMATICS_STUB"),
                    ("loggedAt", "When the fill happened"),
                ],
            },
            {
                "name": "VehicleCostEntry",
                "friendly": "Other vehicle cost line",
                "why": "Wage, toll, maintenance, or other costs against a vehicle.",
                "pk": "id",
                "links": ["vehicleId -> Vehicle", "companyId -> Company"],
                "fields": [
                    ("kind", "FUEL / WAGE / TOLL / MAINTENANCE / OTHER"),
                    ("amountAud", "Cost amount"),
                    ("tripId", "Optional link to a trip (text id)"),
                    ("loggedAt", "When recorded"),
                ],
            },
            {
                "name": "VehicleMaintenanceWorkOrder",
                "friendly": "Maintenance work order",
                "why": "Tracks why a vehicle entered maintenance and when it was cleared.",
                "pk": "id",
                "links": ["vehicleId -> Vehicle", "companyId -> Company"],
                "fields": [
                    ("cause", "RWC_EXPIRED, SERVICE_INTERVAL, SAFETY_FAIL, MANUAL"),
                    ("openedAt / clearedAt", "Open and clear times"),
                    ("notes / clearedNote", "Details"),
                ],
            },
            {
                "name": "VehicleClassConfig",
                "friendly": "Vehicle class price card",
                "why": "Ops-managed class list (ute, rigid, etc.) with rates and size limits used in job pricing.",
                "pk": "id",
                "links": [],
                "fields": [
                    ("code / name / rank", "Class identity and sort order"),
                    ("maxChargeableWeightKg / maxLengthCm / ...", "Size limits"),
                    ("minLicenceClass", "Licence needed"),
                    ("suggestedGvmKg / suggestedTareKg", "Suggested weights"),
                    ("perKmRateCents / hourlyRateCents", "Active rates in cents"),
                    ("*MinBaseCents / *Guidance*Cents", "Minimums and sender guidance ranges"),
                    ("isActive", "Shown to users if true"),
                ],
            },
            {
                "name": "CompanyFleetPlus",
                "friendly": "Fleet+ subscription",
                "why": "Whether a carrier is on the paid Fleet+ add-on (trial / active / canceled).",
                "pk": "id",
                "links": ["companyId -> Company (one per company)"],
                "fields": [
                    ("tier", "FREE_TRIAL / STARTER / GROWTH / ENTERPRISE"),
                    ("status", "NONE / TRIALING / ACTIVE / PAST_DUE / CANCELED"),
                    ("trialEndsAt / currentPeriodEnd", "Billing window"),
                    ("stripeSubscriptionId / stripeCustomerId", "Stripe links"),
                ],
            },
        ],
    ),
    (
        "5. Compliance documents and review cases",
        "Uploaded papers (licence, RWC, insurance) and the Ops review tickets that approve or reject them.",
        [
            {
                "name": "ComplianceDocument",
                "friendly": "Uploaded compliance file",
                "why": "One uploaded document (or upload slot) for company, vehicle, unit, or driver.",
                "pk": "id",
                "links": [
                    "companyId -> Company",
                    "vehicleId -> Vehicle",
                    "vehicleUnitId -> VehicleUnit",
                    "driverId -> Driver",
                    "caseId -> ComplianceCase",
                ],
                "fields": [
                    ("docType", "ABN_EXTRACT, DRIVER_LICENCE, RWC, insurance types, etc."),
                    ("status", "UPLOAD_PENDING ... APPROVED / REJECTED / EXPIRED"),
                    ("storageKey / mimeType / sizeBytes / originalFilename", "File storage info"),
                    ("contentHash", "Integrity fingerprint"),
                    ("expiresAt", "Expiry date for time-limited docs"),
                    ("reviewedAt / reviewNote", "Ops review outcome"),
                ],
            },
            {
                "name": "ComplianceCase",
                "friendly": "Ops review ticket",
                "why": "A case Ops works to approve KYB/KYC, fleet RWC, driver licence, or profile changes.",
                "pk": "id",
                "links": ["companyId -> Company", "regionId -> Region"],
                "fields": [
                    ("caseType", "SENDER_KYB, CARRIER_KYB, CARRIER_FLEET_RWC, etc."),
                    ("status", "OPEN ... APPROVED / REJECTED / CLOSED"),
                    ("proposedChanges", "Pending profile edits awaiting approval"),
                    ("infoRequestedAt / escalatedAt / decidedAt", "Timeline markers"),
                    ("decisionNote / assignedAdminId / decidedByAdminId", "Who decided and why"),
                ],
            },
        ],
    ),
    (
        "6. Jobs, bids, assignment, and trip",
        "The heart of Clox: post a job, bid, accept, pay/lock, then run the trip.",
        [
            {
                "name": "Job",
                "friendly": "Freight job posting",
                "why": "What the sender wants moved: pricing, size, origin, receiver, and estimate.",
                "pk": "id",
                "links": [
                    "senderCompanyId -> Company",
                    "originRegionId -> Region",
                    "originTerritoryId -> LocalTerritory",
                    "dgDocumentId -> ComplianceDocument",
                    "rateFloorVersionId -> RateFloorVersion",
                ],
                "fields": [
                    ("status", "DRAFT ... PUBLISHED/BIDDING ... ASSIGNED ... COMPLETED / CANCELLED"),
                    ("pricingModel", "PER_KM or HOURLY"),
                    ("title", "Short job title"),
                    ("estimate*Cents", "Quoted estimate ex/GST/inc in cents"),
                    ("receiver*", "Receiver contact details"),
                    ("pickupAt", "Planned pickup time"),
                    ("deadWeightKg / lengthCm / widthCm / heightCm / chargeableWeightKg", "Cargo size"),
                    ("loadTypes / loadTypeSubtypes", "Cargo type tags"),
                    ("requiresDg / requiresReefer / requiresOversize", "Special needs flags"),
                    ("minVehicleClass / recommendedVehicleClass / pricingVehicleClass", "Class used for pricing"),
                    ("rateFloor*Cents / rateFloorBreakdown", "Hard minimum price snapshot"),
                    ("isBackhaul", "Return-leg / cheaper floor rules"),
                    ("routeDistanceKm / routeDurationMinutes / billableHours", "Route maths"),
                    ("publishedAt / publishRequestedAt", "When it went live / requested live"),
                    ("marketplacePriority / rescueDiscountPercent", "Exception rescue board flags"),
                ],
            },
            {
                "name": "JobStop",
                "friendly": "Pickup / drop / waypoint on a job",
                "why": "Ordered stops for multi-pickup or multi-drop jobs.",
                "pk": "id",
                "links": ["jobId -> Job"],
                "fields": [
                    ("sequence", "Order number (unique per job)"),
                    ("stopType", "PICKUP, DROPOFF, or WAYPOINT"),
                    ("label / addressLine / suburb / state / postcode", "Address"),
                    ("lat / lng", "Map coordinates"),
                    ("receiverName / receiverEmail", "Per-stop receiver (optional)"),
                    ("weightKg", "Load on/off at this stop"),
                ],
            },
            {
                "name": "Proposal",
                "friendly": "Carrier bid",
                "why": "A carrier's offer on a job: price, vehicle, and driver.",
                "pk": "id",
                "links": [
                    "jobId -> Job",
                    "carrierCompanyId -> Company",
                    "vehicleId -> Vehicle",
                    "driverId -> Driver",
                    "dgDocumentId -> ComplianceDocument",
                ],
                "fields": [
                    ("status", "SUBMITTED / WITHDRAWN / ACCEPTED / REJECTED / EXPIRED"),
                    ("etaMinutes", "Promised arrival estimate"),
                    ("amount*Cents", "Bid price ex/GST/inc in cents"),
                ],
            },
            {
                "name": "Assignment",
                "friendly": "Winning bid locked to the job",
                "why": "Created when a bid is accepted. One assignment per job. Links carrier, vehicle, driver.",
                "pk": "id",
                "links": [
                    "jobId -> Job (unique)",
                    "proposalId -> Proposal (unique)",
                    "carrierCompanyId -> Company",
                    "vehicleId -> Vehicle",
                    "driverId -> Driver",
                ],
                "fields": [
                    ("status", "PENDING (awaiting payment) / LOCKED / COMPLETED / CANCELLED"),
                    ("lockedAt", "When payment confirmed and trip can proceed"),
                ],
            },
            {
                "name": "Trip",
                "friendly": "Live journey on the road",
                "why": "Tracks the real trip after assignment: safety checks, mass, break, POD files, odometer.",
                "pk": "id",
                "links": [
                    "jobId -> Job (unique)",
                    "assignmentId -> Assignment (unique)",
                ],
                "fields": [
                    ("status", "PENDING_GATES ... EN_ROUTE_PICKUP ... COMPLETED / BREAKDOWN"),
                    ("safetyPassedAt / safetyFailedAt / safetyNotes", "Pre-trip safety"),
                    ("declaredMassKg / actualMassKg / massCheckOk", "Mass gate"),
                    ("onBreak / breakStartedAt", "Fatigue break pause"),
                    ("startedAt / completedAt", "Trip clock"),
                    ("odometerStartKm / odometerEndKm / odometerGpsDistanceKm", "Distance checks"),
                    ("odometerDiscrepancyFlag", "True if manual vs GPS differs a lot"),
                    ("podStorageKey / taxInvoiceStorageKey / runSheetStorageKey", "Completion file keys"),
                ],
            },
            {
                "name": "TripLocationSample",
                "friendly": "GPS breadcrumb",
                "why": "Periodic lat/lng points while the trip is live.",
                "pk": "id",
                "links": ["tripId -> Trip"],
                "fields": [
                    ("lat / lng", "Position"),
                    ("recordedAt", "When the phone reported it"),
                ],
            },
            {
                "name": "TripStopProgress",
                "friendly": "Progress at one stop",
                "why": "Geofence dwell, waiting time, and proof-of-delivery steps per job stop.",
                "pk": "id",
                "links": ["tripId -> Trip", "jobStopId -> JobStop"],
                "fields": [
                    ("insideCount / currentlyInside / enteredAt / exitedAt", "Geofence presence"),
                    ("waitStartedAt / freeWaitEndsAt / waitOverageMinutes", "Waiting time maths"),
                    ("approachingNotifiedAt / atDropoffNotifiedAt", "Receiver notifications"),
                    ("podStatus", "PENDING ... SIGNED ... FINALIZED"),
                    ("signerName / signedAt / signatureStorageKey", "Signature capture"),
                    ("goodsPhotoRefs / podPackageStorageKey", "Goods photos and POD package"),
                ],
            },
            {
                "name": "TripException",
                "friendly": "Trip problem (sick call / breakdown / etc.)",
                "why": "Control loop when driver/vehicle cannot continue; supports reassign or marketplace rescue.",
                "pk": "id",
                "links": [
                    "jobId -> Job",
                    "assignmentId -> Assignment",
                    "tripId -> Trip",
                    "companyId -> Company",
                    "proposedVehicleId -> Vehicle",
                    "proposedDriverId -> Driver",
                ],
                "fields": [
                    ("kind", "DRIVER_UNAVAILABLE, VEHICLE_BREAKDOWN, ACCIDENT, TRAFFIC, OTHER"),
                    ("phase", "PRE_TRIP or MID_TRIP"),
                    ("status", "OPEN ... AWAITING_SENDER_APPROVAL ... RESOLVED_*"),
                    ("reasonCode / note", "What went wrong"),
                    ("gpsLat / gpsLng / photoDocumentId", "Evidence"),
                    ("proposed* / proposedAt", "Replacement crew awaiting sender OK"),
                    ("openedAt / escalatedAt / resolvedAt", "Timeline"),
                ],
            },
        ],
    ),
    (
        "7. Money: payments, fees, disputes, settlements",
        "All money is stored in cents AUD. These tables track charges, extra fees, arguments, and payouts.",
        [
            {
                "name": "PaymentEvent",
                "friendly": "Money movement record",
                "why": "Every charge, refund, transfer, or surcharge payment attempt/result.",
                "pk": "id",
                "links": ["jobId -> Job"],
                "fields": [
                    ("type", "CHARGE / REFUND / TRANSFER / SURCHARGE / ..."),
                    ("status", "PENDING ... SUCCEEDED / FAILED / CANCELLED"),
                    ("amount*Cents", "ex / GST / inc amounts"),
                    ("currency", "Usually AUD"),
                    ("stripePaymentIntentId / stripeTransferId / stripeRefundId", "Stripe refs"),
                    ("idempotencyKey", "Prevents double-charging"),
                ],
            },
            {
                "name": "Surcharge",
                "friendly": "Extra fee on a trip",
                "why": "Waiting time or mass overage fee that sender may need to pay.",
                "pk": "id",
                "links": [
                    "jobId -> Job",
                    "tripId -> Trip",
                    "paymentEventId -> PaymentEvent",
                    "stopProgressId -> TripStopProgress",
                ],
                "fields": [
                    ("kind", "WAITING or MASS"),
                    ("status", "PENDING_PAYMENT / PAID / WAIVED / DISPUTED"),
                    ("amount*Cents", "Fee amounts"),
                    ("idempotencyKey", "Unique key so the same fee is not created twice"),
                    ("paidAt / waivedAt / waivedByAdminId", "Outcome"),
                ],
            },
            {
                "name": "Dispute",
                "friendly": "Disagreement case",
                "why": "Formal dispute on surcharge, damage, cancellation, or general issues; triaged by admins.",
                "pk": "id",
                "links": [
                    "jobId -> Job",
                    "tripId -> Trip",
                    "surchargeId -> Surcharge",
                    "openedByUserId -> User",
                    "companyId -> Company",
                    "regionId -> Region",
                    "territoryId -> LocalTerritory",
                    "triagedByAdminId / assignedAdminId / resolvedByAdminId -> AdminUser",
                ],
                "fields": [
                    ("disputeNumber", "Human-readable case number (unique)"),
                    ("type / status", "What kind and where it sits in triage"),
                    ("reason / description / evidenceUrls", "Claim details"),
                    ("disputedAmountCents", "Money in dispute"),
                    ("contactedSender / contactedCarrier / evidenceComplete", "Triage checklist"),
                    ("ruling / financialAdjustment / adjustmentAmountCents", "Final decision"),
                ],
            },
            {
                "name": "SettlementLine",
                "friendly": "One payout share line",
                "why": "After a job, money is split: carrier, Super, State, Local, or HQ holding. One row per share.",
                "pk": "id",
                "links": [
                    "jobId -> Job",
                    "policyVersionId -> PolicyVersion",
                    "overrideId -> RevenueSplitOverride",
                    "adminPackageId -> AdminRevenueSplitPackage",
                    "adminUserId -> AdminUser",
                    "cycleId -> SettlementCycle",
                ],
                "fields": [
                    ("recipientType", "CARRIER / SUPER_ADMIN / STATE_MASTER / LOCAL_BDE / HQ_HOLDING"),
                    ("sharePercent", "Share percentage used"),
                    ("amountCents", "Amount owed"),
                    ("status", "ACCRUED / PAYABLE / PAID / VOID"),
                    ("regionId / territoryId", "Origin attribution"),
                    ("paidAt", "When paid out"),
                ],
            },
            {
                "name": "SettlementCycle",
                "friendly": "Payout batch period",
                "why": "Groups many settlement lines into a weekly/fortnightly disbursement run.",
                "pk": "id",
                "links": [],
                "fields": [
                    ("cycleNumber", "Unique batch label"),
                    ("periodStart / periodEnd / scheduledDisburseAt", "Batch window"),
                    ("status", "OPEN / PROCESSING / COMPLETED / FAILED"),
                    ("totalAccruedCents / totalDisbursedCents", "Totals"),
                    ("carrierPayoutCents / adminPayoutCents / hqHoldingCents", "Split totals"),
                    ("lineCount", "How many lines in the batch"),
                ],
            },
            {
                "name": "RevenueSplitOverride",
                "friendly": "Legacy area split override",
                "why": "Older seat-scoped Super/State/Local % overrides (kept for history). Newer deals use packages.",
                "pk": "id",
                "links": ["publishedBy -> AdminUser"],
                "fields": [
                    ("scopeType / scopeId", "REGION or TERRITORY target"),
                    ("superPercent / statePercent / localPercent", "Split percents"),
                    ("effectiveFrom / publishedAt", "When it applies"),
                ],
            },
            {
                "name": "AdminRevenueSplitPackage",
                "friendly": "Per-admin revenue deal",
                "why": "Personal Super/State/Local share package (% of CLOX pool) for an admin seat.",
                "pk": "id",
                "links": [
                    "adminUserId -> AdminUser (subject)",
                    "publishedBy -> AdminUser (publisher)",
                ],
                "fields": [
                    ("superPercent / statePercent / localPercent", "Pool shares (should sum to 100)"),
                    ("effectiveFrom / publishedAt / notes", "When live and why"),
                ],
            },
            {
                "name": "CompanyRevenueUplift",
                "friendly": "Carrier bonus % uplift",
                "why": "Extra percentage points for a strong carrier on top of the national carrier share.",
                "pk": "id",
                "links": ["companyId -> Company", "publishedBy -> AdminUser"],
                "fields": [
                    ("bonusPercent", "Extra points added to carrier share"),
                    ("effectiveFrom / publishedAt / notes", "When live"),
                ],
            },
            {
                "name": "CompanySenderFeeOverride",
                "friendly": "Sender fee override",
                "why": "Custom platform fee % for one sender company instead of the national default.",
                "pk": "id",
                "links": ["companyId -> Company", "publishedBy -> AdminUser"],
                "fields": [
                    ("feePercent", "Custom fee %"),
                    ("inheritNational", "If true, fall back to platform default"),
                    ("effectiveFrom / publishedAt", "When live"),
                ],
            },
            {
                "name": "StripeWebhookEvent",
                "friendly": "Stripe event already processed",
                "why": "Stops the same Stripe webhook from being handled twice.",
                "pk": "id",
                "links": [],
                "fields": [
                    ("stripeEventId", "Stripe's event id (unique)"),
                    ("type", "Event type string"),
                    ("processedAt / payload", "When handled and optional body"),
                ],
            },
        ],
    ),
    (
        "8. Pricing floors, fuel, holidays, and platform knobs",
        "Rules that protect minimum rates and global settings Ops can change.",
        [
            {
                "name": "PlatformSettings",
                "friendly": "Global platform switches (one row)",
                "why": "Singleton settings: GST, default rates, settlement cadence, rescue discount, fuel rules.",
                "pk": "id (always 'default')",
                "links": [],
                "fields": [
                    ("enableStateMasterTier", "Whether State Master seats earn commissions"),
                    ("gstPercent", "GST rate e.g. 10"),
                    ("perKm* / hourly*", "Fallback pricing defaults in cents"),
                    ("settlementCycleCadenceDays / settlementCutoffHour", "Payout schedule"),
                    ("senderPlatformFeePercent / senderPlatformFeeMode", "Sender usage fee"),
                    ("minPlatformPercent", "Floor for CLOX pool share"),
                    ("fuelStaleDays / fuelMoveConfirmPercent / fuelWeeklyChangeCapPercent", "Fuel index rules"),
                    ("rescueDiscountPercent / marketplaceRelistSlaMs", "Exception rescue behaviour"),
                ],
            },
            {
                "name": "RateFloorVersion",
                "friendly": "Published minimum-rate table version",
                "why": "Versioned hard cost-recovery floors. Jobs snapshot which version was used.",
                "pk": "id",
                "links": [
                    "createdByAdminId / approvedByAdminId / publishedByAdminId -> AdminUser",
                ],
                "fields": [
                    ("label / status", "DRAFT / PUBLISHED / RETIRED"),
                    ("effectiveFrom", "When it starts applying"),
                    ("referenceDieselCpl / labourRateHrCents", "Fuel and labour inputs"),
                    ("minHours / minKmChargeKm / backhaulFactor", "Floor calculation knobs"),
                ],
            },
            {
                "name": "RateFloorLine",
                "friendly": "Floor rates for one vehicle class",
                "why": "Hourly and per-km floor cents for one class inside a floor version.",
                "pk": "id",
                "links": ["versionId -> RateFloorVersion"],
                "fields": [
                    ("vehicleClassCode", "Class code"),
                    ("hourlyFloorCents / kmFloorCents / variableKmCents", "Floor amounts"),
                    ("litresPerKm / basis", "Fuel burn and basis label"),
                ],
            },
            {
                "name": "RateFloorLabourMultiplier",
                "friendly": "Labour time-of-day multiplier",
                "why": "Extra labour cost factor for nights/weekends/public holidays.",
                "pk": "id",
                "links": ["versionId -> RateFloorVersion"],
                "fields": [
                    ("periodCode", "Which period e.g. night / Sunday"),
                    ("multiplier", "e.g. 1.5 means 50% extra labour"),
                ],
            },
            {
                "name": "RateFloorBodyLoading",
                "friendly": "Special body loading %",
                "why": "Extra % for specialised bodies (crane, etc.) on a floor version.",
                "pk": "id",
                "links": ["versionId -> RateFloorVersion"],
                "fields": [
                    ("bodyCode", "Body type code"),
                    ("loadingPct / minHours", "Extra loading and optional min hours"),
                ],
            },
            {
                "name": "RateFloorCheck",
                "friendly": "Floor check audit row",
                "why": "Remembers each calculate/enforce check: inputs, breakdown, pass/reject/override.",
                "pk": "id",
                "links": ["jobId -> Job", "versionId -> RateFloorVersion"],
                "fields": [
                    ("inputs / breakdown", "What was calculated"),
                    ("floor*Cents / offeredIncGstCents", "Floor vs offered price"),
                    ("result", "PASS / REJECT / OVERRIDE"),
                ],
            },
            {
                "name": "RateFloorOverride",
                "friendly": "Temporary floor waiver on a job",
                "why": "Ops-approved lower floor for one job until an expiry time.",
                "pk": "id",
                "links": ["jobId -> Job", "approvedByAdminId -> AdminUser"],
                "fields": [
                    ("reason / expiresAt", "Why and until when"),
                    ("floorExGstCentsOverride", "Override floor in cents"),
                ],
            },
            {
                "name": "FuelIndex",
                "friendly": "Weekly diesel price",
                "why": "National average retail diesel (cents per litre) used in per-km floor fuel maths.",
                "pk": "id",
                "links": [
                    "enteredByAdminId / confirmedByAdminId -> AdminUser",
                ],
                "fields": [
                    ("weekStart", "Monday of that week (unique)"),
                    ("dieselCpl", "Diesel cents per litre"),
                    ("note", "Optional comment"),
                ],
            },
            {
                "name": "PublicHoliday",
                "friendly": "Public holiday calendar",
                "why": "State/national holidays used when labour multipliers choose PUBLIC_HOLIDAY rates.",
                "pk": "id",
                "links": [],
                "fields": [
                    ("state", "VIC/NSW/... or NATIONAL"),
                    ("holidayDate / name", "Date and holiday name"),
                ],
            },
        ],
    ),
    (
        "9. Notifications, translations, policy, audit",
        "In-app inbox, language cache, published policy snapshots, and who-did-what logs.",
        [
            {
                "name": "Notification",
                "friendly": "In-app inbox message",
                "why": "Alerts for marketplace users or Ops admins (email may still be sent separately).",
                "pk": "id",
                "links": ["userId -> User", "adminUserId -> AdminUser"],
                "fields": [
                    ("type", "JOB_PUBLISHED, BID_ACCEPTED, TRIP_*, COMPLIANCE_*, etc."),
                    ("title / body / href", "Message and deep link"),
                    ("entityType / entityId", "Related object"),
                    ("regionId", "Optional region for Ops filtering"),
                    ("readAt", "Null until opened"),
                ],
            },
            {
                "name": "ContentTranslation",
                "friendly": "Cached text translation",
                "why": "Stores on-read translations of user content. Never overwrites the original text.",
                "pk": "id",
                "links": [],
                "fields": [
                    ("sourceHash / sourceLocale / targetLocale", "What was translated"),
                    ("text / provider", "Translated string and engine used"),
                ],
            },
            {
                "name": "PolicyVersion",
                "friendly": "Published policy snapshot",
                "why": "Versioned business rules (e.g. revenue split) so old settlements keep the policy they used.",
                "pk": "id",
                "links": ["publishedBy -> AdminUser"],
                "fields": [
                    ("key / version", "Policy name + version number (unique together)"),
                    ("payload", "Rule content (JSON)"),
                    ("publishedAt", "When published"),
                ],
            },
            {
                "name": "AuditEvent",
                "friendly": "Who did what log",
                "why": "Security and ops audit trail for important actions.",
                "pk": "id",
                "links": ["actorAdminId -> AdminUser"],
                "fields": [
                    ("actorUserId", "Marketplace actor if not admin"),
                    ("action", "What was done"),
                    ("entityType / entityId", "What was touched"),
                    ("correlationId / metadata", "Trace and extra detail"),
                ],
            },
        ],
    ),
    (
        "10. Driver electronic work diary (fatigue)",
        "NHVR work/rest diary, daily sheets, breaches, and roadside access sessions.",
        [
            {
                "name": "EwdWorkRestRecord",
                "friendly": "Work or rest segment",
                "why": "One stretch of WORK or REST for a driver (start/end, location, odometer).",
                "pk": "id",
                "links": ["driverId -> Driver"],
                "fields": [
                    ("activity", "WORK or REST"),
                    ("workType", "Usually DRIVING"),
                    ("startTime / endTime / durationMinutes", "Timing"),
                    ("odometerStart / odometerEnd", "Odometer pair"),
                    ("location* / lat* / lng*", "Where it started/ended"),
                    ("vehicleRego", "Truck used"),
                    ("isEdited / editReason / originalRecordId", "Correction tracking"),
                ],
            },
            {
                "name": "EwdDailySheet",
                "friendly": "One day summary sheet",
                "why": "Totals of work/rest for a driver on one calendar day, with signature.",
                "pk": "id",
                "links": ["driverId -> Driver"],
                "fields": [
                    ("date / timezone", "Which day"),
                    ("totalWorkMinutes / totalRestMinutes", "Day totals"),
                    ("status", "IN_PROGRESS / SUBMITTED / VERIFIED"),
                    ("driverSignature / signedAt / declarationText", "Sign-off"),
                ],
            },
            {
                "name": "EwdBreachRecord",
                "friendly": "Fatigue rule breach",
                "why": "When work/rest rules are broken; severity and whether acknowledged.",
                "pk": "id",
                "links": ["driverId -> Driver"],
                "fields": [
                    ("ruleName / severity / description", "What was breached"),
                    ("actualMinutes / allowableMinutes", "Actual vs allowed"),
                    ("resolved / acknowledgedAt", "Follow-up"),
                ],
            },
            {
                "name": "EwdRoadsideSession",
                "friendly": "Roadside inspector access",
                "why": "Temporary PIN session so roadside officers can view diary data.",
                "pk": "id",
                "links": ["driverId -> Driver"],
                "fields": [
                    ("accessPin / expiresAt / isActive", "PIN life"),
                    ("accessedCount / lastAccessedAt", "Usage"),
                ],
            },
        ],
    ),
]

QA_TIPS = [
    "Follow the happy path statuses: Company becomes ACTIVE/BID_ELIGIBLE -> Job PUBLISHED/BIDDING -> Proposal ACCEPTED -> Assignment PENDING then LOCKED -> Trip progresses to COMPLETED.",
    "Money checks: compare UI dollars to DB cents (divide or multiply by 100).",
    "After accept + pay, Assignment should not stay PENDING; do not expect 'pay now' CTAs once LOCKED or COMPLETED.",
    "One Job has at most one Assignment and one Trip (unique jobId on those tables).",
    "Documents live in ComplianceDocument; the review ticket is ComplianceCase. Check both when testing uploads/approvals.",
    "Trip problems are TripException rows; money arguments are Dispute rows - they are different flows.",
    "createdAt/updatedAt help confirm 'did my action save?' even when UI caching confuses you.",
]


class GuidePDF(FPDF):
    def header(self) -> None:
        if self.page_no() == 1:
            return
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(100, 100, 100)
        self.cell(0, 6, "Clox Database Guide for Everyone", align="L")
        self.cell(0, 6, f"Page {self.page_no()}", align="R", new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(200, 200, 200)
        self.line(self.l_margin, self.get_y(), self.w - self.r_margin, self.get_y())
        self.ln(4)
        self.set_text_color(0, 0, 0)

    def footer(self) -> None:
        self.set_y(-12)
        self.set_font("Helvetica", "I", 7)
        self.set_text_color(120, 120, 120)
        self.cell(0, 8, "Source of truth: api/prisma/schema.prisma  |  Money = cents AUD  |  IDs = UUID", align="C")


def clean(text: str) -> str:
    """FPDF core fonts are Latin-1; normalize common unicode."""
    return (
        text.replace("\u2014", "-")
        .replace("\u2013", "-")
        .replace("\u2018", "'")
        .replace("\u2019", "'")
        .replace("\u201c", '"')
        .replace("\u201d", '"')
        .replace("\u2026", "...")
        .replace("\u00a0", " ")
        .encode("latin-1", "replace")
        .decode("latin-1")
    )


def reset_x(pdf: GuidePDF) -> None:
    pdf.set_x(pdf.l_margin)


def h1(pdf: GuidePDF, text: str) -> None:
    reset_x(pdf)
    pdf.set_font("Helvetica", "B", 16)
    pdf.set_text_color(20, 60, 100)
    pdf.multi_cell(0, 8, clean(text), new_x="LMARGIN", new_y="NEXT")
    pdf.set_text_color(0, 0, 0)
    pdf.ln(2)


def h2(pdf: GuidePDF, text: str) -> None:
    pdf.ln(2)
    reset_x(pdf)
    pdf.set_font("Helvetica", "B", 13)
    pdf.set_text_color(30, 80, 120)
    pdf.multi_cell(0, 7, clean(text), new_x="LMARGIN", new_y="NEXT")
    pdf.set_text_color(0, 0, 0)
    pdf.ln(1)


def h3(pdf: GuidePDF, text: str) -> None:
    pdf.ln(1)
    reset_x(pdf)
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_fill_color(235, 242, 248)
    pdf.multi_cell(0, 7, clean(text), fill=True, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(1)


def body(pdf: GuidePDF, text: str, bold: bool = False) -> None:
    reset_x(pdf)
    pdf.set_font("Helvetica", "B" if bold else "", 10)
    pdf.multi_cell(0, 5.5, clean(text), new_x="LMARGIN", new_y="NEXT")
    pdf.ln(0.5)


def bullet(pdf: GuidePDF, text: str) -> None:
    pdf.set_font("Helvetica", "", 10)
    pdf.set_x(pdf.l_margin + 2)
    usable = pdf.w - pdf.l_margin - pdf.r_margin - 2
    pdf.multi_cell(usable, 5.5, clean(f"- {text}"), new_x="LMARGIN", new_y="NEXT")


def label_value(pdf: GuidePDF, label: str, value: str) -> None:
    pdf.set_font("Helvetica", "B", 9)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 5, clean(f"{label}: {value}"), new_x="LMARGIN", new_y="NEXT")


def render_table(pdf: GuidePDF, t: dict) -> None:
    h3(pdf, f"{t['friendly']}  (table name: {t['name']})")
    body(pdf, f"What it is / why it exists: {t['why']}")
    label_value(pdf, "Primary key", t["pk"])
    if t["links"]:
        pdf.set_font("Helvetica", "B", 9)
        pdf.set_x(pdf.l_margin)
        pdf.multi_cell(0, 5, clean("Links to other tables (foreign keys):"), new_x="LMARGIN", new_y="NEXT")
        for link in t["links"]:
            bullet(pdf, link)
    else:
        label_value(pdf, "Links to other tables", "None (standalone or only referenced by others)")

    pdf.set_font("Helvetica", "B", 9)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 5, clean("Important fields:"), new_x="LMARGIN", new_y="NEXT")

    usable = pdf.w - pdf.l_margin - pdf.r_margin
    w_name = 52
    for fname, meaning in t["fields"]:
        pdf.set_x(pdf.l_margin + 2)
        y0 = pdf.get_y()
        pdf.set_font("Helvetica", "B", 9)
        pdf.multi_cell(w_name, 5, clean(fname), new_x="RIGHT", new_y="TOP")
        pdf.set_xy(pdf.l_margin + 2 + w_name, y0)
        pdf.set_font("Helvetica", "", 9)
        pdf.multi_cell(usable - w_name - 2, 5, clean(meaning), new_x="LMARGIN", new_y="NEXT")


def build() -> Path:
    pdf = GuidePDF(orientation="P", unit="mm", format="A4")
    pdf.set_auto_page_break(auto=True, margin=16)
    pdf.set_margins(14, 14, 14)

    # Cover
    pdf.add_page()
    pdf.ln(30)
    pdf.set_font("Helvetica", "B", 24)
    pdf.set_text_color(20, 60, 100)
    pdf.multi_cell(0, 10, clean("Clox Database Guide"), align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 14)
    pdf.set_text_color(60, 60, 60)
    pdf.multi_cell(
        0,
        8,
        clean("Plain-language map for developers, QA, and HLD readers"),
        align="C",
        new_x="LMARGIN",
        new_y="NEXT",
    )
    pdf.ln(8)
    pdf.set_font("Helvetica", "", 11)
    pdf.multi_cell(
        0,
        6,
        clean(
            "This guide explains what each database table stores, why it exists, "
            "which fields matter, and how tables link. It avoids heavy jargon."
        ),
        align="C",
        new_x="LMARGIN",
        new_y="NEXT",
    )
    pdf.ln(10)
    pdf.set_font("Helvetica", "I", 10)
    pdf.multi_cell(
        0,
        5,
        clean(f"Generated {date.today().isoformat()} from api/prisma/schema.prisma"),
        align="C",
        new_x="LMARGIN",
        new_y="NEXT",
    )
    pdf.set_text_color(0, 0, 0)

    # How to read
    pdf.add_page()
    h1(pdf, "How to read this guide")
    body(
        pdf,
        "Think of the database as a filing cabinet. Each table is a drawer. "
        "Each row is one folder. Fields are the papers inside that folder. "
        "A foreign key is a sticky note that says 'see also folder X in drawer Y'.",
    )
    h2(pdf, "Simple terms")
    usable = pdf.w - pdf.l_margin - pdf.r_margin
    for term, meaning in GLOSSARY:
        y0 = pdf.get_y()
        pdf.set_font("Helvetica", "B", 10)
        pdf.multi_cell(42, 5.5, clean(term), new_x="RIGHT", new_y="TOP")
        pdf.set_xy(pdf.l_margin + 42, y0)
        pdf.set_font("Helvetica", "", 10)
        pdf.multi_cell(usable - 42, 5.5, clean(meaning), new_x="LMARGIN", new_y="NEXT")
        pdf.ln(1)

    h2(pdf, "The big story (happy path)")
    body(pdf, "Most Clox work follows this order:")
    for step in STORY:
        bullet(pdf, step)

    h2(pdf, "Quick tip for money and IDs")
    bullet(pdf, "Money fields end with Cents. 12500 = $125.00 AUD.")
    bullet(pdf, "Almost every id is a UUID string (long unique code).")
    bullet(pdf, "status fields are the fastest way for QA to confirm a flow moved forward.")

    # Table of sections
    pdf.add_page()
    h1(pdf, "Contents by topic")
    body(pdf, "Tables are grouped by business meaning, not by technical module folders.")
    for title, intro, tables in SECTIONS:
        reset_x(pdf)
        pdf.set_font("Helvetica", "B", 10)
        pdf.multi_cell(0, 5.5, clean(title), new_x="LMARGIN", new_y="NEXT")
        reset_x(pdf)
        pdf.set_font("Helvetica", "", 9)
        pdf.multi_cell(0, 5, clean(intro), new_x="LMARGIN", new_y="NEXT")
        names = ", ".join(t["name"] for t in tables)
        reset_x(pdf)
        pdf.set_font("Helvetica", "I", 8)
        pdf.set_text_color(80, 80, 80)
        pdf.multi_cell(0, 4.5, clean(f"Tables: {names}"), new_x="LMARGIN", new_y="NEXT")
        pdf.set_text_color(0, 0, 0)
        pdf.ln(1)

    # Detail sections
    for title, intro, tables in SECTIONS:
        pdf.add_page()
        h1(pdf, title)
        body(pdf, intro)
        for t in tables:
            # keep tables from splitting awkwardly when near page end
            if pdf.get_y() > 245:
                pdf.add_page()
            render_table(pdf, t)

    # QA tips
    pdf.add_page()
    h1(pdf, "QA / testing tips")
    body(
        pdf,
        "Use this section when checking whether the UI and database agree after a user action.",
    )
    for tip in QA_TIPS:
        bullet(pdf, tip)

    h2(pdf, "Where the technical source lives")
    body(
        pdf,
        "Engineers: the exact column types, indexes, and enums are in "
        "api/prisma/schema.prisma. If this PDF and the schema disagree, trust the schema "
        "and update this guide.",
    )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    pdf.output(str(OUT))
    return OUT


if __name__ == "__main__":
    path = build()
    print(f"Wrote {path}")
