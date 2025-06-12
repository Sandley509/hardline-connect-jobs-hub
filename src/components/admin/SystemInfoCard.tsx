
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

const SystemInfoCard = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <Users className="h-6 w-6 text-blue-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900">System Information</h2>
      </div>
      <div className="space-y-4">
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <p className="font-medium mb-1">Complete Role System:</p>
          <ul className="text-xs space-y-1">
            <li>• Full admin role functionality restored</li>
            <li>• Role-based access control enabled</li>
            <li>• Complete administrative capabilities</li>
            <li>• All management features available</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default SystemInfoCard;
