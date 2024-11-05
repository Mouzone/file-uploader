/*
  Warnings:

  - A unique constraint covering the columns `[shareId]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shareId` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "shareId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Share" (
    "id" SERIAL NOT NULL,
    "expriation" TIMESTAMP(3) NOT NULL,
    "url_key" TEXT NOT NULL,
    "fileId" INTEGER NOT NULL,

    CONSTRAINT "Share_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "File_shareId_key" ON "File"("shareId");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_shareId_fkey" FOREIGN KEY ("shareId") REFERENCES "Share"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
