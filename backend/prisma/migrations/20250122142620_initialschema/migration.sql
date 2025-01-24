-- CreateEnum
CREATE TYPE "jobstatus" AS ENUM ('ongoing', 'completed', 'failed');

-- CreateTable
CREATE TABLE "Visit" (
    "id" SERIAL NOT NULL,
    "store_id" TEXT NOT NULL,
    "image_url" TEXT[],
    "visit_time" TEXT NOT NULL,
    "jobId" INTEGER NOT NULL,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "count" INTEGER NOT NULL,
    "status" "jobstatus" NOT NULL,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
