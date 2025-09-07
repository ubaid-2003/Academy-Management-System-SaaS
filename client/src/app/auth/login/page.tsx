'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HiOutlineMail, HiOutlineLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

type LoginForm = { email: string; password: string };

export default function LoginPage() {
  const router = useRouter();
  const { setUser, updateActiveAcademy } = useAuth();

  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.user) {
        setMessage(data.message || 'Invalid credentials');
        return;
      }

      // ✅ Clear old user/token
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('permissions');

      const loggedUser = {
        id: data.user.id,
        fullName: data.user.fullName,
        email: data.user.email,
        role: data.user.role,
        avatar: data.user.avatar || '',
        token: data.token,
        activeAcademyId: data.user.activeAcademyId,
        academyIds: data.user.academyIds || [],
        permissions: data.permissions || [],
      };

      // ✅ Set user in context and localStorage
      setUser(loggedUser);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      localStorage.setItem('token', data.token);
      localStorage.setItem('permissions', JSON.stringify(data.permissions || []));

      // ✅ Automatically set first academy if not set
      if (!loggedUser.activeAcademyId && loggedUser.academyIds?.length > 0) {
        await updateActiveAcademy(loggedUser.academyIds[0]);
      }

      router.push('/pages/dashboard');
    } catch (err) {
      console.error(err);
      setMessage('Server error, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Left Illustration */}
      <div className="items-center justify-center hidden w-1/2 p-12 bg-blue-600 lg:flex">
        <div className="max-w-lg text-white">
          <h1 className="mb-4 text-5xl font-extrabold">Welcome Back!</h1>
          <h2 className="mb-6 text-2xl font-medium">Sign in to continue 🚀</h2>
          <p className="text-lg opacity-90">Access your dashboard and manage your tasks.</p>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="flex items-center justify-center w-full p-8 lg:w-1/2">
        <div className="w-full max-w-md p-10 bg-white shadow-2xl rounded-2xl">
          <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">Login</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <HiOutlineMail className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" size={18} />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full py-3 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" size={18} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full py-3 pl-10 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                >
                  {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-70"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {message && (
              <div className="p-3 text-sm text-center text-red-600 rounded-lg bg-red-50">
                {message}
              </div>
            )}
          </form>

          <p className="mt-6 text-sm text-center text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/register" className="font-medium text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
