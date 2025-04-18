"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { getComments, createComment } from "@/actions/comment.actions";
import { toast } from "sonner";
import { Separator } from "./ui/separator";

type Comments = Awaited<ReturnType<typeof getComments>>;
type Comment = Comments[number];

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
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      const result = await getComments(articleId);
      setComments(result);
    };

    fetchComments();
  }, []);

  const handleCommentSubmit = async () => {
    if (isCommenting || !newComment.trim() || !userId || !articleId) return;

    try {
      setIsCommenting(true);
      const result = await createComment(articleId, userId, newComment.trim());
      if (result.success) {
        toast.success("Comment posted successfully");

        if (result.data) {
          const newCommentData: Comment = {
            ...result.data,
            user: { name: userName ?? null },
          };
          setComments((prev) => {
            return [...prev, newCommentData];
          });
        }
        setNewComment("");
      }
      setIsCommenting(false);
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <div className="bg-background rounded-md flex flex-col p-4 gap-4">
      {userId && (
        <div className="flex items-end gap-4">
          <Textarea
            placeholder="Type your comment here..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></Textarea>
          <Button
            variant="secondary"
            onClick={handleCommentSubmit}
            disabled={!newComment.trim() || isCommenting}
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
        <div key={comment.id} className="flex flex-col">
          <span className="font-bold">{comment.user.name}</span>
          <span>{comment.content}</span>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
