import clsx from "clsx";
import { Check, RefreshCw, Trash2, UploadCloud } from "lucide-react";
import { useState } from "react";
import ReactImageUploading, { ImageListType } from "react-images-uploading";

import {
  loadImagesFromSession,
  saveImagesToSession,
  UPLOAD_IMAGE_KEY,
} from "@/app/_providers/sesion-helpers";
import { Button } from "@/components/ui/button";

interface UploadImagesProps {
  onSelectImage: (src: string) => void;
}

export default function UploadImages({ onSelectImage }: UploadImagesProps) {
  const [images, setImages] = useState<ImageListType>(() =>
    typeof window !== "undefined" ? loadImagesFromSession() : []
  );

  const onChange = (imageList: ImageListType) => {
    setImages(imageList);
    saveImagesToSession(imageList);
  };

  const handleClear = () => {
    setImages([]);
    sessionStorage.removeItem(UPLOAD_IMAGE_KEY);
  };

  return (
    <div className="flex flex-col gap-2">
      <ReactImageUploading
        value={images}
        onChange={onChange}
        maxNumber={6}
        multiple
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          <div className="space-y-2">
            {imageList.length < 5 && (
              <div
                {...dragProps}
                onClick={onImageUpload}
                className={`
                flex cursor-pointer flex-col items-center justify-center gap-3
                rounded-xl border-2 border-dashed p-6 text-center transition
                ${
                  isDragging
                    ? "border-primary bg-primary/10"
                    : "border-muted-foreground/30 hover:border-primary"
                }
              `}
              >
                <UploadCloud className="h-10 w-10 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">Click or drag image here</p>
                  <p className="text-muted-foreground">
                    PNG, JPG (max 1 image)
                  </p>
                  <p className="text-muted-foreground">Mx size is 5 image</p>
                </div>
              </div>
            )}
            <div className="flex flex-wrap justify-center">
              {imageList.map((image, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-xl border w-fit  "
                >
                  <img
                    src={image.data_url}
                    alt="preview"
                    className="h-36 w-fit object-cover"
                  />

                  <div
                    className="
                  absolute inset-0 flex items-center justify-center gap-3
                  bg-black/40 opacity-0 transition group-hover:opacity-100
                "
                  >
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => onImageUpdate(index)}
                      className="cursor-pointer"
                    >
                      <RefreshCw className="h-4 w-4 " />
                    </Button>

                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => onImageRemove(index)}
                      className="cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4 cursor-pointer" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => {
                        onSelectImage(image.data_url);
                      }}
                      className="cursor-pointer"
                    >
                      <Check className="h-4 w-4 cursor-pointer" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </ReactImageUploading>
      <Button
        onClick={handleClear}
        className={clsx("flex cursor-pointer", {
          hidden: !images.length,
        })}
        variant={"secondary"}
      >
        Clear images
      </Button>
    </div>
  );
}
