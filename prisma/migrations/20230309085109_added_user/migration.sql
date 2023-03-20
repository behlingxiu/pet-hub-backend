-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(260) NOT NULL,
    "email" VARCHAR(260) NOT NULL,
    "password" VARCHAR(260) NOT NULL,
    "gender" VARCHAR(260) NOT NULL,
    "address" VARCHAR(260) NOT NULL,
    "profilepic" VARCHAR(260) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
