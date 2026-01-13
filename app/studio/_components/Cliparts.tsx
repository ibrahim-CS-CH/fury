import Image from "next/image";

import { clipArtsImage } from "./constants";

interface ClipArtsProps {
  onSelectImage: (src: string) => void;
}
export default function Cliparts({ onSelectImage }: ClipArtsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {clipArtsImage.map((img) => (
        <div className="flex" key={img}>
          <Image
            src={img}
            alt="image"
            width={"100"}
            height={"100"}
            onClick={() => {
              onSelectImage(img);
            }}
            className="border border-gray-500 rounded-2xl overflow-hidden"
          />
        </div>
      ))}
    </div>
  );
}
