import ProductList from "./product-list";

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ sort?: string; minPrice?: string; maxPrice?: string; inStock?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex-1">
      <ProductList searchParams={params} />
    </div>
  );
}
