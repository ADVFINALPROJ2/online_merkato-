import { CreateProductForm } from '@/components/forms/create-product-form';

export default function AddProductPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">List New Product</h1>
      <CreateProductForm />
    </div>
  );
}