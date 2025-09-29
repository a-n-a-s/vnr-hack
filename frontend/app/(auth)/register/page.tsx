'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation
        if (!termsAccepted) {
            setError('You must agree to the Terms of Service and Privacy Policy');
            setLoading(false);
            return;
        }

       

        try {
            const response = await fetch('http://127.0.0.1:8000/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email, 
                    password,
                    name: fullName // Assuming backend expects 'name' field
                }),
            });

            if (response.ok) {
                // Registration successful, redirect to dashboard
                router.push('/dashboard');
                router.refresh(); // Refresh to update any UI that depends on auth state
            } else {
                const data = await response.json();
                setError(data.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error('Registration error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='bg-white border-2 border-gray-200 shadow-md w-full py-10 px-16 flex-col rounded-md '>
            <div className='text-5xl text-green-900 font-bold text-center'>Join us today</div>
            <div className='text-xxl text-gray-400 font-semibold text-center my-6'>Create your account</div>
            
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}
            
            <form className='flex flex-col gap-4' onSubmit={handleRegister}>
                <div className=''>
                    <div className='text-md mx-1 my-1'>Full Name</div>
                    <input 
                        className='w-full border-gray-300 h-12 hover:outline-none border-2 text-md px-4 text-gray-600 font-bold rounded-lg' 
                        type='text' 
                        placeholder='Enter your full name' 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                </div>
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
                <div className="flex items-center">
                    <input 
                        type="checkbox" 
                        id="terms" 
                        className="h-4 w-4 text-green-900 border-gray-300 rounded focus:ring-green-900"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                    />
                    <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                        I agree to the <a href="#" className="text-green-900 hover:underline">Privacy Policy</a> and <a href="#" className="text-green-900 hover:underline">Terms of Service</a>
                    </label>
                </div>
                <div className='mt-6'>
                    <button 
                        className='w-full h-12 bg-green-900 text-white text-lg font-bold rounded-lg hover:bg-green-800 transition-colors'
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </div>
            </form>
            <div className="text-center mt-4">
                <p className="text-gray-600">
                    Already have an account?{' '}
                    <a href="/login" className="text-green-900 font-medium hover:underline">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    )
}

export default RegisterPage