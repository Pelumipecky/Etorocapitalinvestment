-- Add startDate field to investments table for proper ROI crediting
-- This tracks when investment was approved/activated, not when it was created

ALTER TABLE investments ADD COLUMN IF NOT EXISTS "startDate" TIMESTAMP WITH TIME ZONE;

-- Update existing active investments to set startDate to approval time (if approved)
-- For investments that are already active, set startDate to updated_at (approval time)
UPDATE investments
SET "startDate" = updated_at
WHERE status = 'Active' AND "startDate" IS NULL;

-- For pending investments, leave startDate as NULL until approved
UPDATE investments
SET "startDate" = NULL
WHERE status = 'Pending' AND "startDate" IS NULL;