import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Logo } from '../../components/ui/Logo';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { getErrorMessage } from '../../utils/errors';
import { Mail, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'leila.vance@company.com',
      password: 'Password@123',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);
    try {
      await login(data);
      success('Logged in successfully!');
      navigate('/dashboard');
    } catch (err) {
      setAuthError(getErrorMessage(err));
    }
  };

  const handleQuickDemo = (email: string) => {
    setValue('email', email);
    setValue('password', 'Password@123');
    setAuthError(null);
  };

  return (
    <div className="min-h-screen flex bg-[#F6F8FB]">
      {/* Left Marketing / Brand Panel (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Subtle decorative brand glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-teal/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-orange/15 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Logo */}
        <div className="relative z-10">
          <Logo variant="dark" size="lg" showTagline />
        </div>

        {/* Center Showcase Statement */}
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-brand-cyan backdrop-blur-sm border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
            <span>Modern Employee Leave Management</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans leading-tight">
            Streamline company time off, approvals, and team availability.
          </h2>

          <p className="text-gray-300 text-sm leading-relaxed">
            Eliminate email chains and spreadsheets. Leavo empowers HR teams and managers with clear workflows, automated balance deductions, and real-time visibility.
          </p>

          {/* Value Props */}
          <div className="pt-4 space-y-3 text-xs text-gray-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
              <span>Multi-tiered Manager & HR approval pipelines</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
              <span>Automated statutory and annual leave balance deductions</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
              <span>Interactive team calendars and conflict prevention</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-gray-400">
          © {new Date().getFullYear()} Leavo SaaS Platform. Portfolio Edition.
        </div>
      </div>

      {/* Right Login Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-[#E5EAF0] shadow-card">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-2">
            <Logo variant="light" size="md" showTagline />
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-extrabold text-navy-900 tracking-tight font-sans">
              Sign in to your account
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Enter your credentials or choose a quick demo persona below.
            </p>
          </div>

          {/* Quick Demo Persona Shortcuts */}
          <div className="p-3.5 bg-[#F6F8FB] rounded-2xl border border-[#E5EAF0] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
              Quick Demo Personas
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('leila.vance@company.com')}
                className="px-2 py-1.5 rounded-xl border border-gray-200 bg-white hover:border-brand-teal text-[11px] font-bold text-gray-700 transition-all text-center"
              >
                Leila (Emp)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('david.chen@company.com')}
                className="px-2 py-1.5 rounded-xl border border-gray-200 bg-white hover:border-brand-orange text-[11px] font-bold text-gray-700 transition-all text-center"
              >
                David (Mgr)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin@company.com')}
                className="px-2 py-1.5 rounded-xl border border-gray-200 bg-white hover:border-brand-cyan text-[11px] font-bold text-gray-700 transition-all text-center"
              >
                Admin (HR)
              </button>
            </div>
          </div>

          {authError && (
            <Alert variant="danger" title="Authentication Error">
              {authError}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              type="email"
              label="Work Email"
              placeholder="name@company.com"
              required
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              required
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              {...register('password')}
            />

            <Button
              type="submit"
              variant="navy"
              className="w-full py-3 mt-2"
              isLoading={isSubmitting}
            >
              Sign In
            </Button>
          </form>

          <div className="text-center text-xs text-gray-500 pt-2">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-brand-darkTeal hover:underline">
              Create employee account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
