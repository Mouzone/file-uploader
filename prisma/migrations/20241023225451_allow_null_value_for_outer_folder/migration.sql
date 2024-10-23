-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_outer_folder_fkey";

-- AlterTable
ALTER TABLE "Folder" ALTER COLUMN "outer_folder" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_outer_folder_fkey" FOREIGN KEY ("outer_folder") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
