
import { ApiKeySection } from "./ApiKeySection";

export const ConnectionsSection = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">API Connections</h2>
      </div>
      <div className="rounded-md border p-6">
        <ApiKeySection />
      </div>
    </div>
  );
};
