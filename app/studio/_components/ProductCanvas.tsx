import { Canvas, FabricImage, FabricObject, Textbox } from "fabric";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { productImages, ProductType } from "./constants";
import { TextOptions } from "./TextEditor";

export interface ProductCanvasRef {
  addText: (text: string, options: TextOptions) => void;
  getSelectedObject: () => any;
  updateSelectedText: (
    updates: Partial<TextOptions & { text: string }>
  ) => void;
}

interface ProductCanvasProps {
  product: ProductType;
  isFrontView: boolean;
  selectedColor: string;
  onSelectionChange: (selectedObject: any) => void;
  updateSelectedText: (
    updates: Partial<TextOptions & { text: string }>
  ) => void;
}

const ProductCanvas = forwardRef<ProductCanvasRef, ProductCanvasProps>(
  ({ product, isFrontView, selectedColor, onSelectionChange }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvas = useRef<Canvas | null>(null);

    const currentImage = isFrontView
      ? productImages[product].front
      : productImages[product].back;

    const backgroundImageRef = useRef<FabricImage | null>(null);
    const frontTextObjectsRef = useRef<FabricObject[]>([]);
    const backTextObjectsRef = useRef<FabricObject[]>([]);
    const prevProductRef = useRef<ProductType>(product);

    // Initialize canvas only once
    useEffect(() => {
      if (!canvasRef.current) {
        return;
      }

      const canvas = new Canvas(canvasRef.current, {
        backgroundColor: "#f0f0f0",
      });

      fabricCanvas.current = canvas;

      // Listen for selection changes
      // const handleSelectionCreated = () => {
      //   const activeObject = canvas.getActiveObjects();
      //   onSelectionChange(activeObject);
      //   // Don't track the background image (first object)
      // };

      const handleSelectionCreated = () => {
        const obj = canvas.getActiveObject();
        onSelectionChange(obj instanceof Textbox ? obj : null);
      };

      const handleSelectionUpdated = () => {
        const activeObject = canvas.getActiveObject();
        console.log(activeObject);
      };

      canvas.on("selection:created", handleSelectionCreated);
      canvas.on("selection:updated", handleSelectionUpdated);
      canvas.on("selection:cleared", () => {
        onSelectionChange(null);
      });

      return () => {
        if (fabricCanvas.current) {
          const canvas = fabricCanvas.current;
          canvas.off("selection:created", handleSelectionCreated);
          canvas.off("selection:updated", handleSelectionUpdated);
          canvas.dispose();
        }
      };
    }, []);

    // Clear text objects when product changes
    useEffect(() => {
      if (prevProductRef.current !== product) {
        frontTextObjectsRef.current = [];
        backTextObjectsRef.current = [];
        prevProductRef.current = product;
      }
    }, [product]);

    // Update image when product or view changes
    useEffect(() => {
      if (!fabricCanvas.current) return;

      const canvas = fabricCanvas.current;

      // Remove old background image if it exists
      if (backgroundImageRef.current) {
        canvas.remove(backgroundImageRef.current);
      }

      // Remove all text objects from canvas
      const allTextObjects = [
        ...frontTextObjectsRef.current,
        ...backTextObjectsRef.current,
      ];
      allTextObjects.forEach((obj) => {
        if (canvas.getObjects().includes(obj)) {
          canvas.remove(obj);
        }
      });

      // Clear canvas
      // canvas.clear();
      canvas.remove(...canvas.getObjects());

      FabricImage.fromURL(currentImage).then((img) => {
        const imgWidth = img.width ?? 0;
        const imgHeight = img.height ?? 0;

        const CANVAS_WIDTH = canvas.getWidth();
        const CANVAS_HEIGHT = canvas.getHeight();

        const scaleX = CANVAS_WIDTH / imgWidth;
        const scaleY = CANVAS_HEIGHT / imgHeight;

        const scale = Math.max(scaleX, scaleY);

        img.scale(scale);

        const imgLeft = CANVAS_WIDTH / 2 - (imgWidth * scale) / 2;
        const imgTop = CANVAS_HEIGHT / 2 - (imgHeight * scale) / 2;

        img.set({
          left: imgLeft,
          top: imgTop,
          selectable: false,
          evented: false,
          lockMovementX: true,
          lockMovementY: true,
          lockRotation: true,
          lockScalingX: true,
          lockScalingY: true,
          lockSkewingX: true,
          lockSkewingY: true,
          backgroundColor: selectedColor,
        });

        // Add image first (background)
        canvas.add(img);
        canvas.sendObjectToBack(img);
        backgroundImageRef.current = img;

        // Add text objects for current view only
        const currentTextObjects = isFrontView
          ? frontTextObjectsRef.current
          : backTextObjectsRef.current;

        currentTextObjects.forEach((textObj) => {
          canvas.add(textObj);
        });

        canvas.renderAll();
      });
    }, [currentImage, isFrontView]);

    // Update only the background color when selectedColor changes
    useEffect(() => {
      if (!fabricCanvas.current || !backgroundImageRef.current) return;

      backgroundImageRef.current.set({
        backgroundColor: selectedColor,
      });
      fabricCanvas.current.renderAll();
    }, [selectedColor]);

    useImperativeHandle(ref, () => ({
      addText: (text: string, options: TextOptions) => {
        if (!fabricCanvas.current) return;

        const canvas = fabricCanvas.current;
        const fabricText = new Textbox(text, {
          left: canvas.getWidth() / 2,
          top: canvas.getHeight() / 2,
          // width: canvas.getWidth() * 0.6,
          textAlign: "center",
          editable: true,
          originX: "center",
          originY: "center",
          ...options,
        });

        // Store text object in the appropriate array based on current view
        if (isFrontView) {
          frontTextObjectsRef.current.push(fabricText);
        } else {
          backTextObjectsRef.current.push(fabricText);
        }

        // Add to canvas
        canvas.add(fabricText);
        canvas.renderAll();
      },
      getSelectedObject: () => {
        if (!fabricCanvas.current) return null;
        const activeObject = fabricCanvas.current.getActiveObjects();
        // Don't return the background image (first object);
        console.log("real activeObject", activeObject);
        
        // if (
        //   activeObject &&
        //   activeObject !== fabricCanvas.current.getObjects()[0]
        // ) {
        //   return activeObject;
        // }
        // return null;
      },

      updateSelectedText: (updates) => {
        const canvas = fabricCanvas.current;
        if (!canvas) return;

        const obj = canvas.getActiveObject();
        console.log("obj", obj);
        
        if (!(obj instanceof Textbox)) return;

        obj.set(updates);

        // IMPORTANT for text changes
        obj.initDimensions();
        obj.setCoords();
        canvas.requestRenderAll();
      },
    }));

    return (
      <canvas ref={canvasRef} width={500} height={500} className="max-w-2xl" />
    );
  }
);

ProductCanvas.displayName = "ProductCanvas";

export default ProductCanvas;
