'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';



const LoginPage = () => {
    const fetchUser = useAuthStore((state) => state.fetchUser);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies in the request
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                // Login successful, redirect to dashboard
                await fetchUser();
                router.push('/dashboard');
                router.refresh(); // Refresh to update any UI that depends on auth state
            } else {
                const data = await response.json();
                setError(data.message || 'Login failed. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='bg-white border-2 border-gray-200 shadow-md w-full py-10 px-16 flex-col rounded-md '>
            <div className='text-5xl text-green-900 font-bold text-center'>Welcome Back</div>
            <div className='text-xxl text-gray-400 font-semibold text-center my-6'>Sign in to your account</div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            <form className='flex flex-col gap-4' onSubmit={handleLogin}>
                <div className=''>
                    <div className='text-md mx-1 my-1'>Email</div>
                    <input
                        className='w-full border-gray-300 h-12 hover:outline-none border-2 text-md px-4 text-gray-600 font-bold rounded-lg'
                        type='email'
                        placeholder='Enter your email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className=''>
                    <div className='text-md mx-1 my-1'>Password</div>
                    <input
                        className='w-full border-gray-300 h-12 hover:outline-none border-2 text-md px-4 text-gray-600 font-bold rounded-lg'
                        type='password'
                        placeholder='Enter your password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className='mt-6'>
                    <button
                        className='w-full h-12 bg-green-900 text-white text-lg font-bold rounded-lg hover:bg-green-800 transition-colors'
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
            </form>
            <div className="text-center mt-4">
                <p className="text-gray-600">
                    Don't have an account?{' '}
                    <a href="/register" className="text-green-900 font-medium hover:underline">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    )
}

export default LoginPage