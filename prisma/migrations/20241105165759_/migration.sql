/*
  Warnings:

  - A unique constraint covering the columns `[fileId]` on the table `Share` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_shareId_fkey";

-- AlterTable
ALTER TABLE "File" ALTER COLUMN "shareId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Share_fileId_key" ON "Share"("fileId");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_shareId_fkey" FOREIGN KEY ("shareId") REFERENCES "Share"("id") ON DELETE SET NULL ON UPDATE CASCADE;
