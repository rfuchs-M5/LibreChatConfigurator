import { useState } from "react";
import { ConfigurationTabs } from "@/components/configuration-tabs";
import { PreviewModal } from "@/components/preview-modal";
import { useConfiguration } from "@/hooks/use-configuration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Download, Save, Upload, CheckCircle, Eye, Rocket, Cloud, ExternalLink } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
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

  const handleDeploy = async () => {
    if (isDeploying) return;

    try {
      setIsDeploying(true);
      
      // First, save the current configuration as a profile
      const savedProfile = await saveProfile({
        name: `Deploy Configuration ${new Date().toISOString().split('T')[0]}`,
        description: "Configuration profile created for deployment",
      });

      toast({
        title: "Starting Deployment",
        description: "Your LibreChat instance is being deployed to the cloud...",
      });

      // Create deployment
      const deploymentResponse = await fetch("/api/deployments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `LibreChat-${Date.now()}`,
          description: "Deployed from LibreChat Configuration Interface",
          configurationProfileId: savedProfile.id,
          platform: "railway",
          region: "us-west-1",
          resourcePlan: "starter"
        })
      });

      if (!deploymentResponse.ok) {
        throw new Error("Failed to create deployment");
      }

      const deployment = await deploymentResponse.json();

      // Poll for deployment status
      const pollDeployment = async (): Promise<void> => {
        try {
          const response = await fetch(`/api/deployments/${deployment.id}`);
          if (!response.ok) {
            throw new Error("Failed to get deployment status");
          }
          
          const updated = await response.json();
          
          if (updated.status === "running" && updated.publicUrl) {
            setDeploymentUrl(updated.publicUrl);
            setIsDeploying(false);
            toast({
              title: "Deployment Successful! 🎉",
              description: `Your LibreChat instance is now live at ${updated.publicUrl}`,
              duration: 10000,
            });
          } else if (updated.status === "failed") {
            setIsDeploying(false);
            toast({
              title: "Deployment Failed",
              description: "Failed to deploy LibreChat instance. Please try again.",
              variant: "destructive",
            });
          } else {
            // Still deploying, check again in 3 seconds
            setTimeout(pollDeployment, 3000);
          }
        } catch (error) {
          console.error("Error polling deployment:", error);
          setTimeout(pollDeployment, 5000); // Retry with longer delay
        }
      };

      // Start polling
      setTimeout(pollDeployment, 2000);

    } catch (error) {
      setIsDeploying(false);
      toast({
        title: "Deployment Failed",
        description: "Failed to initiate deployment. Please try again.",
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
              
              <Button 
                onClick={handleDeploy} 
                disabled={isDeploying}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" 
                data-testid="button-deploy"
              >
                {isDeploying ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Cloud className="h-4 w-4 mr-2" />
                    Deploy Live
                  </>
                )}
              </Button>
              
              {deploymentUrl && (
                <Button 
                  variant="outline"
                  onClick={() => window.open(deploymentUrl, '_blank')}
                  className="border-green-200 text-green-700 hover:bg-green-50"
                  data-testid="button-visit-deployment"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Live Site
                </Button>
              )}
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
