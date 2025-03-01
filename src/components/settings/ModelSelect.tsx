import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ModelSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const ModelSelect = ({ value, onChange }: ModelSelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="model">Model</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="model">
          <SelectValue placeholder="Select model" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="creative">Creative</SelectItem>
          <SelectItem value="professional">Professional</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ModelSelect;