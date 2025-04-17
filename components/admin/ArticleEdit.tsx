"use client";

import { articleSchema } from "@/lib/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  getArticle,
  createArticle,
  updateArticle,
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

type Article = Awaited<ReturnType<typeof getArticle>>;

const ArticleEdit = ({
  userId,
  article,
}: {
  userId: number;
  article?: Article;
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof articleSchema>>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: `${article ? article.title : ""}`,
      content: `${article ? article.content : ""}`,
    },
  });

  async function onSubmit(values: z.infer<typeof articleSchema>) {
    let result;
    if (article && article.id) {
      result = await updateArticle(article.id, values.title, values.content);
    } else {
      result = await createArticle(values.title, values.content, userId);
    }

    if (result.success) {
      router.push("/admin");
      toast.success(`Article ${article ? "updated" : "created"}`);
    } else toast.error(result.error);
  }

  const handleCancel = () => {
    router.push("/admin");
  };

  return (
    <div className="w-4xl mx-auto bg-background mt-8 p-8 rounded-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
