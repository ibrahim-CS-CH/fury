"use client";

import { Canvas } from "fabric";
import { MutableRefObject, useCallback, useRef } from "react";
import { deleteControl } from "../_providers/sesion-helpers";

interface UseCanvasDraftParams {
  canvasRef: MutableRefObject<Canvas | null>;
  storageKey: string;
}

export function useCanvasDraft({
  canvasRef,
  storageKey,
}: UseCanvasDraftParams) {
  const isRestoringRef = useRef(false);

  // ------------------------
  // SAVE
  // ------------------------
  const saveDraft = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRestoringRef.current) return;

    const json = canvas.toJSON();

    console.log("canvas.getObjects();", canvas.getObjects());

    localStorage.setItem(storageKey, JSON.stringify(json));
  }, [canvasRef, storageKey]);

  // ------------------------
  // RESTORE
  // ------------------------
  const restoreDraft = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const raw = localStorage.getItem(storageKey);
    if (!raw) return;

    isRestoringRef.current = true;

    await new Promise<void>((resolve) => {
      canvas.loadFromJSON(raw, () => {
        canvas.getObjects().forEach((obj) => {
          obj.controls = {
            ...obj.controls,
            deleteControl,
          };
        });

        canvas.renderAll();
        resolve();
      });
    });

    isRestoringRef.current = false;
  }, [canvasRef, storageKey]);

  // ------------------------
  // EVENTS
  // ------------------------
  const bindDraftEvents = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.on("object:added", saveDraft);
    canvas.on("object:modified", saveDraft);
    canvas.on("object:removed", saveDraft);
  }, [canvasRef, saveDraft]);

  const unbindDraftEvents = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.off("object:added", saveDraft);
    canvas.off("object:modified", saveDraft);
    canvas.off("object:removed", saveDraft);
  }, [canvasRef, saveDraft]);

  return {
    restoreDraft,
    bindDraftEvents,
    unbindDraftEvents,
    saveDraft,
  };
}
