import { useState } from "react";
import { ConfigurationTabs } from "@/components/configuration-tabs";
import { PreviewModal } from "@/components/preview-modal";
import { useConfiguration } from "@/hooks/use-configuration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Download, Save, Upload, CheckCircle, Eye, Rocket, ChevronDown, FolderOpen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"; 
import { Label } from "@/components/ui/label";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [configurationName, setConfigurationName] = useState("My LibreChat Configuration");
  const { configuration, updateConfiguration, saveProfile, generatePackage } = useConfiguration();
  const { toast } = useToast();

  const handleSaveProfile = async () => {
    try {
      // Create profile data with configuration and name
      const profileData = {
        name: configurationName,
        description: `Configuration profile created on ${new Date().toLocaleDateString()}`,
        configuration: configuration,
        version: "0.8.0-rc3",
        createdAt: new Date().toISOString()
      };

      // Download as JSON file
      const blob = new Blob([JSON.stringify(profileData, null, 2)], { 
        type: "application/json" 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${configurationName.replace(/[^a-zA-Z0-9-_\s]/g, '-')}-profile.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Profile Saved",
        description: `Configuration "${configurationName}" downloaded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save configuration profile.",
        variant: "destructive",
      });
    }
  };

  const handleImportConfig = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const profileData = JSON.parse(event.target?.result as string);
            
            // Validate profile structure
            if (!profileData.configuration) {
              throw new Error("Invalid profile format: missing configuration data");
            }

            // Apply the configuration and name
            updateConfiguration(profileData.configuration);
            if (profileData.name) {
              setConfigurationName(profileData.name);
            }
            
            toast({
              title: "Profile Imported",
              description: `Configuration "${profileData.name || 'Unknown'}" loaded successfully.`,
            });
          } catch (error) {
            toast({
              title: "Import Failed",
              description: "Failed to import configuration. Please check the file format.",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleGeneratePackage = async () => {
    try {
      const result = await generatePackage({
        includeFiles: ["env", "yaml", "docker-compose", "install-script", "readme"],
      });
      
      // Import JSZip dynamically
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      // Add each file to the ZIP
      zip.file(".env", result.files[".env"]);
      zip.file("librechat.yaml", result.files["librechat.yaml"]);
      zip.file("docker-compose.yml", result.files["docker-compose.yml"]);
      zip.file("install.sh", result.files["install.sh"]);
      zip.file("README.md", result.files["README.md"]);
      
      // Generate ZIP file and download
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `librechat-config-${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Package Generated",
        description: "LibreChat installation package downloaded as ZIP file.",
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
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-foreground">LibreChat Configuration</h1>
                  <p className="text-sm text-muted-foreground">v0.8.0-rc3 Enterprise Setup</p>
                </div>
                
                {/* Configuration Name Input */}
                <div className="flex-1 max-w-md">
                  <Input
                    value={configurationName}
                    onChange={(e) => setConfigurationName(e.target.value)}
                    className="text-lg font-medium bg-transparent border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="Configuration name..."
                    data-testid="input-config-name"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Profile Management Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" data-testid="button-profile-menu">
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Configuration Profiles
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={handleSaveProfile} data-testid="menu-save">
                    <Save className="h-4 w-4 mr-2" />
                    Save Configuration
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleImportConfig} data-testid="menu-import">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Configuration...
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="h-6 border-l border-border mx-2"></div>
              
              {/* Package Generation Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90" data-testid="button-package-menu">
                    <Rocket className="h-4 w-4 mr-2" />
                    Package Generation
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setShowPreview(true)} data-testid="menu-preview">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Files...
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleGeneratePackage} data-testid="menu-generate">
                    <Download className="h-4 w-4 mr-2" />
                    Generate & Download ZIP
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
            onSearchQueryChange={setSearchQuery}
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
