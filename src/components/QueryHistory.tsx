import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Settings, Headline } from "@/types";
import { Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";

interface QueryHistoryProps {
  queries: Array<{
    id: string;
    name: string;
    text?: string;
    url?: string;
    timestamp: Date;
    headlines?: Headline[];
    savedHeadlineCount?: number;
  }>;
  onProjectSelect: (projectId: string) => void;
  currentProjectId: string | null;
}

const QueryHistory = ({ queries = [], onProjectSelect, currentProjectId }: QueryHistoryProps) => {
  const { session } = useAuth();
  const { toast } = useToast();

  const getProjectTitle = (query: QueryHistoryProps['queries'][0]) => {
    if (query.text?.trim()) {
      const textPreview = query.text.split('\n')[0] || query.text;
      return textPreview.slice(0, 25) + (textPreview.length > 25 ? '...' : '');
    }
    if (query.url?.trim()) {
      try {
        const urlObj = new URL(query.url);
        const hostname = urlObj.hostname.replace('www.', '');
        return hostname.length > 25 ? hostname.slice(0, 25) + '...' : hostname;
      } catch {
        return query.url.slice(0, 25) + (query.url.length > 25 ? '...' : '');
      }
    }
    return query.name && query.name.length > 25 ? query.name.slice(0, 25) + '...' : (query.name || 'Untitled Project');
  };

  const handleDeleteProject = async (projectId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (!session?.access_token) {
      toast({
        title: "Error",
        description: "You must be logged in to delete projects",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .functions.invoke('delete-project', {
          body: { projectId },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          }
        });

      if (error) throw error;

      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted",
      });

      window.location.reload();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const clearHistory = async () => {
    if (!session?.access_token) {
      toast({
        title: "Error",
        description: "You must be logged in to clear history",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .functions.invoke('delete-all-projects', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          }
        });

      if (error) throw error;

      toast({
        title: "History cleared",
        description: "Your project history has been cleared successfully",
      });

      window.location.reload();
    } catch (error) {
      console.error('Error clearing history:', error);
      toast({
        title: "Error",
        description: "Failed to clear project history",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[calc(100vh-240px)]">
        <div className="space-y-2">
          {queries && queries.length > 0 ? (
            <>
              {queries.map((query) => (
                <Button
                  key={query.id}
                  variant="ghost"
                  className={`w-full h-auto p-3 relative group ${
                    currentProjectId === query.id
                      ? 'bg-[#fffef0] hover:bg-[#fffef0] border border-[#f0efd9] dark:bg-gray-800 dark:hover:bg-gray-800 dark:border-gray-700 dark:text-gray-100'
                      : 'bg-gray-50 hover:bg-accent dark:bg-gray-900 dark:hover:bg-accent'
                  }`}
                  onClick={() => {
                    if (query.id) {
                      console.log("Selecting project with ID:", query.id);
                      onProjectSelect(query.id);
                    }
                  }}
                >
                  <div className="w-full text-left">
                    <p className="font-medium line-clamp-2">{getProjectTitle(query)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {query.timestamp.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {query.savedHeadlineCount || 0} saved headlines
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleDeleteProject(query.id, e)}
                  >
                    <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </Button>
              ))}
              <Button
                variant="ghost"
                className="w-full h-auto p-3 bg-gray-50 hover:bg-accent dark:bg-gray-900 dark:hover:bg-accent"
                onClick={clearHistory}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear History
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center p-4">
              No projects yet
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default QueryHistory;
