import { Canvas, FabricImage, FabricObject, Textbox } from "fabric";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

import { useCanvasDraft } from "@/app/_hooks/use-canvas-draft";
import { deleteControl } from "@/app/_providers/sesion-helpers";
import { productImages, ProductType } from "./constants";
import { TextOptions } from "./TextEditor";

export interface ProductCanvasRef {
  addText: (text: string, options: TextOptions) => void;
  addImage: (src: string) => void;
  getSelectedObject: () => any;
  updateSelectedText: (
    updates: Partial<TextOptions & { text: string }>
  ) => void;
  clearDesign: () => void;
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

    const DRAFT_KEY = `studio:draft:${isFrontView ? "front" : "back"}`;

    const backgroundImageRef = useRef<FabricImage | null>(null);
    const frontTextObjectsRef = useRef<FabricObject[]>([]);
    const backTextObjectsRef = useRef<FabricObject[]>([]);

    const prevProductRef = useRef<ProductType>(product);

    const { bindDraftEvents, restoreDraft, unbindDraftEvents, saveDraft } =
      useCanvasDraft({
        canvasRef: fabricCanvas,
        storageKey: DRAFT_KEY,
      });

    // Shared function to get selected objects - fires automatically on selection
    const handleGetSelectedObject = useCallback(() => {
      if (!fabricCanvas.current) return null;
      const activeObjects = fabricCanvas.current.getActiveObjects();
      // Don't return the background image (first object);
      console.log("real activeObject", activeObjects);
      return activeObjects;
    }, []);

    useEffect(() => {
      if (!canvasRef.current) {
        return;
      }

      const canvas = new Canvas(canvasRef.current, {
        backgroundColor: "#f0f0f0",
      });

      fabricCanvas.current = canvas;

      const handleSelectionCreated = () => {
        const obj = canvas.getActiveObject();

        // Ensure delete control is added to the selected object
        if (obj && (obj instanceof Textbox || obj.type === "image")) {
          obj.controls = {
            ...obj.controls,
            deleteControl,
          };
          obj.setCoords();
          canvas.requestRenderAll();
        }

        onSelectionChange(obj instanceof Textbox ? obj : null);
        // Automatically fire getSelectedObject when any object is selected
        handleGetSelectedObject();
      };

      const handleSelectionUpdated = () => {
        const activeObject = canvas.getActiveObject();
        console.log("handleSelectionUpdated fire now");

        // Ensure delete control is added to the selected object
        if (
          activeObject &&
          (activeObject instanceof Textbox || activeObject.type === "image")
        ) {
          activeObject.controls = {
            ...activeObject.controls,
            deleteControl,
          };
          activeObject.setCoords();
          canvas.requestRenderAll();
        }

        onSelectionChange(
          activeObject instanceof Textbox ? activeObject : null
        );
        // Automatically fire getSelectedObject when selection is updated
        handleGetSelectedObject();
      };

      bindDraftEvents();
      restoreDraft();
      canvas.on("selection:created", handleSelectionCreated);
      canvas.on("selection:updated", handleSelectionUpdated);
      canvas.on("selection:cleared", () => {
        onSelectionChange(null);
        // Fire getSelectedObject even when selection is cleared
        handleGetSelectedObject();
      });

      return () => {
        if (fabricCanvas.current) {
          const canvas = fabricCanvas.current;
          unbindDraftEvents();
          canvas.off("selection:created", handleSelectionCreated);
          canvas.off("selection:updated", handleSelectionUpdated);
          canvas.dispose();
        }
      };
    }, []);

    useEffect(() => {
      if (prevProductRef.current !== product) {
        frontTextObjectsRef.current = [];
        backTextObjectsRef.current = [];
        prevProductRef.current = product;
      }
    }, []);

    useEffect(() => {
      if (!fabricCanvas.current) return;

      const canvas = fabricCanvas.current;

      FabricImage.fromURL(currentImage).then((img) => {
        const canvasW = canvas.getWidth();
        const canvasH = canvas.getHeight();

        const scale = Math.max(
          canvasW / (img.width ?? 1),
          canvasH / (img.height ?? 1)
        );

        img.set({
          originX: "center",
          originY: "center",
          left: canvasW / 2,
          top: canvasH / 2,
          scaleX: scale,
          scaleY: scale,
          selectable: false,
          evented: false,
          backgroundColor: selectedColor,
        });

        backgroundImageRef.current = img;
        canvas.backgroundImage = img;
        bindDraftEvents();
        canvas.requestRenderAll();
      });
    }, [currentImage, isFrontView]);

    useEffect(() => {
      if (!fabricCanvas.current || !backgroundImageRef.current) return;
      backgroundImageRef.current.set({
        backgroundColor: selectedColor,
      });

      fabricCanvas.current.requestRenderAll();
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

        fabricText.controls = {
          ...fabricText.controls,
          deleteControl,
        };

        if (isFrontView) {
          frontTextObjectsRef.current.push(fabricText);
        } else {
          backTextObjectsRef.current.push(fabricText);
        }

        console.log("fabricText", fabricText);

        canvas.add(fabricText);
        canvas.setActiveObject(fabricText);
        canvas.renderAll();
      },

      getSelectedObject: handleGetSelectedObject,

      updateSelectedText: (updates) => {
        const canvas = fabricCanvas.current;
        if (!canvas) return;
        const obj = canvas.getActiveObject();
        if (!(obj instanceof Textbox)) return;
        obj.set(updates);
        obj.initDimensions();
        obj.setCoords();
        canvas.requestRenderAll();
        saveDraft();
      },

      addImage: (src: string) => {
        const canvas = fabricCanvas.current;
        if (!canvas) return;

        FabricImage.fromURL(src).then((img) => {
          const MAX_SIZE = canvas.getWidth() * 0.5;

          const scale = Math.min(
            MAX_SIZE / (img.width ?? 1),
            MAX_SIZE / (img.height ?? 1),
            1
          );

          img.set({
            left: canvas.getWidth() / 2,
            top: canvas.getHeight() / 2,
            originX: "center",
            originY: "center",
            scaleX: scale,
            scaleY: scale,
            selectable: true,
            evented: true,
          });

          // نفس delete control بتاع النص
          img.controls = {
            ...img.controls,
            deleteControl,
          };

          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.requestRenderAll();
        });
      },

      clearDesign: () => {
        const canvas = fabricCanvas.current;
        if (!canvas) return;
        canvas.getObjects().forEach((obj) => {
          if (obj.type === "textbox" || obj.type === "image") {
            canvas.remove(obj);
            localStorage.removeItem(DRAFT_KEY);
          }
        });
      },
    }));

    return <canvas ref={canvasRef} width={"576"} height={"576"} />;
  }
);

ProductCanvas.displayName = "ProductCanvas";

export default ProductCanvas;
