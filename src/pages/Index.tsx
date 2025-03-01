
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import HeadlineGenerator from "@/components/HeadlineGenerator";
import { useHeadlineGeneration } from "@/hooks/useHeadlineGeneration";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [searchParams] = useSearchParams();
  const { handleUrlSubmit, handleTextSubmit } = useHeadlineGeneration();
  const { toast } = useToast();

  useEffect(() => {
    const authenticateWithApiKey = async (apiKey: string) => {
      try {
        console.log("Attempting to authenticate with API key");
        
        // First, find the user profile with this API key
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("api_key", apiKey)
          .single();

        if (profileError || !profile) {
          console.error("Invalid API key");
          toast({
            title: "Authentication Error",
            description: "Invalid API key provided",
            variant: "destructive",
          });
          return;
        }

        // Sign in as the authenticated user using a custom token
        const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
          email: profile.id, // Using ID as the identifier
          password: apiKey, // Using API key as the password
        });
        
        if (signInError || !session) {
          console.error("Error signing in:", signInError);
          toast({
            title: "Authentication Error",
            description: "Failed to authenticate with provided API key",
            variant: "destructive",
          });
          return;
        }

        console.log("Successfully authenticated with API key");
      } catch (error) {
        console.error("Authentication error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred during authentication",
          variant: "destructive",
        });
      }
    };

    const processInput = async () => {
      const apiKey = searchParams.get('key');
      const urlParam = searchParams.get('url');
      const textParam = searchParams.get('text');

      if (apiKey) {
        await authenticateWithApiKey(apiKey);
      }

      if (urlParam) {
        await handleUrlSubmit(decodeURIComponent(urlParam));
      } else if (textParam) {
        handleTextSubmit(decodeURIComponent(textParam));
      }
    };

    processInput();
  }, [searchParams, handleUrlSubmit, handleTextSubmit, toast]);

  return <HeadlineGenerator />;
};

export default Index;
