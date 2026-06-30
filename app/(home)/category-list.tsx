"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Category } from "@/app/generated/prisma/client";
import { useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";

interface CategoryWithChildren extends Category {
  children?: Category[];
}

interface CategoryListProps {
  categories: CategoryWithChildren[];
}

export default function CategoryList({ categories }: CategoryListProps) {
  const router = useRouter();
  const [visible, setVisible] = useState<CategoryWithChildren[]>(categories);
  const [hidden, setHidden] = useState<CategoryWithChildren[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const widthsRef = useRef<number[]>([]);
  const moreRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const calculate = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const moreWidth = moreRef.current ? moreRef.current.offsetWidth + 16 : 116; // element + gap

      let used = 0;
      const visibleItems: CategoryWithChildren[] = [];
      const hiddenItems: CategoryWithChildren[] = [];
      let hasCollapsed = false;

      categories.forEach((item, index) => {
        const element = itemsRef.current[index];
        if (element && element.offsetWidth > 0) {
          widthsRef.current[index] = element.offsetWidth + 34; // cache width + gap
        }

        const width = widthsRef.current[index] || 100; // fallback to cache or estimate

        if (hasCollapsed) {
          hiddenItems.push(item);
        } else {
          const remaining = categories.length - index - 1;
          const reserve = remaining > 0 ? moreWidth : 0;

          if (used + width + reserve <= containerWidth) {
            used += width;
            visibleItems.push(item);
          } else {
            hasCollapsed = true;
            hiddenItems.push(item);
          }
        }
      });

      setVisible(visibleItems);
      setHidden(hiddenItems);
    };

    calculate();

    const resizeObserver = new ResizeObserver(calculate);
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [categories]);

  return (
    <div ref={containerRef} className="w-full">
      <ul className="flex items-center gap-4 justify-center flex-wrap w-full relative m-0 p-0 list-none">
        <li className={"block"}>
          <Link
            href={`/`}
            className="bg-white px-4 py-2 text-black rounded-md shadow-md border border-slate-200 hover:text-white hover:bg-black transition-colors block whitespace-nowrap"
          >
            All
          </Link>
        </li>
        {categories.map((category, index) => {
          const isVisible = visible.some((v) => v.id === category.id);
          return (
            <li
              key={category.id}
              className={isVisible ? "block relative group z-20" : "absolute invisible pointer-events-none"}
            >
              <Link
                ref={(el) => {
                  itemsRef.current[index] = el;
                }}
                href={`/category/${category.slug}`}
                className="bg-white px-4 py-2 text-black rounded-md shadow-md border border-slate-200 hover:text-white hover:bg-black transition-colors block whitespace-nowrap"
              >
                {category.name}
              </Link>
              {category.children && category.children.length > 0 && (
                <div className="absolute left-0 top-full mt-1 hidden group-hover:block w-56 rounded-md border border-slate-200 bg-white shadow-lg z-30 py-1 before:absolute before:-top-2 before:left-0 before:w-full before:h-2 before:content-['']">
                  {category.children.map((child) => (
                    <Link
                      key={child.id}
                      href={`/category/${child.slug}`}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-black hover:text-white transition-colors"
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          );
        })}
        {hidden.length > 0 && (
          <li className="block relative group z-20">
            <button ref={moreRef} className="bg-white px-4 py-2 text-black rounded-md shadow-md border border-slate-200 hover:text-white hover:bg-black transition-colors block whitespace-nowrap cursor-pointer">
              More
            </button>
            <div className="absolute right-0 top-full mt-1 hidden group-hover:block w-45 rounded-md border border-slate-200 bg-white shadow-lg z-30 py-1 before:absolute before:-top-2 before:left-0 before:w-full before:h-2 before:content-['']">
              {hidden.map((category) => (
                <div key={category.id} className="relative group/child">
                  {category.children && category.children.length > 0 ? (
                    <>
                      <Link href={`/category/${category.slug}`} className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-black hover:text-white transition-colors flex justify-end items-center gap-2 cursor-pointer">
                        <span className="text-xs order-1"><ChevronLeft size={14} /></span>
                        <span className="order-2 flex-1 text-right"> {category.name}</span>
                      </Link>
                      <div className="absolute right-full top-0 hidden group-hover/child:block w-48 rounded-md border border-slate-200 bg-white shadow-lg z-40 py-1 -mr-px">
                        {category.children.map((child) => (
                          <Link
                            key={child.id}
                            href={`/category/${child.slug}`}
                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-black hover:text-white transition-colors cursor-pointer"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={`/category/${category.slug}`}
                      className="block px-4 py-2 text-sm text-right text-slate-700 hover:bg-black hover:text-white transition-colors cursor-pointer"
                    >
                      {category.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </li>
        )}
      </ul>
    </div>
  );
}
