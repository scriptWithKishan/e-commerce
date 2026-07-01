"use client";

import { useState, useCallback, useEffect } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface ProductFilterProps {
  min?: number;
  max?: number;
  step?: number;
}

export default function ProductFilter ({
  min=0,
  max=10000,
  step=100,
}: ProductFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [sort, setSort] = useState(searchParams.get("sort") || "date-desc");
  const [minValue, setMinValue] = useState(Number(searchParams.get("minPrice")) || min);
  const [maxValue, setMaxValue] = useState(Number(searchParams.get("maxPrice")) || max);
  const [inStockOnly, setInStockOnly] = useState(searchParams.get("inStock") === "true");

  // Update state when URL params change
  useEffect(() => {
    function setURLParams () {
      setSort(searchParams.get("sort") || "date-desc");
      setMinValue(Number(searchParams.get("minPrice")) || min);
      setMaxValue(Number(searchParams.get("maxPrice")) || max);
      setInStockOnly(searchParams.get("inStock") === "true");
    }
    setURLParams();
  }, [searchParams, min, max]);

  const handleMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Math.min(Number(e.target.value), maxValue - step);
      setMinValue(value);
    },
    [maxValue, step]
  );

  const handleMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Math.max(Number(e.target.value), minValue + step);
      setMaxValue(value);
    },
    [minValue, step]
  );

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (sort !== "date-desc") {
      params.set("sort", sort);
    } else {
      params.delete("sort");
    }

    if (minValue > min) {
      params.set("minPrice", minValue.toString());
    } else {
      params.delete("minPrice");
    }

    if (maxValue < max) {
      params.set("maxPrice", maxValue.toString());
    } else {
      params.delete("maxPrice");
    }

    if (inStockOnly) {
      params.set("inStock", "true");
    } else {
      params.delete("inStock");
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  };

  const resetFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("sort");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("inStock");

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  }

  const minPercent = ((minValue - min) / (max - min)) * 100;
  const maxPercent = ((maxValue - min) / (max - min)) * 100;

  return (
    <div className="w-[300px] h-[400px] shadow-md p-4 rounded-md text-black">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      
      {/* Sort */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Sort</h3>
        <select 
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </div>
      
      {/* Price Range */}
      <div className="w-full max-w-md mb-4">
        {/* Price labels */}
        <div className="flex justify-between items-center mb-2 text-sm font-medium text-gray-700">
          <span>{minValue.toLocaleString()}</span>
          <span>{maxValue.toLocaleString()}</span>
        </div>
        {/* Slider track container */}
        <div className="relative h-1.5">
          {/* Background track */}
          <div className="absolute inset-0 rounded-full bg-gray-200">
            {/* Active/filled track between the two handles */}
            <div
              className="absolute h-full rounded-full bg-blue-600"
              style={{
                left: `${minPercent}%`,
                width: `${maxPercent - minPercent}%`
              }}
            />
            {/* Min handle input */}
            <input 
              type="range"
              min={min}
              max={max}
              step={step}
              value={minValue}
              onChange={handleMinChange}
              className="range-thumb absolute w-full h-1.5 top-0 bg-transparent appearance-none pointer-events-none"
              style={{ zIndex: minValue > max - step ? 5 : 3 }}
            />
            {/* Max handle input */}
            <input 
              type="range"
              min={min}
              max={max}
              step={step}
              value={maxValue}
              onChange={handleMaxChange}
              className="range-thumb absolute w-full h-1.5 top-0 bg-transparent appearance-none pointer-events-none"
              style={{ zIndex: 4 }}
            />
          </div>
        </div>
      </div>
      
      {/* Stock */}
      <div>
        <h3 className="font-semibold mb-2">Stock Status</h3>
        <label className="flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="rounded" 
          />
          In Stock Only
        </label>
      </div>
      
      <button 
        onClick={applyFilters}
        className="w-full bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700 transition cursor-pointer"
      >
        Apply Filters
      </button>
      <button 
        onClick={resetFilters}
        className="w-full bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700 transition cursor-pointer"
      >
        Reset Filters
      </button>
    </div>
  );
}