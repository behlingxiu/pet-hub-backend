-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" INTEGER NOT NULL,
    "order_detail_Id" INTEGER NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order_detail" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shipping_address" VARCHAR(260) NOT NULL,
    "contact_number" VARCHAR(260) NOT NULL,
    "receiver" VARCHAR(260) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Order_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order_item" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantity" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "order_detail_Id" INTEGER NOT NULL,

    CONSTRAINT "Order_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Payment_order_detail_Id_idx" ON "Payment"("order_detail_Id");

-- CreateIndex
CREATE INDEX "Order_detail_userId_idx" ON "Order_detail"("userId");

-- CreateIndex
CREATE INDEX "Order_item_productId_idx" ON "Order_item"("productId");

-- CreateIndex
CREATE INDEX "Order_item_order_detail_Id_idx" ON "Order_item"("order_detail_Id");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_order_detail_Id_fkey" FOREIGN KEY ("order_detail_Id") REFERENCES "Order_detail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_detail" ADD CONSTRAINT "Order_detail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_item" ADD CONSTRAINT "Order_item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_item" ADD CONSTRAINT "Order_item_order_detail_Id_fkey" FOREIGN KEY ("order_detail_Id") REFERENCES "Order_detail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
