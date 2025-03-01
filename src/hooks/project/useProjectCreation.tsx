
import { useToast } from "@/hooks/use-toast";
import { useProjectOperations } from "../useProjectOperations";
import { Session } from "@supabase/supabase-js";

export const useProjectCreation = (
  session: Session | null,
  setCurrentProjectId: (id: string | null) => void,
  setIsNewProject: (isNew: boolean) => void,
  resetState: () => void,
  setQueryHistory: (fn: (prev: any[]) => any[]) => void
) => {
  const { toast } = useToast();
  const { createProject } = useProjectOperations(session);

  const handleNewProject = async () => {
    resetState();
    const timestamp = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    const projectName = `Project ${timestamp}`;
    
    const newProject = await createProject(null, null, [], null, projectName);
    if (newProject) {
      setCurrentProjectId(newProject.id);
      setIsNewProject(true);
      
      // Update query history immediately
      setQueryHistory(prev => [{
        id: newProject.id,
        name: projectName,
        timestamp: new Date(newProject.created_at),
        headlines: []
      }, ...prev]);
      
      toast({
        title: "New Project",
        description: `Created "${projectName}"`,
      });
    }
  };

  return { handleNewProject };
};
