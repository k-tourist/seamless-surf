
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Settings, Headline } from "@/types";
import { Json } from "@/integrations/supabase/types";

export const useProjectManagement = (session: Session | null) => {
  const { toast } = useToast();

  const createProject = async (
    name: string = 'Untitled Project',
    text: string | null = null,
    url: string | null = null,
    headlines: Headline[] = [],
    settings: Settings | null = null
  ) => {
    if (!session?.user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a project",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data: newProject, error: insertError } = await supabase
        .from('projects')
        .insert({
          name,
          text,
          url,
          user_id: session.user.id,
          headlines: headlines as unknown as Json,
          settings: settings as unknown as Json
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating project:', insertError);
        toast({
          title: "Error",
          description: "Failed to create project",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Success",
        description: "Project created successfully",
      });

      return newProject;
    } catch (error) {
      console.error('Error in createProject:', error);
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateProject = async (
    projectId: string,
    updates: {
      name?: string;
      text?: string | null;
      url?: string | null;
      headlines?: Headline[];
      settings?: Settings;
    }
  ) => {
    if (!session?.user) {
      toast({
        title: "Error",
        description: "You must be logged in to update a project",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data: updatedProject, error: updateError } = await supabase
        .from('projects')
        .update({
          ...updates,
          headlines: updates.headlines as unknown as Json,
          settings: updates.settings as unknown as Json
        })
        .eq('id', projectId)
        .eq('user_id', session.user.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating project:', updateError);
        toast({
          title: "Error",
          description: "Failed to update project",
          variant: "destructive",
        });
        return null;
      }

      return updatedProject;
    } catch (error) {
      console.error('Error in updateProject:', error);
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
      return null;
    }
  };

  return { createProject, updateProject };
};
