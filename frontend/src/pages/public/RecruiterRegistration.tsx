import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import { companiesApi } from '../../api/companies.api';
import { useAuth } from '../../context/AuthContext';
import { Building, Loader2, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { HomeButton } from '../../components/common/HomeButton';

export const RecruiterRegistration = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    industry: '',
    companySize: '',
    website: '',
    about: '',
    recruiterPosition: '',
    acceptTerms: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
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
      // 1. Register User as Recruiter
      await authApi.register({
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        password: formData.password,
        role: 'Recruiter'
      });

      // 2. Login immediately to get the token
      const loginData = new URLSearchParams();
      loginData.append('username', formData.email);
      loginData.append('password', formData.password);
      
      const tokenResponse = await authApi.login(loginData);
      const accessToken = tokenResponse.access_token;
      
      localStorage.setItem('token', accessToken);
      const userData = await authApi.getCurrentUser();
      
      // Update global auth state temporarily so companiesApi has auth token available
      // Note: In typical setups, axios intercepts use localStorage. 
      // If AuthContext is required to inject it, it will already be in localStorage for interceptors.

      // 3. Create Company Profile
      await companiesApi.createCompany({
        company_name: formData.companyName,
        industry: formData.industry,
        company_size: formData.companySize,
        website: formData.website,
        about: formData.about,
      });

      // Update auth context fully
      login(accessToken, { ...userData, role: 'Recruiter' });

      // Navigate to dashboard
      navigate('/recruiter/dashboard', { replace: true });
    } catch (err: any) {
      console.error('Registration error:', err);
      // Clear token if failure happened midway
      localStorage.removeItem('token');
      setError(
        err.response?.data?.detail || 
        'An error occurred during registration. Please check all fields and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <HomeButton />
      
      {/* Left side: Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:w-1/2 xl:w-5/12 lg:px-20 xl:px-24 overflow-y-auto">
        <div className="mx-auto w-full max-w-md lg:w-full py-8">
          <div>
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg mb-6">
              <Building className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Recruiter Registration</h2>
            <p className="mt-2 text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login?role=recruiter" className="font-semibold text-purple-600 hover:text-purple-500 hover:underline underline-offset-2">
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

            <form onSubmit={handleSubmit} className="space-y-8" noValidate>
              {/* Personal Details Section */}
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">Personal Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">First Name *</label>
                    <input
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all"
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
                      className="block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Work Email *</label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password *</label>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="block w-full px-4 py-3 pr-11 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all"
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
                                ? strength <= 2 ? 'bg-amber-400' : strength === 3 ? 'bg-purple-400' : 'bg-emerald-500'
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
                        className="block w-full px-4 py-3 pr-11 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all"
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
                </div>
              </div>

              {/* Company Details Section */}
              <div className="space-y-5 pt-2">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">Company Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Company Name *</label>
                    <input
                      name="companyName"
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Recruiter Title *</label>
                    <input
                      name="recruiterPosition"
                      type="text"
                      required
                      value={formData.recruiterPosition}
                      onChange={handleInputChange}
                      placeholder="e.g. Talent Acquisition"
                      className="block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Industry *</label>
                    <input
                      name="industry"
                      type="text"
                      required
                      value={formData.industry}
                      onChange={handleInputChange}
                      placeholder="e.g. Software, Finance"
                      className="block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Company Size *</label>
                    <select
                      name="companySize"
                      required
                      value={formData.companySize}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all bg-white"
                    >
                      <option value="" disabled>Select size</option>
                      <option value="1-10">1–10 employees</option>
                      <option value="11-50">11–50 employees</option>
                      <option value="51-200">51–200 employees</option>
                      <option value="201-500">201–500 employees</option>
                      <option value="501-1000">501–1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Website</label>
                  <input
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://"
                    className="block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Company Description</label>
                  <textarea
                    name="about"
                    rows={3}
                    value={formData.about}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all resize-none"
                    placeholder="Tell us about your company..."
                  />
                </div>
              </div>

              <div className="flex items-center pt-2">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
                />
                <label htmlFor="acceptTerms" className="ml-2 block text-sm text-slate-700">
                  I agree to the <a href="#" className="font-medium text-purple-600 hover:underline">Terms of Service</a> and <a href="#" className="font-medium text-purple-600 hover:underline">Privacy Policy</a>.
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Setting up your company...
                  </>
                ) : (
                  'Create Recruiter Account'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Right side: Image overlay */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-purple-900" />
        <img
          className="absolute inset-0 h-full w-full object-cover mix-blend-multiply opacity-60"
          src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80"
          alt="Recruitment Team"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent" />
        <div className="absolute bottom-16 left-16 right-16">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-6">
            <ShieldCheck className="w-8 h-8 text-purple-200" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Build Your Dream Team</h2>
          <p className="text-xl text-purple-100 max-w-lg">
            Connect with top-tier talent instantly using AI-powered matching and streamlined recruitment workflows.
          </p>
        </div>
      </div>
    </div>
  );
};
