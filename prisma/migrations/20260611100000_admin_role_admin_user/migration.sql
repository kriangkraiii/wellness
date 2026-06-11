-- Replace legacy AdminRole enum (ADMIN, SUPER_ADMIN) with new enum (ADMIN, USER)
-- and map existing SUPER_ADMIN users to ADMIN.

ALTER TYPE "public"."AdminRole" RENAME TO "AdminRole_old";

CREATE TYPE "public"."AdminRole" AS ENUM ('ADMIN', 'USER');

ALTER TABLE "public"."AdminUser"
  ALTER COLUMN "role" DROP DEFAULT,
  ALTER COLUMN "role" TYPE "public"."AdminRole"
  USING (
    CASE
      WHEN "role"::text = 'SUPER_ADMIN' THEN 'ADMIN'
      ELSE "role"::text
    END
  )::"public"."AdminRole",
  ALTER COLUMN "role" SET DEFAULT 'ADMIN';

DROP TYPE "public"."AdminRole_old";
