"use client";

import { useRef, useState } from "react";

import ColorSelector from "./_components/ColorSelector";
import { ProductType } from "./_components/constants";
import ProductCanvas, { ProductCanvasRef } from "./_components/ProductCanvas";
import ProductSelector from "./_components/ProductSelector";
import TextEditor, { TextOptions } from "./_components/TextEditor";
import ViewToggleButton from "./_components/ViewToggleButton";

export default function Studio() {
  const [currentProduct, setCurrentProduct] = useState<ProductType>("tshirt");
  const [isFrontView, setIsFrontView] = useState<boolean>(true);
  const [selectedColor, setSelectedColor] = useState<string>("#FFFFFF");
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const canvasRef = useRef<ProductCanvasRef>(null);

  const handleProductChange = (product: ProductType) => {
    setCurrentProduct(product);
    setIsFrontView(true);
  };

  const handleViewToggle = () => {
    setIsFrontView(!isFrontView);
  };

  const handleAddText = (text: string, options: TextOptions) => {
    canvasRef.current?.addText(text, options);
  };

  const handleSelectionChange = (selectedObject: any) => {
    setSelectedObject(selectedObject);
  };

  return (
    <section className="flex flex-col items-center">
      <h2 className="font-bold text-xl capitalize">canvas trainning</h2>
      <div className="flex gap-2">
        <div className="relative">
          <ProductCanvas
            ref={canvasRef}
            product={currentProduct}
            isFrontView={isFrontView}
            selectedColor={selectedColor}
            onSelectionChange={handleSelectionChange}
          />
          <ViewToggleButton
            isFrontView={isFrontView}
            onToggle={handleViewToggle}
          />
        </div>

        <div className="p-2">
          <ProductSelector
            currentProduct={currentProduct}
            onProductChange={handleProductChange}
          />

          <ColorSelector
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
          />

          <TextEditor onAddText={handleAddText} />

        </div>
      </div>
    </section>
  );
}
