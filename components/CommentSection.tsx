"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  getComments,
  createComment,
  deleteComment,
} from "@/actions/comment.actions";
import { toast } from "sonner";
import { Separator } from "./ui/separator";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";

type Comments = Awaited<ReturnType<typeof getComments>>;

const CommentSection = ({
  articleId,
  userId,
  userName,
}: {
  articleId: number;
  userId: number | undefined;
  userName: string | undefined;
}) => {
  const [comments, setComments] = useState<Comments>([]);
  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      const result = await getComments(articleId);
      setComments(result);
    };
    fetchComments();
  }, []);

  const handleCommentSubmit = async () => {
    if (isCommenting || !commentText.trim() || !userId || !articleId) return;

    try {
      setIsCommenting(true);
      const result = await createComment(articleId, userId, commentText.trim());
      if (result.success) {
        toast.success("Comment posted successfully");
        if (result.data) {
          setComments((prev) => [
            {
              ...result.data,
              user: { id: userId, name: userName ?? null },
            },
            ...prev,
          ]);
        }
        setCommentText("");
      }
      setIsCommenting(false);
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      const result = await deleteComment(commentId);
      if (result.success) {
        setComments((prev) =>
          prev.filter((comment) => comment.id !== commentId)
        );
        toast.success("Comment deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div className="bg-background rounded-md flex flex-col p-4 gap-4">
      {userId && (
        <div className="flex items-end gap-4">
          <Textarea
            placeholder="Type your comment here..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          ></Textarea>
          <Button
            variant="secondary"
            onClick={handleCommentSubmit}
            disabled={!commentText.trim() || isCommenting}
          >
            Submit
          </Button>
        </div>
      )}
      {comments.length > 0 && (
        <>
          <h3 className="mt-8">Comments</h3>
          <Separator></Separator>
        </>
      )}
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-bold">{comment.user.name}</span>
            <span>{comment.content}</span>
          </div>
          {userId && comment.userId === userId && (
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
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Delete this comment?</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleDelete(comment.id);
                    }}
                  >
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
