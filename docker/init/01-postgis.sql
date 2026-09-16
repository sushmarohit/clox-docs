-- Enable PostGIS for local Phase 1 geo (Valhalla + geofence later).
-- Also re-applied in Prisma migrations for existing volumes.
CREATE EXTENSION IF NOT EXISTS postgis;
