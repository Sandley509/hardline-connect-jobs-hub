
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const AccessDenied = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
        <h3 className="text-lg font-semibold text-red-900">Access Denied</h3>
      </div>
      <p className="text-gray-700">
        You don't have permission to access this page. This page is only available to administrators.
      </p>
    </Card>
  );
};

export default AccessDenied;
