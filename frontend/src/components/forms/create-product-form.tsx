'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCategories } from '@/hooks/use-category';
import { productService } from '@/services/product-service';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// We map your DTO to a Zod schema for instant validation
const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.coerce.number().min(0),
  quantity: z.coerce.number().int().min(0),
  categoryId: z.string().uuid(),
});

export function CreateProductForm() {
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(productSchema),
  });
  
  const { data: categories, isLoading } = useCategories();

  const onSubmit = async (data: any) => {
    try {
      await productService.create(data);
      toast.success("Product listed successfully!");
      reset();
    } catch (err) {
      toast.error("Failed to list product. Ensure your shop is set up.");
    }
  };

  if (isLoading) return <div>Loading categories...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <Input {...register("name")} placeholder="Product Name" />
      <Textarea {...register("description")} placeholder="Description" />
      <Input {...register("price")} type="number" placeholder="Price" />
      <Input {...register("quantity")} type="number" placeholder="Quantity" />
      
      <select {...register("categoryId")} className="w-full border rounded-md p-2">
        <option value="">Select a Category</option>
        {categories?.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <Button type="submit">Create Product</Button>
    </form>
  );
}