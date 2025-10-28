'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Si el usuario ya está logueado, redirige
  if (user) {
    router.replace('/admin/dashboard');
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}