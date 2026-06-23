import { Product } from "@/types";
import TransitionLink from "./transition-link";
import { useState } from "react";

export interface ProductItemProps {
  product: Product;
  /**
   * Whether to replace the current page when user clicks on this product item. Default behavior is to push a new page to the history stack.
   * This prop should be used when navigating to a new product detail from a current product detail page (related products, etc.)
   */
  replace?: boolean;
}

export default function ProductItem(props: ProductItemProps) {
  const [selected, setSelected] = useState(false);
  const { product } = props;

  return (
    <div
      className="flex flex-col cursor-pointer group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
      onClick={() => setSelected(true)}
    >
      <TransitionLink
        to={`/product/${product.id}`}
        replace={props.replace}
        className="p-3 pb-0"
      >
        {({ isTransitioning }) => (
          <>
            <img
              src={product.main_image || product.image || "https://via.placeholder.com/400x400/DC2626/FFFFFF?text=EPCVINA"}
              className="w-full aspect-square object-cover rounded-lg bg-gray-50"
              style={{
                viewTransitionName:
                  isTransitioning && selected
                    ? `product-image-${product.id}`
                    : undefined,
              }}
              alt={product.name}
            />
            <div className="pt-3 pb-3">
              <div className="text-xs text-gray-500 mb-1">{product.brand}</div>
              <div className="text-sm font-medium h-10 line-clamp-2 text-gray-800 mb-2">
                {product.name}
              </div>
              {product.specifications && (
                <div className="text-xs text-gray-600 space-y-1 mb-2">
                  {product.specifications["Công suất"] && (
                    <div className="flex items-center">
                      <span className="text-gray-500">Công suất:</span>
                      <span className="ml-1 font-medium text-red-600">
                        {product.specifications["Công suất"]}
                      </span>
                    </div>
                  )}
                  {product.specifications["Hiệu suất"] && (
                    <div className="flex items-center">
                      <span className="text-gray-500">Hiệu suất:</span>
                      <span className="ml-1 font-medium text-red-600">
                        {product.specifications["Hiệu suất"]}
                      </span>
                    </div>
                  )}
                </div>
              )}
              {product.warranty && (
                <div className="text-xs text-gray-500 flex items-center">
                  <span>🛡️</span>
                  <span className="ml-1">{product.warranty}</span>
                </div>
              )}
            </div>
          </>
        )}
      </TransitionLink>
    </div>
  );
}
