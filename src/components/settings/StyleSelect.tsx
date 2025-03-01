
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStylePrompts } from "@/hooks/useStylePrompts";
import { Loader2 } from "lucide-react";

interface StyleSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const StyleSelect = ({ value, onChange }: StyleSelectProps) => {
  const { stylePrompts, isLoading } = useStylePrompts();

  return (
    <div className="space-y-2">
      <Label htmlFor="style">Style</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="style">
          <SelectValue placeholder="Select style" />
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-2">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            stylePrompts?.filter(prompt => prompt.category === 'style').map((prompt) => (
              <SelectItem key={prompt.id} value={prompt.name}>
                {prompt.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StyleSelect;
