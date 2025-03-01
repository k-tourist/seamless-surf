
import { useState, useEffect, useCallback, useRef } from 'react';
import { Headline } from "@/types";

interface UseHeadlineSyncProps {
  initialHeadlines: Headline[];
  projectId: string | null;
  onSave: (headlines: Headline[]) => Promise<void>;
}

export const useHeadlineSync = ({ initialHeadlines, projectId, onSave }: UseHeadlineSyncProps) => {
  const [headlines, setHeadlines] = useState<Headline[]>(initialHeadlines);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const isMounted = useRef(true);
  const lastProjectId = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (projectId !== lastProjectId.current) {
      console.log('Project changed, resetting state:', { from: lastProjectId.current, to: projectId });
      setHeadlines([]);
      lastProjectId.current = projectId;
    }
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;

    const newHeadlines = initialHeadlines.map(headline => ({
      ...headline,
      interactions: {
        saved: false,
        thumbsUp: false,
        thumbsDown: false,
        ...headline.interactions
      }
    }));

    console.log('Syncing with parent state:', { projectId, newHeadlines });
    if (isMounted.current) {
      setHeadlines(prevHeadlines => {
        if (newHeadlines.length === 0) return prevHeadlines;
        
        return newHeadlines.map(newHeadline => {
          const existingHeadline = prevHeadlines.find(h => h.text === newHeadline.text);
          return existingHeadline || newHeadline;
        });
      });
    }
  }, [initialHeadlines, projectId]);

  const debouncedSave = useCallback((headlinesToSave: Headline[]) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    return new Promise<void>((resolve, reject) => {
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          await onSave(headlinesToSave);
          resolve();
        } catch (error) {
          reject(error);
        }
      }, 1000);
    });
  }, [onSave]);

  return {
    headlines,
    setHeadlines,
    debouncedSave,
    isMounted
  };
};
