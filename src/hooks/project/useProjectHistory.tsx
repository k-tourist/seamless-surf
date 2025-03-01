
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { Headline } from "@/types";

interface ProjectHistory {
  id: string;
  name: string;
  text?: string;
  url?: string;
  timestamp: Date;
  headlines?: Headline[];
  savedHeadlineCount?: number;
}

const validateHeadline = (headline: Json): Headline | null => {
  if (typeof headline !== 'object' || !headline) return null;
  const obj = headline as any;
  return obj.text && typeof obj.text === 'string' && typeof obj.interactions === 'object'
    ? {
        text: obj.text,
        interactions: {
          saved: !!obj.interactions.saved,
          thumbsUp: !!obj.interactions.thumbsUp,
          thumbsDown: !!obj.interactions.thumbsDown
        }
      }
    : null;
};

export const useProjectHistory = (userId: string | undefined) => {
  const [queryHistory, setQueryHistory] = useState<ProjectHistory[]>([]);
  const [headlineCounts, setHeadlineCounts] = useState<Record<string, number>>({});

  // Fetch saved headline count for a specific project
  const fetchSavedHeadlineCount = async (projectId: string) => {
    try {
      const { data } = await supabase
        .from('projects')
        .select('headlines')
        .eq('id', projectId)
        .single();
      
      if (data?.headlines) {
        const savedCount = (data.headlines as Json[])
          .map(validateHeadline)
          .filter((h): h is Headline => h !== null)
          .filter(h => h.interactions.saved)
          .length;

        setHeadlineCounts(prev => ({
          ...prev,
          [projectId]: savedCount
        }));

        return savedCount;
      }
      return 0;
    } catch (error) {
      console.error('Error fetching headline count:', error);
      return 0;
    }
  };

  // Load initial project history
  useEffect(() => {
    const loadProjects = async () => {
      if (!userId) return;

      try {
        const { data } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });

        if (!data) return;

        const projects = await Promise.all(data.map(async project => {
          const savedCount = await fetchSavedHeadlineCount(project.id);
          
          return {
            id: project.id,
            name: project.name,
            text: project.text,
            url: project.url,
            timestamp: new Date(project.created_at),
            savedHeadlineCount: savedCount
          };
        }));

        setQueryHistory(projects);
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    };

    loadProjects();
  }, [userId]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('headline-counts')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'projects',
          filter: `user_id=eq.${userId}`
        },
        async (payload) => {
          const projectId = payload.new.id;
          if (!projectId) return;

          // Update the count for this specific project
          const newCount = await fetchSavedHeadlineCount(projectId);
          
          setQueryHistory(prev => prev.map(project => 
            project.id === projectId
              ? { ...project, savedHeadlineCount: newCount }
              : project
          ));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { queryHistory, setQueryHistory, headlineCounts };
};
