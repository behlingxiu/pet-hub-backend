-- CreateIndex
CREATE INDEX "Order_item_productId_idx" ON "Order_item"("productId");

-- CreateIndex
CREATE INDEX "Order_item_order_detail_Id_idx" ON "Order_item"("order_detail_Id");

-- CreateIndex
CREATE INDEX "Payment_order_detail_Id_idx" ON "Payment"("order_detail_Id");
