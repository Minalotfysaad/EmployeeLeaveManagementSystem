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
import { Mail, Lock, User } from 'lucide-react';

const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid work email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please re-type your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const { register: registerAuth } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setAuthError(null);
    try {
      const { confirmPassword: _confirmPassword, ...payload } = data;
      await registerAuth(payload);
      success('Account registered successfully! Welcome to Leavo.');
      navigate('/dashboard');
    } catch (err) {
      setAuthError(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F8FB] p-4 sm:p-8">
      <div className="w-full max-w-lg bg-white p-8 sm:p-10 rounded-3xl border border-[#E5EAF0] shadow-card space-y-6">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Horizontally Centered Brand Logo with comfortable breathing room */}
          <div className="w-full flex items-center justify-center mb-6">
            <Logo variant="light" size="md" />
          </div>
          <h2 className="text-2xl font-extrabold text-navy-900 tracking-tight font-sans">
            Create Employee Account
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Join your organization leave platform to manage vacation and time off.
          </p>
        </div>

        {authError && (
          <Alert variant="danger" title="Registration Error">
            {authError}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="e.g. Leila"
              required
              leftIcon={<User className="w-4 h-4 text-gray-400" />}
              error={errors.firstName?.message}
              {...register('firstName')}
            />

            <Input
              label="Last Name"
              placeholder="e.g. Vance"
              required
              leftIcon={<User className="w-4 h-4 text-gray-400" />}
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>

          <Input
            type="email"
            label="Work Email"
            placeholder="name@company.com"
            required
            leftIcon={<Mail className="w-4 h-4 text-gray-400" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            type="password"
            label="Password"
            placeholder="At least 8 characters..."
            required
            leftIcon={<Lock className="w-4 h-4 text-gray-400" />}
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            type="password"
            label="Re-type Password"
            placeholder="Confirm password..."
            required
            leftIcon={<Lock className="w-4 h-4 text-gray-400" />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button
            type="submit"
            variant="navy"
            className="w-full py-3 mt-4 font-semibold"
            isLoading={isSubmitting}
          >
            Complete Registration
          </Button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-darkTeal hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

