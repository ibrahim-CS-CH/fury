import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { Plus, RefreshCcw, Trash2, UploadIcon, X } from "lucide-react";
import { forwardRef, useEffect, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import ImageUploading, { ImageListType } from "react-images-uploading";


type RHFLibSingleImageUploaderProps = UseFormRegisterReturn & {
  error?: string | null;
  initialValue?: string | string[];
  title?: string;
  imgClass?: string;
  className?: string;
  multiple?: boolean;
  required?: boolean;
  maxNumber?: number;
};

const RHFLibSingleImageUploader = forwardRef<HTMLInputElement, RHFLibSingleImageUploaderProps>(
  (
    {
      initialValue,
      className,
      imgClass,
      name,
      onChange,
      error,
      title,
      multiple = false,
      maxNumber = 1,
      required = false,
    },
    ref,
  ) => {
    const [images, setImages] = useState<ImageListType>([]);

    useEffect(() => {
      if (initialValue && images.length === 0) {
        const initImages = Array.isArray(initialValue)
          ? initialValue.map((url) => ({ data_url: url, file: undefined }))
          : [{ data_url: initialValue, file: undefined }];
        setImages(initImages);
      }
    }, [initialValue]);

    const handleImageChange = (imageList: ImageListType) => {
      setImages(imageList);

      if (onChange) {
        const files = imageList.map((img) => img.file).filter(Boolean) as File[];
        onChange({
          target: { name, value: multiple ? files : files[0] || null },
        });
      }
    };

    return (
      <section className={clsx("flex flex-col", className)}>
        {title && (
          <p className="py-1 text-sm font-medium">
            {title} <span className="text-destructive"> {required ? "*" : ""}</span>
          </p>
        )}

        <ImageUploading
          value={images}
          onChange={handleImageChange}
          multiple={multiple}
          maxNumber={maxNumber}
          dataURLKey="data_url"
        >
          {({ imageList, onImageUpload, onImageRemove, onImageUpdate, dragProps, onImageRemoveAll }) => (
            <div
              className={clsx(
                "flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-primary transition cursor-pointer relative",
                { "border-red-400": error },
              )}
              {...dragProps}
              ref={ref}
              tabIndex={0}
            >
              <X
                className={clsx("absolute top-1 right-1 text-destructive", {
                  hidden: !imageList.length,
                })}
                size={14}
                onClick={() => onImageRemoveAll()}
              />

              {imageList.length === 0 && (
                <div className="flex flex-col items-center space-y-2 " onClick={onImageUpload}>
                  <UploadIcon className="w-8 h-8 text-gray-400" />
                  <p className="text-sm text-gray-500">drag_drop</p>
                </div>
              )}

              <div
                className={clsx("flex gap-3 w-fit h-fit mt-2", {
                  multiple: "gap-4",
                })}
              >
                {imageList.map((image, index) => (
                  <div key={index} className="relative group w-full">
                    <img
                      src={image.data_url}
                      alt={`uploaded-${index}`}
                      className={clsx("w-full h-32 object-contain rounded-md border", imgClass)}
                    />
                    <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/50 rounded-md  gap-1">
                      <Button type="button" size="icon" variant="secondary" onClick={() => onImageUpdate(index)}>
                        <RefreshCcw className="w-4 h-4" />
                      </Button>
                      <Button type="button" size="icon" variant="destructive" onClick={() => onImageRemove(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {multiple && imageList.length < maxNumber && imageList.length != 0 && (
                  <div
                    onClick={onImageUpload}
                    className="flex flex-col items-center justify-center w-full h-32 border border-dashed rounded-md cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition"
                  >
                    <Plus className="w-6 h-6 text-gray-400" />
                    <p className="text-xs text-gray-500 mt-1">add_more</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </ImageUploading>

        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </section>
    );
  },
);

RHFLibSingleImageUploader.displayName = "RHFLibSingleImageUploader";
export default RHFLibSingleImageUploader;