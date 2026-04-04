/*
  Warnings:

  - You are about to drop the column `root_folder_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Folder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Passcode` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `picture` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_root_folder_id_fkey";

-- DropIndex
DROP INDEX "User_root_folder_id_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "root_folder_id",
ADD COLUMN     "picture" TEXT NOT NULL;

-- DropTable
DROP TABLE "File";

-- DropTable
DROP TABLE "Folder";

-- DropTable
DROP TABLE "Passcode";
