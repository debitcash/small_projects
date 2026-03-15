/*
  Warnings:

  - A unique constraint covering the columns `[root_folder_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "root_folder_id" INTEGER;

-- CreateTable
CREATE TABLE "Folder" (
    "id" SERIAL NOT NULL,
    "parent" INTEGER,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_root_folder_id_key" ON "User"("root_folder_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_root_folder_id_fkey" FOREIGN KEY ("root_folder_id") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
