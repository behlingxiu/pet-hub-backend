-- DropForeignKey
ALTER TABLE "Order_item" DROP CONSTRAINT "Order_item_order_detail_Id_fkey";

-- DropForeignKey
ALTER TABLE "Order_item" DROP CONSTRAINT "Order_item_productId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_order_detail_Id_fkey";

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_order_detail_Id_fkey" FOREIGN KEY ("order_detail_Id") REFERENCES "Order_detail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_item" ADD CONSTRAINT "Order_item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_item" ADD CONSTRAINT "Order_item_order_detail_Id_fkey" FOREIGN KEY ("order_detail_Id") REFERENCES "Order_detail"("id") ON DELETE CASCADE ON UPDATE CASCADE;
