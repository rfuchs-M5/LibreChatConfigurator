import { Badge } from "@/components/ui/badge";
import { Check, Clock, AlertTriangle } from "lucide-react";

interface StatusIndicatorProps {
  status: "valid" | "invalid" | "pending";
  count?: string;
  className?: string;
}

export function StatusIndicator({ status, count, className = "" }: StatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "valid":
        return {
          icon: Check,
          className: "bg-green-100 text-green-700 hover:bg-green-100",
          text: count || "Valid",
        };
      case "invalid":
        return {
          icon: AlertTriangle,
          className: "bg-red-100 text-red-700 hover:bg-red-100",
          text: count || "Invalid",
        };
      case "pending":
        return {
          icon: Clock,
          className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
          text: count || "Pending",
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge variant="secondary" className={`${config.className} ${className}`}>
      <Icon className="h-3 w-3 mr-1" />
      {config.text}
    </Badge>
  );
}
