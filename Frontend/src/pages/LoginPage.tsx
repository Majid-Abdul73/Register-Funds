import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left Section */}
      <div className="w-full md:w-1/2 bg-register-light p-4 md:p-8">
        <div className="max-w-md mx-auto">
          <Link to="/" className="flex items-center mb-8 md:mb-14">
            <span className="ml-1.5 font-semibold text-lg">Register</span>
            <div className="bg-register-green text-white text-xs font-semibold py-0.5 px-1.5 rounded">
              FUNDS
            </div>
          </Link>
          
          <p className="text-register-green text-sm mb-2">For School Administrators & Reps</p>
          
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Welcome Back, <br className="hidden md:block" />School Leader</h1>
          <div className="mb-4 hidden md:block">
            <img 
              src="/images/students-happy.jpg" 
              alt="Happy Students"
              className="rounded-lg w-full h-[240px] object-cover"
            />
          </div>
          
          <p className="text-gray-600 text-sm hidden md:block">
          Your story matters. Log in to share updates and find the support your school deserves.          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 p-4 md:p-8">
        <div className="max-w-md mx-auto">
          <div className="text-right mb-4 md:mb-8 gap-4">
            <span className="text-sm mr-2 text-gray-600">Don't have an account? </span>
            <Link to="/register" className="text-sm text-gray-900 font-medium hover:text-register-green">
              Sign up →
            </Link>
          </div>

          <div className="space-y-4 md:space-y-6">
            <div>
              <h2 className="text-xl font-semibold mt-6 md:mt-14">Sign into Register Funds</h2>
              <p className="text-gray-600 text-sm">
              Log in to update your campaign, share your current challenges, and connect with donors who care.              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 w-3/4">
              <div>
                <label className="block text-sm mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@gmail.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-register-green"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-register-green"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <div className='pt-10 '>
              <button
                type="submit"
                disabled={loading}
                className={`px-12 py-1.5 rounded-3xl  ${
                  loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-register-green hover:bg-register-green/90'
                } text-white`}
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}