import Navbar from "../(components)/navbar";
import ProductFilter from "./product-filter";
import SearchCategory from "./search-category";

export default function HomeLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="min-h-screen h-full bg-white">
          <Navbar />
          <SearchCategory />
          <div className="w-full flex">
            <ProductFilter />
            {children}
          </div>
    </div>
  )
}