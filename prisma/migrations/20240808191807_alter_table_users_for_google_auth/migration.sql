-- AlterTable
ALTER TABLE "users" ADD COLUMN     "googleSub" VARCHAR(255),
ALTER COLUMN "birthDate" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;
