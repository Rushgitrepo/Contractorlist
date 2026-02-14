import { useState, useRef, useEffect } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Subcontractor dashboard/ui/avatar";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Textarea } from "@/components/Subcontractor dashboard/ui/textarea";
import { ScrollArea } from "@/components/Subcontractor dashboard/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/Subcontractor dashboard/ui/dropdown-menu";
import {
  MessageCircle,
  Send,
  Reply,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  AtSign,
} from "lucide-react";
import {
  usePinComments,
  useCreatePinComment,
  useUpdatePinComment,
  useDeletePinComment,
  PinComment,
  parseMentions,
} from "@/hooks/Subcontractor dashboard/usePinComments";
import { useTeamMembers } from "@/hooks/Subcontractor dashboard/useTeamMembers";
import { useAuth } from "@/context/Subcontractor dashboard/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface PinCommentsSectionProps {
  pinId: string;
  projectId: string;
}

export default function PinCommentsSection({
  pinId,
  projectId,
}: PinCommentsSectionProps) {
  const { data: comments, isLoading } = usePinComments(pinId);
  const { data: teamMembers } = useTeamMembers(projectId);
  const createComment = useCreatePinComment(pinId, projectId);
  const { profile } = useAuth();

  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (parentId?: string) => {
    const content = newComment.trim();
    if (!content) return;

    const mentions = parseMentions(content, teamMembers || []);

    await createComment.mutateAsync({
      content,
      parentId,
      mentions,
    });

    setNewComment("");
    setReplyingTo(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit(replyingTo || undefined);
    }
  };

  const handleTextChange = (value: string) => {
    setNewComment(value);

    // Check for @mention trigger
    const cursorPos = textareaRef.current?.selectionStart || 0;
    const textBeforeCursor = value.slice(0, cursorPos);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      setShowMentions(true);
      setMentionQuery(mentionMatch[1].toLowerCase());
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (name: string) => {
    const cursorPos = textareaRef.current?.selectionStart || 0;
    const textBeforeCursor = newComment.slice(0, cursorPos);
    const textAfterCursor = newComment.slice(cursorPos);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      const newText =
        textBeforeCursor.slice(0, -mentionMatch[0].length) +
        `@${name} ` +
        textAfterCursor;
      setNewComment(newText);
    }
    setShowMentions(false);
    textareaRef.current?.focus();
  };

  const filteredMembers = teamMembers?.filter((m) => {
    if (!mentionQuery) return true;
    const name = m.profile?.full_name?.toLowerCase() || "";
    const email = m.profile?.email?.toLowerCase() || "";
    return name.includes(mentionQuery) || email.includes(mentionQuery);
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-2 border-b">
        <MessageCircle className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">
          Comments ({comments?.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0) || 0})
        </span>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {comments?.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No comments yet. Start the conversation!
            </p>
          ) : (
            comments?.map((comment) => (
              <CommentThread
                key={comment.id}
                comment={comment}
                pinId={pinId}
                projectId={projectId}
                currentUserId={profile?.id}
                onReply={() => {
                  setReplyingTo(comment.id);
                  textareaRef.current?.focus();
                }}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Comment input */}
      <div className="p-4 border-t space-y-2">
        {replyingTo && (
          <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            <span>Replying to comment...</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 px-1"
              onClick={() => setReplyingTo(null)}
            >
              Cancel
            </Button>
          </div>
        )}

        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={newComment}
            onChange={(e) => handleTextChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a comment... (@ to mention)"
            className="min-h-[60px] pr-10 resize-none"
            rows={2}
          />
          <Button
            size="sm"
            variant="ghost"
            className="absolute right-1 bottom-1 h-8 w-8 p-0"
            onClick={() => handleSubmit(replyingTo || undefined)}
            disabled={!newComment.trim() || createComment.isPending}
          >
            {createComment.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>

          {/* Mention dropdown */}
          {showMentions && filteredMembers && filteredMembers.length > 0 && (
            <div className="absolute bottom-full left-0 mb-1 w-full bg-popover border rounded-md shadow-md z-50 max-h-40 overflow-auto">
              {filteredMembers.slice(0, 5).map((member) => (
                <button
                  key={member.user_id}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"
                  onClick={() =>
                    insertMention(
                      member.profile?.full_name?.split(" ")[0] ||
                        member.profile?.email?.split("@")[0] ||
                        "user"
                    )
                  }
                >
                  <AtSign className="w-3 h-3 text-muted-foreground" />
                  <span>{member.profile?.full_name || member.profile?.email}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Press ⌘+Enter to send
        </p>
      </div>
    </div>
  );
}

interface CommentThreadProps {
  comment: PinComment;
  pinId: string;
  projectId: string;
  currentUserId?: string;
  onReply: () => void;
  isReply?: boolean;
}

function CommentThread({
  comment,
  pinId,
  projectId,
  currentUserId,
  onReply,
  isReply = false,
}: CommentThreadProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const updateComment = useUpdatePinComment(pinId);
  const deleteComment = useDeletePinComment(pinId);

  const isAuthor = currentUserId === comment.author_id;
  const authorName =
    comment.author?.full_name ||
    comment.author?.email?.split("@")[0] ||
    "Unknown";
  const initials = authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;
    await updateComment.mutateAsync({
      commentId: comment.id,
      content: editContent,
    });
    setIsEditing(false);
  };

  // Render content with highlighted @mentions
  const renderContent = (text: string) => {
    const parts = text.split(/(@\w+(?:\s+\w+)?)/g);
    return parts.map((part, i) => {
      if (part.startsWith("@")) {
        return (
          <span key={i} className="text-primary font-medium">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className={cn("space-y-3", isReply && "ml-8 pl-3 border-l-2")}>
      <div className="flex gap-3">
        <Avatar className="w-8 h-8 shrink-0">
          <AvatarImage src={comment.author?.avatar_url || undefined} />
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium truncate">{authorName}</span>
            <span
              className="text-xs text-muted-foreground"
              title={format(new Date(comment.created_at), "PPpp")}
            >
              {formatDistanceToNow(new Date(comment.created_at), {
                addSuffix: true,
              })}
            </span>
            {comment.updated_at !== comment.created_at && (
              <span className="text-xs text-muted-foreground">(edited)</span>
            )}
          </div>

          {isEditing ? (
            <div className="mt-1 space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[60px]"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={updateComment.isPending}
                >
                  {updateComment.isPending && (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  )}
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm mt-1 whitespace-pre-wrap">
              {renderContent(comment.content)}
            </p>
          )}

          {!isEditing && (
            <div className="flex items-center gap-1 mt-2">
              {!isReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={onReply}
                >
                  <Reply className="w-3 h-3 mr-1" />
                  Reply
                </Button>
              )}

              {isAuthor && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => deleteComment.mutate(comment.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies?.map((reply) => (
        <CommentThread
          key={reply.id}
          comment={reply}
          pinId={pinId}
          projectId={projectId}
          currentUserId={currentUserId}
          onReply={onReply}
          isReply
        />
      ))}
    </div>
  );
}
