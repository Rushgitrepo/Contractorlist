import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/Subcontractor dashboard/contexts/AuthContext";
import { toast } from "sonner";

export interface PinComment {
  id: string;
  pin_id: string;
  project_id: string;
  author_id: string;
  parent_id: string | null;
  content: string;
  mentions: string[];
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  };
  replies?: PinComment[];
}

export function usePinComments(pinId: string | undefined) {
  return useQuery({
    queryKey: ["pin-comments", pinId],
    queryFn: async () => {
      if (!pinId) return [];

      const { data, error } = await supabase
        .from("pin_comments")
        .select(`
          *,
          author:profiles!pin_comments_author_id_fkey(id, full_name, email, avatar_url)
        `)
        .eq("pin_id", pinId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Organize into threads (top-level comments with nested replies)
      const comments = data as PinComment[];
      const topLevel: PinComment[] = [];
      const repliesMap: Record<string, PinComment[]> = {};

      comments.forEach((comment) => {
        if (comment.parent_id) {
          if (!repliesMap[comment.parent_id]) {
            repliesMap[comment.parent_id] = [];
          }
          repliesMap[comment.parent_id].push(comment);
        } else {
          topLevel.push(comment);
        }
      });

      // Attach replies to their parent comments
      topLevel.forEach((comment) => {
        comment.replies = repliesMap[comment.id] || [];
      });

      return topLevel;
    },
    enabled: !!pinId,
  });
}

export function useCreatePinComment(pinId: string, projectId: string) {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async ({
      content,
      parentId,
      mentions,
    }: {
      content: string;
      parentId?: string;
      mentions?: string[];
    }) => {
      if (!profile?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("pin_comments")
        .insert({
          pin_id: pinId,
          project_id: projectId,
          author_id: profile.id,
          parent_id: parentId || null,
          content,
          mentions: mentions || [],
        })
        .select(`
          *,
          author:profiles!pin_comments_author_id_fkey(id, full_name, email, avatar_url)
        `)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pin-comments", pinId] });
    },
    onError: (error) => {
      console.error("Error creating comment:", error);
      toast.error("Failed to post comment");
    },
  });
}

export function useUpdatePinComment(pinId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      commentId,
      content,
      mentions,
    }: {
      commentId: string;
      content: string;
      mentions?: string[];
    }) => {
      const { error } = await supabase
        .from("pin_comments")
        .update({
          content,
          mentions: mentions || [],
        })
        .eq("id", commentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pin-comments", pinId] });
      toast.success("Comment updated");
    },
    onError: (error) => {
      console.error("Error updating comment:", error);
      toast.error("Failed to update comment");
    },
  });
}

export function useDeletePinComment(pinId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from("pin_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pin-comments", pinId] });
      toast.success("Comment deleted");
    },
    onError: (error) => {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    },
  });
}

// Helper to parse @mentions from text
export function parseMentions(
  text: string,
  teamMembers: Array<{ user_id: string; profile?: { full_name?: string | null; email?: string } }>
): string[] {
  const mentionRegex = /@(\w+(?:\s+\w+)?)/g;
  const mentions: string[] = [];
  let match;

  while ((match = mentionRegex.exec(text)) !== null) {
    const mentionName = match[1].toLowerCase();
    const member = teamMembers.find((m) => {
      const fullName = m.profile?.full_name?.toLowerCase();
      const email = m.profile?.email?.toLowerCase().split("@")[0];
      return fullName?.includes(mentionName) || email?.includes(mentionName);
    });
    if (member && !mentions.includes(member.user_id)) {
      mentions.push(member.user_id);
    }
  }

  return mentions;
}
