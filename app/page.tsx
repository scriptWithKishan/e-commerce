import Navbar from "./(components)/navbar";
import ProductList from "./products/product-list";
import ProductFilter from "./products/product-filter";

export default async function Home() {
  
  return (
    <div className="min-h-screen h-full bg-white">
      <Navbar />
      <div className="w-full flex ">
        <ProductFilter />
        <ProductList />
      </div>
    </div>
  )
}
