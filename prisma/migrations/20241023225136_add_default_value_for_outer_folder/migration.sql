/*
  Warnings:

  - Made the column `outer_folder` on table `Folder` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_outer_folder_fkey";

-- AlterTable
ALTER TABLE "Folder" ALTER COLUMN "outer_folder" SET NOT NULL,
ALTER COLUMN "outer_folder" SET DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_outer_folder_fkey" FOREIGN KEY ("outer_folder") REFERENCES "Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
