-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "outer_folder" INTEGER;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_outer_folder_fkey" FOREIGN KEY ("outer_folder") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
