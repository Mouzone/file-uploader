/*
  Warnings:

  - A unique constraint covering the columns `[relative_route]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[relative_route]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `relative_route` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `relative_route` to the `Folder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "relative_route" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "relative_route" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "File_relative_route_key" ON "File"("relative_route");

-- CreateIndex
CREATE UNIQUE INDEX "Folder_relative_route_key" ON "Folder"("relative_route");
