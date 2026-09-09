import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F8FB] p-6 text-center">
      <div className="max-w-md space-y-4">
        <span className="text-6xl font-black text-brand-teal block">404</span>
        <h1 className="text-2xl font-extrabold text-navy-900 font-sans">Page Not Found</h1>
        <p className="text-sm text-gray-500">
          The page you are looking for might have been moved, deleted, or does not exist.
        </p>

        <div className="pt-4 flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Go Back
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/dashboard')} leftIcon={<Home className="w-4 h-4" />}>
            Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
