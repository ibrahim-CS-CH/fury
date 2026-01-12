import { Control, util } from "fabric";
import { ImageListType } from "react-images-uploading";

export const UPLOAD_IMAGE_KEY = "uploaded-images";

export const saveImagesToSession = (images: ImageListType) => {
  sessionStorage.setItem(UPLOAD_IMAGE_KEY, JSON.stringify(images));
};

export const loadImagesFromSession = () => {
  const stored = sessionStorage.getItem(UPLOAD_IMAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay = 300
) {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const deleteIconImg = new Image();

deleteIconImg.src =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>  `);

export const deleteControl = new Control({
  x: 0.5,
  y: -0.5,
  offsetX: 16,
  offsetY: -16,
  cursorStyle: "pointer",

  mouseUpHandler(_, transform) {
    const target = transform.target;
    const canvas = target.canvas;

    if (!canvas) return false;

    canvas.remove(target);
    canvas.discardActiveObject();
    canvas.requestRenderAll();

    return true;
  },

  render(ctx, left, top) {
    const size = 16;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(util.degreesToRadians(0));
    ctx.drawImage(deleteIconImg, -size / 2, -size / 2, size, size);
    ctx.restore();
  },
});
