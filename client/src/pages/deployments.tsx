import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  ExternalLink, 
  Trash2, 
  Activity, 
  FileText, 
  RefreshCw,
  ArrowLeft,
  Cloud,
  Calendar,
  Globe,
  Database,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";

interface Deployment {
  id: string;
  name: string;
  description?: string;
  status: "pending" | "building" | "deploying" | "running" | "failed" | "stopped" | "updating";
  platform: string;
  publicUrl?: string;
  adminUrl?: string;
  deploymentLogs: string[];
  lastHealthCheck?: string;
  uptime: number;
  createdAt: string;
  updatedAt: string;
  deployedAt?: string;
  configurationProfileId: string;
}

export default function Deployments() {
  const [selectedDeployment, setSelectedDeployment] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all deployments
  const { data: deployments = [], isLoading, refetch } = useQuery<Deployment[]>({
    queryKey: ["/api/deployments"],
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });

  // Delete deployment mutation
  const deleteDeploymentMutation = useMutation({
    mutationFn: async (deploymentId: string) => {
      const response = await fetch(`/api/deployments/${deploymentId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete deployment");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Deployment Deleted",
        description: "The deployment has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/deployments"] });
    },
    onError: () => {
      toast({
        title: "Delete Failed",
        description: "Failed to delete the deployment.",
        variant: "destructive",
      });
    },
  });

  // Health check mutation
  const healthCheckMutation = useMutation({
    mutationFn: async (deploymentId: string) => {
      const response = await fetch(`/api/deployments/${deploymentId}/health-check`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Health check failed");
      }
      return response.json();
    },
    onSuccess: (data, deploymentId) => {
      if (data.healthy) {
        toast({
          title: "Health Check Passed",
          description: "The deployment is healthy and responding.",
        });
      } else {
        toast({
          title: "Health Check Failed",
          description: data.error || "The deployment is not responding properly.",
          variant: "destructive",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/deployments"] });
    },
    onError: () => {
      toast({
        title: "Health Check Failed",
        description: "Failed to perform health check.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = async (deploymentId: string, deploymentName: string) => {
    if (confirm(`Are you sure you want to delete "${deploymentName}"? This action cannot be undone.`)) {
      deleteDeploymentMutation.mutate(deploymentId);
    }
  };

  const handleHealthCheck = (deploymentId: string) => {
    healthCheckMutation.mutate(deploymentId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-green-100 text-green-800 border-green-200";
      case "building": return "bg-blue-100 text-blue-800 border-blue-200";
      case "deploying": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed": return "bg-red-100 text-red-800 border-red-200";
      case "stopped": return "bg-gray-100 text-gray-800 border-gray-200";
      case "pending": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running": return <CheckCircle className="h-4 w-4" />;
      case "failed": return <AlertCircle className="h-4 w-4" />;
      case "building":
      case "deploying": return <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">Loading deployments...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Config
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Cloud className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Deployment Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Manage your LibreChat deployments</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => refetch()}
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              
              <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <Database className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  {deployments.length} Deployment{deployments.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8">
        {deployments.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Cloud className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="mb-2">No Deployments Yet</CardTitle>
              <CardDescription className="mb-6">
                You haven't deployed any LibreChat instances yet. Go back to the configuration interface to create your first deployment.
              </CardDescription>
              <Link href="/">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go to Configuration
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {deployments.map((deployment: Deployment) => (
              <Card key={deployment.id} className="card-hover">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{deployment.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {deployment.description || "No description"}
                      </CardDescription>
                    </div>
                    <Badge className={`ml-2 ${getStatusColor(deployment.status)}`}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(deployment.status)}
                        <span className="capitalize">{deployment.status}</span>
                      </div>
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* URLs */}
                  {deployment.publicUrl && (
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => window.open(deployment.publicUrl, '_blank')}
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        Visit Live Site
                        <ExternalLink className="h-3 w-3 ml-auto" />
                      </Button>
                      
                      {deployment.adminUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => window.open(deployment.adminUrl, '_blank')}
                        >
                          <Database className="h-4 w-4 mr-2" />
                          Admin Panel
                          <ExternalLink className="h-3 w-3 ml-auto" />
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Deployment Info */}
                  <div className="text-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Platform:</span>
                      <span className="font-medium capitalize">{deployment.platform}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span className="font-medium">{formatDate(deployment.createdAt)}</span>
                    </div>
                    
                    {deployment.deployedAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Deployed:</span>
                        <span className="font-medium">{formatDate(deployment.deployedAt)}</span>
                      </div>
                    )}
                    
                    {deployment.status === "running" && deployment.uptime > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Uptime:</span>
                        <span className="font-medium">{formatUptime(deployment.uptime)}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 pt-4 border-t">
                    {deployment.status === "running" && deployment.publicUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleHealthCheck(deployment.id)}
                        disabled={healthCheckMutation.isPending}
                      >
                        <Activity className="h-4 w-4 mr-1" />
                        Health Check
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDeployment(
                        selectedDeployment === deployment.id ? null : deployment.id
                      )}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Logs
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(deployment.id, deployment.name)}
                      disabled={deleteDeploymentMutation.isPending}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Logs Panel */}
                  {selectedDeployment === deployment.id && (
                    <div className="mt-4 p-4 bg-gray-900 text-gray-100 rounded-lg text-sm font-mono max-h-48 overflow-y-auto">
                      {deployment.deploymentLogs.length > 0 ? (
                        deployment.deploymentLogs.map((log, index) => (
                          <div key={index} className="mb-1">
                            {log}
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-400">No logs available</div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}