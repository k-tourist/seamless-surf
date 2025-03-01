
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Settings, Headline } from "@/types";

export const useProjectOperations = (session: Session | null) => {
  const createProject = async (
    text: string | null,
    url: string | null,
    headlines: Headline[] = [],
    settings: Settings | null = null,
    name: string | null = null
  ) => {
    if (!session?.user) return null;

    try {
      const { data: newProject, error } = await supabase
        .from('projects')
        .insert({
          text,
          url,
          name,
          user_id: session.user.id,
          headlines: headlines as any,
          settings: settings as any
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating project:', error);
        return null;
      }

      return newProject;
    } catch (error) {
      console.error('Error in createProject:', error);
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
    if (!session?.user) return null;

    try {
      const { data: updatedProject, error } = await supabase
        .from('projects')
        .update({
          ...updates,
          headlines: updates.headlines as any,
          settings: updates.settings as any
        })
        .eq('id', projectId)
        .eq('user_id', session.user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating project:', error);
        return null;
      }

      return updatedProject;
    } catch (error) {
      console.error('Error in updateProject:', error);
      return null;
    }
  };

  return { createProject, updateProject };
};

