import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const BackToDashboard = () => {
  return (
    <div className="mb-6">
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="gap-2 text-muted-foreground hover:text-foreground"
      >
        <Link to="/">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
    </div>
  );
};

export default BackToDashboard;