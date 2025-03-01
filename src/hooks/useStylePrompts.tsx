
import { useAuth } from "@/components/AuthProvider";
import { StylePromptHookReturn } from "@/types/stylePrompts";
import { useStylePromptsQuery } from "./stylePrompts/useStylePromptsQuery";
import { useStylePromptMutation } from "./stylePrompts/useStylePromptMutation";

export const useStylePrompts = (): StylePromptHookReturn => {
  const { session, isAdmin } = useAuth();
  const { data: stylePrompts, isLoading } = useStylePromptsQuery(session?.user?.id);
  
  const addMutation = useStylePromptMutation('add');
  const updateMutation = useStylePromptMutation('update');
  const deleteMutation = useStylePromptMutation('delete');

  return {
    stylePrompts,
    isLoading,
    isAdmin,
    addStylePrompt: (data: any) => {
      if (!session?.user?.id) {
        throw new Error("User must be logged in to add style prompts");
      }
      return addMutation.mutateAsync({ 
        ...data, 
        user_id: session.user.id,
        is_global: isAdmin ? (data.is_global || false) : false
      });
    },
    updateStylePrompt: (data: any) => {
      if (!session?.user?.id) {
        throw new Error("User must be logged in to update style prompts");
      }
      return updateMutation.mutateAsync({
        ...data,
        is_global: isAdmin ? (data.is_global || false) : false
      });
    },
    deleteStylePrompt: deleteMutation.mutateAsync,
  };
};
