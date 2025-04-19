"use client";

import Image from "next/image";
import { Trash2, Send, Undo2 } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { formatDate } from "date-fns";
import {
  getArticles,
  togglePublishArticle,
  deleteArticle,
} from "@/actions/article.actions";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

type Articles = Awaited<ReturnType<typeof getArticles>>;
type Article = Articles["articles"][number];

const bucketUrl = process.env.NEXT_PUBLIC_AWS_BUCKET_URL;

const AdminListItem = ({
  article,
  userId,
}: {
  article: Article;
  userId: number;
}) => {
  const imageUrl = `${bucketUrl}/${article.image}`;

  const handlePublishToggle = async () => {
    const prevStatus = article.status;
    const result = await togglePublishArticle(article.id);
    if (result.success)
      toast.success(
        prevStatus === "draft" ? "Article published" : "Article unpublished"
      );
    else toast.error(result.error);
  };

  const handleDelete = async () => {
    const result = await deleteArticle(article.id);
    if (result.success) toast.success("Article deleted");
    else toast.error(result.error);
  };

  return (
    <div
      key={article.id}
      className="bg-background p-4 rounded-lg flex items-center gap-4 hover:bg-primary-dark hover:text-background"
    >
      <Link href={`/admin/article/${article.id}`}>
        <div className="flex gap-4">
          <Image
            src={imageUrl}
            width={80}
            height={100}
            alt={article.image ? article.image : "No image"}
            style={{ objectFit: "contain" }}
          ></Image>
          <div>
            <p className="font-light text-sm">
              {article.status === "draft"
                ? "Draft"
                : formatDate(article.createdAt, "dd/MM/yyyy")}
            </p>
            <p>{article.title}</p>
            <p className="line-clamp-3 text-sm font-light mt-2">
              {article.content}
            </p>
          </div>
        </div>
      </Link>
      <div className="h-full flex flex-col justify-between items-center">
        <Button
          variant="outline"
          className="hover:cursor-pointer text-foreground"
          title={article.status === "draft" ? "Publish" : "Unpublish"}
          onClick={handlePublishToggle}
        >
          {article.status === "draft" ? <Send></Send> : <Undo2></Undo2>}
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="hover:cursor-pointer text-foreground"
              title="Delete"
            >
              <Trash2></Trash2>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete this article?</DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminListItem;
