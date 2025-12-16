"use client";

import { FabricObject } from "fabric";
import { useRef, useState } from "react";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ColorSelector from "./_components/ColorSelector";
import { ProductType } from "./_components/constants";
import ProductCanvas, { ProductCanvasRef } from "./_components/ProductCanvas";
import ProductSelector from "./_components/ProductSelector";
import SizeSelector from "./_components/SizeSelector";
import TextEditor, { TextOptions } from "./_components/TextEditor";
import ViewToggleButton from "./_components/ViewToggleButton";

export default function Studio() {
  const [currentProduct, setCurrentProduct] = useState<ProductType>("tshirt");
  const [isFrontView, setIsFrontView] = useState<boolean>(true);
  const [selectedColor, setSelectedColor] = useState<string>("#FFFFFF");
  const [selectedObject, setSelectedObject] = useState<TextOptions | null>(
    null
  );
  const canvasRef = useRef<ProductCanvasRef>(null);
  console.log("selectedObject", selectedObject);

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

  const handleUpdateText = (
    updates: Partial<TextOptions & { text: string }>
  ) => {
    canvasRef.current?.updateSelectedText(updates);
  };

  return (
    <section className="flex flex-col items-center gap-4">
      <h2 className="flex-1 capitalize text-xl font-semibold">
        canvas trainning
      </h2>
      <div className="flex gap-2">
        <Card className="h-fit relative">
          <ProductCanvas
            ref={canvasRef}
            product={currentProduct}
            isFrontView={isFrontView}
            selectedColor={selectedColor}
            onSelectionChange={handleSelectionChange}
            updateSelectedText={handleUpdateText}
          />
          <ViewToggleButton
            isFrontView={isFrontView}
            onToggle={handleViewToggle}
          />
        </Card>

        <Card className="h-fit">
          <Tabs defaultValue="products" className="min-w-2xl max-w-2xl">
            <TabsList className="w-full">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="clip-arts">Clip Arts</TabsTrigger>
              <TabsTrigger value="save">Save</TabsTrigger>
            </TabsList>
            <TabsContent className="p-2" value="products">
              <ProductSelector
                currentProduct={currentProduct}
                onProductChange={handleProductChange}
              />
              <ColorSelector
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
              />

              <SizeSelector />
            </TabsContent>
            <TabsContent className="p-2" value="clip-arts">
              Change your password here.
            </TabsContent>
            <TabsContent className="p-2" value="save">
              Save here.
            </TabsContent>
            <TabsContent value="text">
              <TextEditor
                onAddText={handleAddText}
                selectedObject={selectedObject as TextOptions ?? null}
                onUpdateText={handleUpdateText}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </section>
  );
}
