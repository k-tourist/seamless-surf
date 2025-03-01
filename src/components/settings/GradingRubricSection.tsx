
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const GradingRubricSection = () => {
  const [rubricPrompt, setRubricPrompt] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadRubric = async () => {
      try {
        const { data, error } = await supabase
          .from('system_settings')
          .select('value')
          .eq('key', 'grading_rubric_settings')
          .single();
        
        if (error) {
          console.error('Error loading grading rubric:', error);
          return;
        }
        
        if (data?.value) {
          const settings = data.value as { prompt: string };
          setRubricPrompt(settings.prompt || '');
        }
      } catch (error) {
        console.error('Error loading grading rubric:', error);
      }
    };
    loadRubric();
  }, []);

  const handleSaveRubric = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          key: 'grading_rubric_settings',
          value: {
            prompt: rubricPrompt
          }
        }, {
          onConflict: 'key'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Grading rubric saved successfully",
      });
    } catch (error) {
      console.error('Error saving grading rubric:', error);
      toast({
        title: "Error",
        description: "Failed to save grading rubric",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Grading Rubric</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Define the prompt that will be used to grade headlines. This prompt should specify the criteria and methodology for evaluating headline quality.
          </p>
          <Textarea
            value={rubricPrompt}
            onChange={(e) => setRubricPrompt(e.target.value)}
            placeholder="Enter your grading rubric prompt..."
            className="min-h-[200px] font-mono text-sm"
          />
        </div>
        <Button onClick={handleSaveRubric} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Rubric'
          )}
        </Button>
      </div>
    </div>
  );
};
