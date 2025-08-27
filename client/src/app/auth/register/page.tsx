'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';

type RegisterForm = {
  fullName: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterForm>({
    fullName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form), // only fullName, email, password
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Account created successfully! Redirecting to login...');
        setTimeout(() => router.push('/auth/login'), 1500);
      } else {
        setMessage(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Server error, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen p-8 bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full max-w-md p-10 bg-white shadow-lg rounded-xl">
        <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-1">
            <label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name</label>
            <div className="relative">
              <HiOutlineUser className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" size={18} />
              <input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={handleChange}
                required
                className="w-full py-3 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

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
                className="w-full py-3 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full py-3 pl-10 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-70"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>

          {/* Error / Success Message */}
          {message && (
            <div className="p-3 text-sm text-center text-red-600 rounded-lg bg-red-50">
              {message}
            </div>
          )}
        </form>

        {/* Login Link */}
        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
