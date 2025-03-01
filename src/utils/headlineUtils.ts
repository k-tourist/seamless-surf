
import { Headline } from "@/types";
import { Json } from "@/integrations/supabase/types";

export interface HeadlineDTO {
  text: string;
  interactions: {
    saved: boolean;
    thumbsUp: boolean;
    thumbsDown: boolean;
  };
}

export const toHeadlineDTO = (headline: Headline): Json => ({
  text: headline.text,
  interactions: {
    saved: headline.interactions.saved,
    thumbsUp: headline.interactions.thumbsUp,
    thumbsDown: headline.interactions.thumbsDown
  }
});

export const fromHeadlineDTO = (data: Json): Headline | null => {
  if (
    typeof data === 'object' && 
    data !== null && 
    'text' in data && 
    typeof data.text === 'string' &&
    'interactions' in data &&
    typeof data.interactions === 'object' &&
    data.interactions !== null
  ) {
    const interactions = data.interactions as any;
    return {
      text: data.text,
      interactions: {
        saved: Boolean(interactions.saved),
        thumbsUp: Boolean(interactions.thumbsUp),
        thumbsDown: Boolean(interactions.thumbsDown)
      }
    };
  }
  return null;
};
