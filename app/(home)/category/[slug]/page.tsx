import ProductList from "../../product-list";

export default async function CategoryPage({params}: {params: Promise<{slug: string}>}) {
    const {slug} = await params

    return (
      <div className="flex-1">
        <ProductList categorySlug={slug} />
      </div>
    )
}