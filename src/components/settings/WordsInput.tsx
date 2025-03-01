import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface WordsInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const WordsInput = ({ id, label, value, onChange, placeholder }: WordsInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};

export default WordsInput;