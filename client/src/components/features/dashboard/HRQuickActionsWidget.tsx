import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Users, Building2, Layers, CalendarDays, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';

export const HRQuickActionsWidget: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>HR Administration Actions</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-center gap-2.5">
        <Button
          variant="primary"
          className="w-full justify-start py-2.5"
          leftIcon={<ShieldCheck className="w-4 h-4" />}
          onClick={() => navigate('/hr/approvals')}
        >
          Review Pending Approvals
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start py-2.5 border-gray-200 hover:border-brand-teal text-navy-900"
          leftIcon={<Users className="w-4 h-4 text-blue-600" />}
          onClick={() => navigate('/hr/employees')}
        >
          Employee Directory
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start py-2.5 border-gray-200 hover:border-brand-teal text-navy-900"
          leftIcon={<Building2 className="w-4 h-4 text-brand-darkTeal" />}
          onClick={() => navigate('/hr/departments')}
        >
          Manage Departments
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start py-2.5 border-gray-200 hover:border-brand-teal text-navy-900"
          leftIcon={<Layers className="w-4 h-4 text-brand-orange" />}
          onClick={() => navigate('/hr/leave-types')}
        >
          Leave Types & Policies
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start py-2.5 border-gray-200 hover:border-brand-teal text-navy-900"
          leftIcon={<CalendarDays className="w-4 h-4 text-emerald-600" />}
          onClick={() => navigate('/hr/holidays')}
        >
          Manage Public Holidays
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start py-2.5 border-gray-200 hover:border-brand-teal text-navy-900"
          leftIcon={<Calendar className="w-4 h-4 text-purple-600" />}
          onClick={() => navigate('/calendar')}
        >
          View Team Calendar
        </Button>
      </CardContent>
    </Card>
  );
};
