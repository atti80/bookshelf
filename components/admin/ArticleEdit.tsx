"use client";

import { articleSchema } from "@/lib/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  getArticle,
  createArticle,
  updateArticle,
  Result,
} from "@/actions/article.actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { uploadImage } from "@/actions/image.actions";
import { GenreMultiSelect } from "./GenreMultiSelect";

const BUCKET_URL = process.env.NEXT_PUBLIC_AWS_BUCKET_URL;
type Article = Awaited<ReturnType<typeof getArticle>>;

const ArticleEdit = ({
  userId,
  article,
}: {
  userId: number;
  article?: Article;
}) => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(
    article ? `${BUCKET_URL}/${article.image}` : ""
  );

  const form = useForm<z.infer<typeof articleSchema>>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: `${article ? article.title : ""}`,
      content: `${article ? article.content : ""}`,
      genres: article
        ? article.genres.map((g) => {
            return { id: g.genreId, name: g.genre.name };
          })
        : [],
    },
  });

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  async function onSubmit(values: z.infer<typeof articleSchema>) {
    if (!article && !file) {
      form.setError("image", { message: "Image is missing" });
      return;
    }
    if (file && file.size > 1024 * 1024) {
      form.setError("image", { message: "Image size must be less than 1MB" });
      return;
    }

    let result: Result = { success: false };
    if (file) {
      result = await uploadImage(file);
      if (result.success) toast.success("Image uploaded successfully");
      else toast.error(result.error);
    }

    if (article)
      result = await updateArticle(
        article.id,
        values.title,
        values.content,
        file ? file.name : article.image,
        values.genres.map((genre) => genre.id)
      );
    else if (file)
      result = await createArticle(
        userId,
        values.title,
        values.content,
        file.name,
        values.genres.map((genre) => genre.id)
      );

    if (result.success) {
      router.push("/admin");
      toast.success(`Article ${article ? "updated" : "created"}`);
    } else toast.error(result.error);
  }

  const handleCancel = () => {
    router.push("/admin");
  };

  const handleDeleteImage = () => {
    setFile(null);
    setPreviewUrl("");
  };

  const genres = form.watch("genres");

  return (
    <div className="w-4xl mx-auto bg-background p-8 rounded-2xl flex flex-col gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="genres"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genres</FormLabel>
                <FormControl>
                  <GenreMultiSelect
                    value={genres}
                    onChange={(newGenres) => form.setValue("genres", newGenres)}
                  ></GenreMultiSelect>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <div>
                    <Input
                      type="file"
                      {...field}
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    <div className="flex gap-4 mt-2">
                      <div className="relative w-[200px] h-[200px] border-foreground border-[1px] rounded-sm overflow-hidden">
                        {previewUrl && (
                          <Image
                            src={previewUrl}
                            alt="article image"
                            fill={true}
                            objectFit="contain"
                          ></Image>
                        )}
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    className="h-[500px]"
                    placeholder="Write your article here..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button type="submit" variant="outline" className="cursor-pointer">
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ArticleEdit;
