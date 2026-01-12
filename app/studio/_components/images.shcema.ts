
import {zodResolver} from "@hookform/resolvers/zod"
import z from "zod"

const imagesSchema = z.object({
    images: z.any
})


export type ImagesType = z.infer<typeof imagesSchema>;
export const imagesResolver = zodResolver(imagesSchema);

