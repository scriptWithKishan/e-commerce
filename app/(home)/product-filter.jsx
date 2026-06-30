export default function ProductFilter () {
  return (
    <div className="p-10 ">
      <div className="w-[300px] shadow-md p-4 rounded-md mt-5 text-black">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        
        {/* Categories */}
        <div className="mb-4">
          <h3 className="font-medium mb-2">Categories</h3>
          <label className="flex items-center gap-2 mb-1">
            <input type="checkbox" className="rounded" />
            Electronics
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            Clothing
          </label>
        </div>
        
        {/* Price Range */}
        <div className="mb-4">
          <h3 className="font-medium mb-2">Price Range</h3>
          <div className="flex gap-2">
            <input type="number" placeholder="Min" className="w-1/2 rounded border px-2 py-1" />
            <input type="number" placeholder="Max" className="w-1/2 rounded border px-2 py-1" />
          </div>
        </div>
        
        {/* Stock */}
        <div>
          <h3 className="font-medium mb-2">Stock Status</h3>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            In Stock Only
          </label>
        </div>
        
        <button className="w-full bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700 transition">
          Apply Filters
        </button>
      </div>
    </div>
  )
}