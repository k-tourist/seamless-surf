
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { StylePromptFormData } from "@/types/stylePrompts";

interface StylePromptFormProps {
  formData: StylePromptFormData;
  onFormChange: (data: StylePromptFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}

export const StylePromptForm = ({
  formData,
  onFormChange,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
}: StylePromptFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-1 block">Name</label>
        <Input
          value={formData.name}
          onChange={(e) =>
            onFormChange({ ...formData, name: e.target.value })
          }
          placeholder="Enter prompt name"
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">Prompt</label>
        <Textarea
          value={formData.prompt}
          onChange={(e) =>
            onFormChange({ ...formData, prompt: e.target.value })
          }
          placeholder="Enter prompt text"
          className="min-h-[100px]"
        />
      </div>
      <div className="flex space-x-2">
        <Button
          onClick={onSubmit}
          disabled={isSubmitting || !formData.name.trim() || !formData.prompt.trim()}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {submitLabel}...
            </>
          ) : (
            submitLabel
          )}
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
