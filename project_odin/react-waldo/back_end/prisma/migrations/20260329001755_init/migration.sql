-- CreateTable
CREATE TABLE "target" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT NOT NULL,
    "topx" TEXT NOT NULL,
    "topy" TEXT NOT NULL,
    "bottomx" TEXT NOT NULL,
    "bottomy" TEXT NOT NULL,

    CONSTRAINT "target_pkey" PRIMARY KEY ("id")
);
