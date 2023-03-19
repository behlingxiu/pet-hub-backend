/*
  Warnings:

  - You are about to drop the column `total_price` on the `Order_detail` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `order_detail_Id` to the `Order_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_detail_Id` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_orderId_fkey";

-- AlterTable
ALTER TABLE "Order_detail" DROP COLUMN "total_price";

-- AlterTable
ALTER TABLE "Order_item" ADD COLUMN     "order_detail_Id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "orderId",
ADD COLUMN     "order_detail_Id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_order_detail_Id_fkey" FOREIGN KEY ("order_detail_Id") REFERENCES "Order_detail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_item" ADD CONSTRAINT "Order_item_order_detail_Id_fkey" FOREIGN KEY ("order_detail_Id") REFERENCES "Order_detail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
