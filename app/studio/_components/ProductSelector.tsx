"use client";

import SectionTitle from "@/components/shared/SectionTitle";
import { Button } from "@/components/ui/button";
import { ProductType } from "./constants";

interface ProductSelectorProps {
  currentProduct: ProductType;
  onProductChange: (product: ProductType) => void;
}

const products: { type: ProductType; label: string }[] = [
  { type: "tshirt", label: "T-shirt" },
  { type: "sweatpants", label: "Sweatpants" },
  { type: "sweatshirt", label: "Sweatshirt" },
];

export default function ProductSelector({
  currentProduct,
  onProductChange,
}: ProductSelectorProps) {
  return (
    <div className="p-1">
      <SectionTitle title="Select product" />
      <div className="flex flex-row gap-2 my-2">
        {products.map((product) => (
          <Button
            key={product.type}
            onClick={() => onProductChange(product.type)}
            variant={currentProduct === product.type ? "default" : "outline"}
          >
            {product.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
