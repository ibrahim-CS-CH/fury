"use client";

import clsx from "clsx";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ColorSelector from "./_components/ColorSelector";
import {
  DEFAULT_COLOR_KEY,
  DEFAULT_PRODUCT_KEY,
  ProductType,
} from "./_components/constants";
import MainClipArts from "./_components/MainClipArts";
import ProductCanvas, { ProductCanvasRef } from "./_components/ProductCanvas";
import ProductSelector from "./_components/ProductSelector";
import SizeSelector from "./_components/SizeSelector";
import TextEditor, { TextOptions } from "./_components/TextEditor";
import ViewToggleButton from "./_components/ViewToggleButton";

export default function Studio() {
  const tshritColor = localStorage.getItem(DEFAULT_COLOR_KEY);
  const product = localStorage.getItem(DEFAULT_PRODUCT_KEY);

  const [currentProduct, setCurrentProduct] = useState<ProductType>(
    product ? (product as ProductType) : "tshirt"
  );
  const [isFrontView, setIsFrontView] = useState<boolean>(true);

  const [selectedColor, setSelectedColor] = useState<string>(
    tshritColor ? tshritColor : "#FFFFFF"
  );
  const [selectedObject, setSelectedObject] = useState<TextOptions | null>(
    null
  );

  const canvasRef = useRef<ProductCanvasRef>(null);

  const handleProductChange = (product: ProductType) => {
    localStorage.setItem(DEFAULT_PRODUCT_KEY, product);

    setCurrentProduct(product);
    setIsFrontView(true);
  };

  const handleGetObjects = () => {
    canvasRef.current?.getSelectedObject();
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

  const handleAddImage = (src: string) => {
    canvasRef.current?.addImage(src);
  };

  const handleAddSvg = (src: string) => {
    canvasRef.current?.addSvg(src);
  };
  const clearDesign = localStorage.getItem("studio:draft:front");

  const handleClearDesign = () => {
    if (clearDesign) {
      localStorage.removeItem(DEFAULT_PRODUCT_KEY);
      localStorage.removeItem(DEFAULT_COLOR_KEY);
      localStorage.removeItem("studio:draft:front");
      canvasRef.current?.clearDesign();
    }
  };

  return (
    <div className="flex flex-wrap gap-2 max-w-7xl mx-auto ">
      <Card className="relative w-fit mx-auto">
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

      <Card className="md:min-w-2xl min-w-xl max-w-2xl mx-auto  p-0">
        <Tabs defaultValue="products">
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
            <MainClipArts onSelectImage={handleAddImage} />
          </TabsContent>
          <TabsContent className="p-2" value="save">
            Save--login OR check business scenario
          </TabsContent>
          <TabsContent value="text">
            <TextEditor
              onAddText={handleAddText}
              selectedObject={(selectedObject as TextOptions) ?? null}
              onUpdateText={handleUpdateText}
              canvas={canvasRef}
              handleGetObjects={handleGetObjects}
            />
          </TabsContent>
        </Tabs>
      </Card>

      <Button
        variant={clearDesign ? "default" : "secondary"}
        onClick={handleClearDesign}
        className={clsx(" cursor-pointer")}
      >
        Clear Design
      </Button>
    </div>
  );
}
