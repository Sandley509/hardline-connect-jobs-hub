
import { Card } from "@/components/ui/card";

interface OrderStatisticsProps {
  orders: any[] | undefined;
}

const OrderStatistics = ({ orders }: OrderStatisticsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{orders?.length || 0}</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {orders?.filter(o => o.status === 'pending').length || 0}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {orders?.filter(o => o.status === 'processing').length || 0}
          </div>
          <div className="text-sm text-gray-600">Processing</div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {orders?.filter(o => o.status === 'completed').length || 0}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
      </Card>
    </div>
  );
};

export default OrderStatistics;
