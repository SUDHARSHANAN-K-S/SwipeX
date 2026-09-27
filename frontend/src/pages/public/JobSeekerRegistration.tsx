import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Loader2, AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { HomeButton } from '../../components/common/HomeButton';

export const JobSeekerRegistration = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length > 7) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const strength = calculatePasswordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!formData.acceptTerms) {
      setError('You must accept the terms and conditions.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Register User
      await authApi.register({
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        password: formData.password,
        role: 'JobSeeker'
      });

      // 2. Login immediately to get the token
      const loginData = new URLSearchParams();
      loginData.append('username', formData.email);
      loginData.append('password', formData.password);
      
      const tokenResponse = await authApi.login(loginData);
      const accessToken = tokenResponse.access_token;
      
      localStorage.setItem('token', accessToken);
      const userData = await authApi.getCurrentUser();
      
      // Update global auth state
      login(accessToken, { ...userData, role: 'JobSeeker' });

      // Navigate to profile completion
      navigate('/dashboard/profile', { replace: true });
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.detail || 
        'An error occurred during registration. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <HomeButton />
      
      {/* Left side: Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:w-1/2 xl:w-5/12 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-full">
          <div>
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg mb-6">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create your account</h2>
            <p className="mt-2 text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login?role=job_seeker" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline underline-offset-2">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">First Name *</label>
                  <input
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Last Name *</label>
                  <input
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address *</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password *</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 pr-11 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2 flex gap-1 h-1.5">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`flex-1 rounded-full ${
                          strength >= level
                            ? strength <= 2 ? 'bg-amber-400' : strength === 3 ? 'bg-blue-400' : 'bg-emerald-500'
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password *</label>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 pr-11 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <label htmlFor="acceptTerms" className="ml-2 block text-sm text-slate-700">
                  I agree to the <a href="#" className="font-medium text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="font-medium text-blue-600 hover:underline">Privacy Policy</a>.
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Job Seeker Account'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Right side: Image overlay */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-blue-600" />
        <img
          className="absolute inset-0 h-full w-full object-cover mix-blend-multiply opacity-60"
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2942&q=80"
          alt="Career Growth"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent" />
        <div className="absolute bottom-16 left-16 right-16">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-6">
            <CheckCircle className="w-8 h-8 text-blue-200" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Discover Your Path</h2>
          <p className="text-xl text-blue-100 max-w-lg">
            Join thousands of professionals finding their dream roles using our AI-driven insights and resume matching.
          </p>
        </div>
      </div>
    </div>
  );
};
