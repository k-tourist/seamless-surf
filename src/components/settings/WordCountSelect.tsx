
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WordCountSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const WordCountSelect = ({ value, onChange }: WordCountSelectProps) => {
  const wordCounts = Array.from({ length: 13 }, (_, i) => (i + 3).toString());

  return (
    <div className="space-y-2">
      <Label htmlFor="wordCount">Max Word Count</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="wordCount">
          <SelectValue placeholder="Select max word count" />
        </SelectTrigger>
        <SelectContent>
          {wordCounts.map((count) => (
            <SelectItem key={count} value={count}>
              Max {count} words
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default WordCountSelect;
