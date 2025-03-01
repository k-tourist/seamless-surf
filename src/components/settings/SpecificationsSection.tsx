
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export function SpecificationsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">System Specifications</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Project Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[150px] pr-4">
            <ul className="list-disc pl-6 space-y-2">
              <li>Projects are stored in Supabase database with text content, settings, and generated headlines</li>
              <li>Each project maintains its own history of generated headlines</li>
              <li>Headlines can be saved, liked, or disliked per project</li>
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Model Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Model Settings Structure</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>AI model settings are stored in the system_settings table with key "default_ai_model"</li>
                  <li>The value column MUST be a JSON object with a "model" property of type string</li>
                  <li>Example valid value: {'{\"model\": \"claude-3-opus-20240229\"}'}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Type Safety Requirements</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All model settings must be explicitly typed and verified</li>
                  <li>Type guards must be used to ensure database values match expected structure</li>
                  <li>Model values must be converted to strings before use in settings</li>
                  <li>Default values should be provided when model settings are missing</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Model Loading Process</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>First check localStorage for cached settings</li>
                  <li>Then load model settings from database</li>
                  <li>Verify model settings have correct structure</li>
                  <li>Convert model value to string explicitly</li>
                  <li>Update settings state with verified model value</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Supported Models</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Claude 3 Opus (claude-3-opus-20240229)</li>
                  <li>Claude 3 Sonnet (claude-3-sonnet-20240229)</li>
                  <li>Claude 3 Haiku (claude-3-haiku-20240229)</li>
                </ul>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generation Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] pr-4">
            <ol className="list-decimal pl-6 space-y-2">
              <li>User inputs content (via URL or direct text)</li>
              <li>Selects generation settings</li>
              <li>Clicks generate, which:
                <ul className="list-disc pl-6 mt-2">
                  <li>Retrieves active master prompt</li>
                  <li>Gets selected style prompt</li>
                  <li>Combines them with user settings</li>
                  <li>Sends to Claude via edge function</li>
                  <li>Returns structured headlines</li>
                </ul>
              </li>
              <li>Headlines are displayed and can be interacted with</li>
              <li>All headlines are saved to the project history</li>
            </ol>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Technical Components</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Edge Function (generate-with-claude)</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Receives content and settings</li>
                  <li>Fetches master and style prompts</li>
                  <li>Constructs the complete prompt</li>
                  <li>Makes API call to Anthropic</li>
                  <li>Processes and returns formatted headlines</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">State Management</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Project state manages content and settings</li>
                  <li>Headline state handles generated headlines and interactions</li>
                  <li>All state is persisted to Supabase in real-time</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Integration Points</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Anthropic API for Claude models</li>
                  <li>Supabase for data storage and edge functions</li>
                  <li>Style prompts for customization</li>
                  <li>Master prompts for core generation logic</li>
                </ul>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Developer Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Important Type Safety Notes</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Always use TypeScript type guards when handling database values</li>
                  <li>Convert model names to strings explicitly before use</li>
                  <li>Validate JSON structures match expected interfaces</li>
                  <li>Provide default values when data is missing or invalid</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Key Points</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Do not use RLS in the application design</li>
                  <li>Put all the permission and security settings in the edge functions</li>
                  <li>Error handling should guide users to understand and resolve issues</li>
                </ul>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
