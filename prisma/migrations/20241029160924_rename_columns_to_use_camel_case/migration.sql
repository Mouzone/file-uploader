/*
  Warnings:

  - You are about to drop the column `account_id` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `folder_id` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `relative_route` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `upload_time` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `account_id` on the `Folder` table. All the data in the column will be lost.
  - You are about to drop the column `outer_folder` on the `Folder` table. All the data in the column will be lost.
  - You are about to drop the column `relative_route` on the `Folder` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[relativeRoute]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[relativeRoute]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountId` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `relativeRoute` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploadTime` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountId` to the `Folder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `relativeRoute` to the `Folder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_account_id_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_folder_id_fkey";

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_account_id_fkey";

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_outer_folder_fkey";

-- DropIndex
DROP INDEX "File_relative_route_key";

-- DropIndex
DROP INDEX "Folder_relative_route_key";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "account_id",
DROP COLUMN "folder_id",
DROP COLUMN "relative_route",
DROP COLUMN "upload_time",
ADD COLUMN     "accountId" INTEGER NOT NULL,
ADD COLUMN     "folderId" INTEGER,
ADD COLUMN     "relativeRoute" TEXT NOT NULL,
ADD COLUMN     "uploadTime" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Folder" DROP COLUMN "account_id",
DROP COLUMN "outer_folder",
DROP COLUMN "relative_route",
ADD COLUMN     "accountId" INTEGER NOT NULL,
ADD COLUMN     "outerFolder" INTEGER DEFAULT 0,
ADD COLUMN     "relativeRoute" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "File_relativeRoute_key" ON "File"("relativeRoute");

-- CreateIndex
CREATE UNIQUE INDEX "Folder_relativeRoute_key" ON "Folder"("relativeRoute");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_outerFolder_fkey" FOREIGN KEY ("outerFolder") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
