import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusIndicator } from "./status-indicator";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Rocket, Eye } from "lucide-react";

interface ValidationPanelProps {
  onPreview: () => void;
  onGenerate: () => void;
}

export function ValidationPanel({ onPreview, onGenerate }: ValidationPanelProps) {
  const { data: validationStatus } = useQuery({
    queryKey: ["/api/configuration/validate"],
    enabled: false, // We'll trigger this manually
  });

  // Mock validation status for now
  const mockValidationStatus = [
    { category: "Server Settings", status: "valid" as const },
    { category: "Security Config", status: "valid" as const },
    { category: "API Keys", status: "valid" as const },
  ];

  return (
    <div className="fixed bottom-6 right-6 bg-white rounded-xl shadow-lg border border-border p-4 max-w-sm z-40">
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
          <CheckCircle className="h-4 w-4 text-green-600" />
        </div>
        <div>
          <div className="font-semibold text-foreground">Validation Status</div>
          <div className="text-sm text-muted-foreground">Configuration is valid</div>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        {mockValidationStatus.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{item.category}</span>
            <StatusIndicator status={item.status} />
          </div>
        ))}
      </div>
      
      <div className="space-y-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={onPreview}
          data-testid="button-preview"
        >
          <Eye className="h-4 w-4 mr-2" />
          Preview Config
        </Button>
        
        <Button 
          size="sm" 
          className="w-full bg-primary hover:bg-primary/90" 
          onClick={onGenerate}
          data-testid="button-generate"
        >
          <Rocket className="h-4 w-4 mr-2" />
          Ready to Generate
        </Button>
      </div>
    </div>
  );
}
