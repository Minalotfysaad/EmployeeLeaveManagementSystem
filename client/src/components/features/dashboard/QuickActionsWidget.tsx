import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, PieChart, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';

interface QuickActionsWidgetProps {
  onRequestLeave: () => void;
}

export const QuickActionsWidget: React.FC<QuickActionsWidgetProps> = ({ onRequestLeave }) => {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-center gap-3">
        <Button
          variant="primary"
          className="w-full justify-start py-3"
          leftIcon={<PlusCircle className="w-4 h-4" />}
          onClick={onRequestLeave}
        >
          Request Leave
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start py-3 border-gray-200 hover:border-brand-teal text-navy-900"
          leftIcon={<PieChart className="w-4 h-4 text-brand-orange" />}
          onClick={() => navigate('/balance')}
        >
          View Leave Balance
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start py-3 border-gray-200 hover:border-brand-teal text-navy-900"
          leftIcon={<Calendar className="w-4 h-4 text-brand-teal" />}
          onClick={() => navigate('/calendar')}
        >
          View Calendar
        </Button>
      </CardContent>
    </Card>
  );
};
