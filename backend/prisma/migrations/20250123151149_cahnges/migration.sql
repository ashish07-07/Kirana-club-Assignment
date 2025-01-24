-- CreateTable
CREATE TABLE "ImageResult" (
    "id" SERIAL NOT NULL,
    "jobId" INTEGER NOT NULL,
    "storeId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "perimeter" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImageResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ImageResult" ADD CONSTRAINT "ImageResult_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
