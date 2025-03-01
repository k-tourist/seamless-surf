
import { useState } from "react";
import { useStylePrompts } from "@/hooks/useStylePrompts";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StylePromptForm } from "./stylePrompts/StylePromptForm";
import { StylePromptItem } from "./stylePrompts/StylePromptItem";
import { StylePromptFormData } from "@/types/stylePrompts";

export const StylePromptsSection = () => {
  const { stylePrompts, isLoading, updateStylePrompt, addStylePrompt, deleteStylePrompt } = useStylePrompts();
  const { session, isAdmin } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<StylePromptFormData>({ name: "", prompt: "" });
  const [isCreating, setIsCreating] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to check if user can edit a specific prompt
  const canEditPrompt = (prompt: { is_global: boolean; user_id: string | null }) => {
    if (!session?.user?.id) return false;
    if (isAdmin) return true;
    return !prompt.is_global && prompt.user_id === session.user.id;
  };

  const handleEdit = async (id: string, data: StylePromptFormData) => {
    setIsSubmitting(true);
    try {
      await updateStylePrompt({ id, ...data });
      setEditingId(null);
      setEditForm({ name: "", prompt: "" });
    } catch (error) {
      console.error("Error saving prompt:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditForm({ name: "", prompt: "" });
  };

  const handleSubmitNew = async () => {
    setIsSubmitting(true);
    try {
      await addStylePrompt(editForm);
      setIsCreating(false);
      setEditForm({ name: "", prompt: "" });
    } catch (error) {
      console.error("Error creating prompt:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (promptToDelete) {
      try {
        await deleteStylePrompt(promptToDelete);
        setPromptToDelete(null);
      } catch (error) {
        console.error("Error deleting prompt:", error);
      }
    }
  };

  // Separate custom and global prompts
  const customPrompts = stylePrompts?.filter(prompt => !prompt.is_global) || [];
  const globalPrompts = stylePrompts?.filter(prompt => prompt.is_global) || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Style Prompts</h2>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Prompt
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {isCreating && (
            <div className="p-4 border rounded-lg bg-card">
              <StylePromptForm
                formData={editForm}
                onFormChange={setEditForm}
                onSubmit={handleSubmitNew}
                onCancel={() => {
                  setIsCreating(false);
                  setEditForm({ name: "", prompt: "" });
                }}
                isSubmitting={isSubmitting}
                submitLabel="Create"
              />
            </div>
          )}

          {/* Custom Prompts Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-muted-foreground">Custom Style Prompts</h3>
            {customPrompts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No custom prompts available.</p>
            ) : (
              customPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="p-4 border rounded-lg space-y-2 bg-card"
                >
                  <StylePromptItem
                    prompt={prompt}
                    canEdit={canEditPrompt(prompt)}
                    onEdit={handleEdit}
                    onDelete={(id) => setPromptToDelete(id)}
                    isEditing={editingId === prompt.id}
                    editingForm={editForm}
                    onEditingFormChange={(data) => {
                      setEditForm(data);
                      setEditingId(prompt.id);
                    }}
                    isSubmitting={isSubmitting}
                  />
                </div>
              ))
            )}
          </div>

          {/* Global Prompts Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-muted-foreground">Global Style Prompts</h3>
            {globalPrompts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No global prompts available.</p>
            ) : (
              globalPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="p-4 border rounded-lg space-y-2 bg-card"
                >
                  <StylePromptItem
                    prompt={prompt}
                    canEdit={canEditPrompt(prompt)}
                    onEdit={handleEdit}
                    onDelete={(id) => setPromptToDelete(id)}
                    isEditing={editingId === prompt.id}
                    editingForm={editForm}
                    onEditingFormChange={(data) => {
                      setEditForm(data);
                      setEditingId(prompt.id);
                    }}
                    isSubmitting={isSubmitting}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <AlertDialog open={!!promptToDelete} onOpenChange={() => setPromptToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the prompt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
