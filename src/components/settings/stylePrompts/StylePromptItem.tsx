
import { StylePrompt } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, User, Pencil, Trash2 } from "lucide-react";
import { StylePromptForm } from "./StylePromptForm";
import { useState } from "react";
import { StylePromptFormData } from "@/types/stylePrompts";

interface StylePromptItemProps {
  prompt: StylePrompt;
  canEdit: boolean;
  onEdit: (id: string, data: StylePromptFormData) => Promise<void>;
  onDelete: (id: string) => void;
  isEditing: boolean;
  editingForm: StylePromptFormData;
  onEditingFormChange: (data: StylePromptFormData) => void;
  isSubmitting: boolean;
}

export const StylePromptItem = ({
  prompt,
  canEdit,
  onEdit,
  onDelete,
  isEditing,
  editingForm,
  onEditingFormChange,
  isSubmitting,
}: StylePromptItemProps) => {
  if (isEditing) {
    return (
      <StylePromptForm
        formData={editingForm}
        onFormChange={onEditingFormChange}
        onSubmit={() => onEdit(prompt.id, editingForm)}
        onCancel={() => onEditingFormChange({ name: "", prompt: "" })}
        isSubmitting={isSubmitting}
        submitLabel="Save"
      />
    );
  }

  return (
    <>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{prompt.name}</h3>
            <Badge variant={prompt.is_global ? "default" : "secondary"}>
              {prompt.is_global ? (
                <><Globe className="h-3 w-3 mr-1" /> Global</>
              ) : (
                <><User className="h-3 w-3 mr-1" /> Custom</>
              )}
            </Badge>
          </div>
        </div>
        {canEdit && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEditingFormChange({ name: prompt.name, prompt: prompt.prompt })}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(prompt.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground">{prompt.prompt}</p>
    </>
  );
};
