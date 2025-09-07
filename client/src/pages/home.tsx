import { useState } from "react";
import { ConfigurationTabs } from "@/components/configuration-tabs";
import { ValidationPanel } from "@/components/validation-panel";
import { PreviewModal } from "@/components/preview-modal";
import { useConfiguration } from "@/hooks/use-configuration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Download, Save, Upload } from "lucide-react";

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
              {/* Search functionality */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search settings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 pl-10"
                  data-testid="search-settings"
                />
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              </div>
              
              <Button variant="secondary" data-testid="button-import">
                <Upload className="h-4 w-4 mr-2" />
                Import Config
              </Button>
              
              <Button onClick={handleSaveProfile} data-testid="button-save">
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1">
          <ConfigurationTabs 
            configuration={configuration}
            onConfigurationChange={updateConfiguration}
            searchQuery={searchQuery}
          />
        </main>
      </div>

      {/* Validation Panel */}
      <ValidationPanel 
        onPreview={() => setShowPreview(true)}
        onGenerate={handleGeneratePackage}
      />

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
