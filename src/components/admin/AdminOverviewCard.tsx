
import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";

interface AdminOverviewCardProps {
  adminCount: number;
  isLoading: boolean;
}

const AdminOverviewCard = ({ adminCount, isLoading }: AdminOverviewCardProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <Shield className="h-6 w-6 text-green-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900">Admin Overview</h2>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <Shield className="h-5 w-5 text-green-600 mr-2" />
          <span className="font-medium text-green-900">Active Admins</span>
        </div>
        <p className="text-2xl font-bold text-green-900">
          {isLoading ? '...' : adminCount}
        </p>
      </div>
    </Card>
  );
};

export default AdminOverviewCard;
