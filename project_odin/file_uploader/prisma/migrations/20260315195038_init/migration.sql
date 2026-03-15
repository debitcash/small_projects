-- CreateTable
CREATE TABLE "Passcode" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "expires_on" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Passcode_pkey" PRIMARY KEY ("id")
);
