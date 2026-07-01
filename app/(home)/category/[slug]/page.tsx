import ProductList from "../../product-list";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ sort?: string; minPrice?: string; maxPrice?: string; inStock?: string }>;
}) {
  const { slug } = await params;
  const params_1 = await searchParams;

  return (
    <div className="flex-1">
      <ProductList categorySlug={slug} searchParams={params_1} />
    </div>
  );
}