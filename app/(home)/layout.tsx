import Navbar from "../(components)/navbar";
import ProductFilter from "./product-filter";
import SearchCategory from "./search-category";

export default function HomeLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="min-h-screen h-full bg-white">
          <Navbar />
          <SearchCategory />
          <div className="w-full flex p-5 gap-5">
            <ProductFilter />
            {children}
          </div>
    </div>
  )
}