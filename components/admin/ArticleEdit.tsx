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
import { useState } from "react";
import Image from "next/image";
import { GenreMultiSelect } from "./GenreMultiSelect";
import { UploadButton } from "@/lib/uploadthing";

type Article = Awaited<ReturnType<typeof getArticle>>;

function isWebUri(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const ArticleEdit = ({
  userId,
  article,
}: {
  userId: number;
  article?: Article;
}) => {
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState(
    article?.image && isWebUri(article.image) ? article.image : ""
  );
  const [uploadMessage, setUploadMessage] = useState("");

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

  async function onSubmit(values: z.infer<typeof articleSchema>) {
    if (!article && !previewUrl) {
      form.setError("image", { message: "Image is missing" });
      return;
    }

    let result: Result = { success: false };

    if (article)
      result = await updateArticle(
        article.id,
        values.title,
        values.content,
        previewUrl ?? article.image,
        values.genres.map((genre) => genre.id)
      );
    else if (previewUrl)
      result = await createArticle(
        userId,
        values.title,
        values.content,
        previewUrl,
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

  const genres = form.watch("genres");

  return (
    <div className="max-w-4xl mx-auto bg-background p-8 rounded-2xl flex flex-col gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex justify-between items-center">
            <h3>{article ? "Update article" : "New article"}</h3>
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="outline"
                className="cursor-pointer"
              >
                Save
              </Button>
            </div>
          </div>
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
                    <div className="flex items-start gap-4 mt-2">
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
                      <div className="flex flex-col items-start gap-2">
                        <UploadButton
                          content={{
                            button({ isUploading }) {
                              if (isUploading) return "Uploading...";
                              return "Choose Image";
                            },
                          }}
                          appearance={{
                            button:
                              "px-4 py-2 border hover:bg-accent hover:text-accent-foreground",
                          }}
                          endpoint="postImage"
                          onClientUploadComplete={(res) => {
                            if (res && res.length > 0) {
                              const imageUrl = res[0].ufsUrl;
                              setPreviewUrl(imageUrl);
                              setUploadMessage(`Image uploaded successfully`);
                            }
                          }}
                          onUploadError={(error: Error) => {
                            setUploadMessage(
                              "Upload failed. Please try again."
                            );
                            alert(`ERROR! ${error.message}`);
                          }}
                        />
                        <span>{uploadMessage}</span>
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
        </form>
      </Form>
    </div>
  );
};

export default ArticleEdit;
