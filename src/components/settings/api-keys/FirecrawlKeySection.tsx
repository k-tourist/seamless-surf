
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FirecrawlService } from '@/utils/FirecrawlService';

export const FirecrawlKeySection = () => {
  const { toast } = useToast();
  const [firecrawlKey, setFirecrawlKey] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadKey = async () => {
      try {
        const key = await FirecrawlService.getApiKey();
        if (key) {
          setSavedKey(key);
          setFirecrawlKey(key);
        }
      } catch (error) {
        console.error('Error loading Firecrawl API key:', error);
        toast({
          title: "Error",
          description: "Failed to load Firecrawl API key",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadKey();
  }, [toast]);

  const handleSaveFirecrawlKey = async () => {
    if (!firecrawlKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Firecrawl API key",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);
    try {
      const isValid = await FirecrawlService.testApiKey(firecrawlKey);
      if (isValid) {
        const saved = await FirecrawlService.setApiKey(firecrawlKey);
        if (saved) {
          setSavedKey(firecrawlKey);
          toast({
            title: "Success",
            description: "Firecrawl API key saved successfully",
          });
        } else {
          throw new Error("Failed to save API key");
        }
      } else {
        toast({
          title: "Error",
          description: "Invalid Firecrawl API key",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving Firecrawl API key:', error);
      toast({
        title: "Error",
        description: "Failed to save Firecrawl API key",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Firecrawl Configuration</h2>
      <div className="space-y-2">
        <Label htmlFor="firecrawlKey">Firecrawl API Key</Label>
        <div className="flex gap-2">
          <Input
            id="firecrawlKey"
            type="password"
            value={firecrawlKey}
            onChange={(e) => setFirecrawlKey(e.target.value)}
            placeholder={savedKey ? "••••••••" : "Enter your Firecrawl API key"}
          />
          <Button onClick={handleSaveFirecrawlKey} disabled={isTesting}>
            {isTesting ? "Testing..." : "Save Key"}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {savedKey ? "API key is saved and active" : "You can find your Firecrawl API key in the Firecrawl dashboard."}
        </p>
      </div>
    </div>
  );
};
