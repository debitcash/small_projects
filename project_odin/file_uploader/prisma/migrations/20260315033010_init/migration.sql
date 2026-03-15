-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "size" TEXT,
    "folder_id" TEXT,
    "path" TEXT,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);
