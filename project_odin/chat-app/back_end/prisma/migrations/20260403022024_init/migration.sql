/*
  Warnings:

  - You are about to drop the column `receiver` on the `Message` table. All the data in the column will be lost.
  - Added the required column `chat` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "receiver",
ADD COLUMN     "chat" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ChatUser" (
    "id" SERIAL NOT NULL,
    "chat" INTEGER NOT NULL,
    "user" INTEGER NOT NULL,

    CONSTRAINT "ChatUser_pkey" PRIMARY KEY ("id")
);
