
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ToneSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const ToneSelect = ({ value, onChange }: ToneSelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="tone">Tone</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="tone">
          <SelectValue placeholder="Select tone" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="provocative">Provocative</SelectItem>
          <SelectItem value="professional">Professional</SelectItem>
          <SelectItem value="casual">Casual</SelectItem>
          <SelectItem value="humorous">Humorous</SelectItem>
          <SelectItem value="inquisitive">Inquisitive</SelectItem>
          <SelectItem value="direct-question">Direct Question</SelectItem>
          <SelectItem value="accusatory">Accusatory</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ToneSelect;
