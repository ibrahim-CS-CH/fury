import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadImages from "./UploadImages";
import Cliparts from "./Cliparts";

interface MainClipArtsProps {
  onSelectImage: (src: string) => void;
}
export default function MainClipArts({ onSelectImage }: MainClipArtsProps) {
  return (
    <Tabs defaultValue="clips" className="w-full">
      <TabsList className="w-full bg-primary/50">
        <TabsTrigger value="clips">Clips arts</TabsTrigger>
        <TabsTrigger value="images">Images</TabsTrigger>
        <TabsTrigger value="my-images">My images</TabsTrigger>
      </TabsList>

      <TabsContent className="p-2 w-full" value="clips">
        <Cliparts onSelectImage={onSelectImage} />
      </TabsContent>
      <TabsContent className="p-2" value="images">
        <UploadImages onSelectImage={onSelectImage} />
      </TabsContent>
      <TabsContent className="p-2" value="my-images">
        Wait untill we have backend api to load image from it
      </TabsContent>
    </Tabs>
  );
}
