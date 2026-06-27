-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "imageUrl" TEXT,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "quantity" SET DEFAULT 0,
ALTER COLUMN "status" SET DEFAULT 'ACTIVE',
ALTER COLUMN "categoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
