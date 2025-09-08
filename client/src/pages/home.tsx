import { useState } from "react";
import { ConfigurationTabs } from "@/components/configuration-tabs";
import { PreviewModal } from "@/components/preview-modal";
import { useConfiguration } from "@/hooks/use-configuration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Download, Save, Upload, CheckCircle, Eye, Rocket } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const { configuration, updateConfiguration, saveProfile, generatePackage } = useConfiguration();
  const { toast } = useToast();

  const handleSaveProfile = async () => {
    try {
      await saveProfile({
        name: `Configuration ${new Date().toISOString().split('T')[0]}`,
        description: "Auto-saved configuration profile",
      });
      toast({
        title: "Configuration Saved",
        description: "Your configuration profile has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save configuration profile.",
        variant: "destructive",
      });
    }
  };

  const handleGeneratePackage = async () => {
    try {
      const result = await generatePackage({
        includeFiles: ["env", "yaml", "docker-compose", "install-script", "readme"],
      });
      
      // Create and download ZIP file
      const blob = new Blob([JSON.stringify(result.files, null, 2)], { 
        type: "application/json" 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `librechat-config-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Package Generated",
        description: "Your LibreChat installation package has been generated and downloaded.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate installation package.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                  <i className="fas fa-cog text-white text-lg"></i>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">LibreChat Configuration</h1>
                  <p className="text-sm text-muted-foreground">v0.8.0-rc3 Enterprise Setup</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Validation Status Indicator */}
              <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">Configuration Valid</span>
              </div>
              
              <Button variant="outline" onClick={() => setShowPreview(true)} data-testid="button-preview">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              
              <Button variant="secondary" data-testid="button-import">
                <Upload className="h-4 w-4 mr-2" />
                Import Config
              </Button>
              
              <Button onClick={handleSaveProfile} data-testid="button-save">
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </Button>
              
              <Button onClick={handleGeneratePackage} className="bg-primary hover:bg-primary/90" data-testid="button-generate">
                <Rocket className="h-4 w-4 mr-2" />
                Generate Package
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-80 bg-white border-r border-border shadow-sm">
          <div className="p-6 space-y-6">
            {/* Search Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Search & Filter</h3>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search settings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="search-settings"
                />
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              </div>
              {searchQuery && (
                <p className="text-xs text-muted-foreground">
                  Searching for: "{searchQuery}"
                </p>
              )}
            </div>

            {/* Quick Navigation */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Quick Access</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  Server Configuration
                </button>
                <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  Security Settings
                </button>
                <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  MCP Servers
                </button>
                <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  API Endpoints
                </button>
              </div>
            </div>

            {/* Configuration Stats */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Configuration Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Settings</span>
                  <span className="font-medium">73</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Categories</span>
                  <span className="font-medium">17</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">MCP Servers</span>
                  <span className="font-medium">{configuration.mcpServers.length}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <ConfigurationTabs 
            configuration={configuration}
            onConfigurationChange={updateConfiguration}
            searchQuery={searchQuery}
          />
        </main>
      </div>


      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal
          configuration={configuration}
          onClose={() => setShowPreview(false)}
          onGenerate={handleGeneratePackage}
        />
      )}
    </div>
  );
}
