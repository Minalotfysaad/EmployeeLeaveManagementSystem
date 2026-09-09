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
import { Mail, Lock, CheckCircle2, ArrowRight, Play } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login, enterDemoMode } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
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

  const handleLaunchDemo = () => {
    enterDemoMode('Employee');
    success('Welcome to Leavo Demo Mode! Explore freely.');
    navigate('/dashboard');
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
        <div className="relative z-10 max-w-lg space-y-6 my-auto">
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
              Enter your credentials to access your organization's leave portal.
            </p>
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
              className="w-full py-3 mt-2 font-semibold"
              isLoading={isSubmitting}
            >
              Sign In
            </Button>
          </form>

          {/* Registration link */}
          <div className="text-center text-xs text-gray-500 pt-1">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-brand-darkTeal hover:underline">
              Create employee account
            </Link>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-gray-200 w-full" />
            <span className="bg-white px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              or
            </span>
          </div>

          {/* Professional Demo Environment Action */}
          <button
            type="button"
            onClick={handleLaunchDemo}
            className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50/90 hover:border-gray-300 text-gray-700 hover:text-navy-900 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer group"
          >
            <Play className="w-3.5 h-3.5 text-gray-500 group-hover:text-navy-900 transition-colors" />
            <span>Access Demo Environment</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
