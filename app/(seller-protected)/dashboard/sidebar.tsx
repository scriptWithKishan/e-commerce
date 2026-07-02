import Link from "next/link";

export default function DashboardSidebar() {
  return (
    <div className="w-70 flex-shrink-0 shadow-md py-4">
      <h1 className="text-3xl text-black font-extrabold text-center">Seller</h1>
      <ul className="p-2 flex flex-col">
        <li>
          <Link
            href="/dashboard"
            className="w-full block text-left bg-white font-bold text-black hover:bg-black hover:text-white p-4 cursor-pointer"
          >
            Dashboard
          </Link>
          <Link
            href="#"
            className="w-full block text-left bg-white font-bold text-black hover:bg-black hover:text-white p-4 cursor-pointer"
          >
            Your Orders
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/add-product"
            className="w-full block text-left bg-white font-bold text-black hover:bg-black hover:text-white p-4 cursor-pointer"
          >
            Add Product
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/list-product"
            className="w-full block text-left bg-white font-bold text-black hover:bg-black hover:text-white p-4 cursor-pointer"
          >
            List Products
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="w-full block text-left bg-white font-bold text-black hover:bg-black hover:text-white p-4 cursor-pointer"
          >
            View Sales
          </Link>
        </li>
      </ul>
    </div>
  )
}