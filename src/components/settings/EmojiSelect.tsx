
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import QuestionMarkIcon from "../icons/QuestionMarkIcon";

interface EmojiSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const EmojiSelect = ({ value, onChange }: EmojiSelectProps) => {
  // Custom renderer for the select value
  const renderValue = (value: string) => {
    if (value === "❔") {
      return (
        <span className="inline-flex items-center">
          <QuestionMarkIcon size={20} className="mr-1" />
        </span>
      );
    }
    return value === "no" ? "No Emoji" : `${value} ${getEmojiLabel(value)}`;
  };

  // Helper function to get emoji labels
  const getEmojiLabel = (value: string) => {
    const labels: { [key: string]: string } = {
      "✨": "Sparkles",
      "🔥": "Fire",
      "⚡": "Lightning",
      "💡": "Idea",
      "🎯": "Target",
      "🚀": "Rocket",
      "📢": "Announcement",
      "🎉": "Celebration",
      "⭐": "Star",
      "❔": "Question",
      "💚": "Green Heart",
      "💰": "Money Bag",
    };
    return labels[value] || "";
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="useEmoji">Use Emoji</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="useEmoji">
          <SelectValue placeholder="Select emoji usage">
            {value && renderValue(value)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="no">No Emoji</SelectItem>
          <SelectItem value="✨">✨ Sparkles</SelectItem>
          <SelectItem value="🔥">🔥 Fire</SelectItem>
          <SelectItem value="⚡">⚡ Lightning</SelectItem>
          <SelectItem value="💡">💡 Idea</SelectItem>
          <SelectItem value="🎯">🎯 Target</SelectItem>
          <SelectItem value="🚀">🚀 Rocket</SelectItem>
          <SelectItem value="📢">📢 Announcement</SelectItem>
          <SelectItem value="🎉">🎉 Celebration</SelectItem>
          <SelectItem value="⭐">⭐ Star</SelectItem>
          <SelectItem value="💚">💚 Green Heart</SelectItem>
          <SelectItem value="💰">💰 Money Bag</SelectItem>
          <SelectItem value="❔">
            <span className="inline-flex items-center">
              <QuestionMarkIcon size={20} className="mr-1" /> Question
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default EmojiSelect;
