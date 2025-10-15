import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";

export default function SignUpForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    nidFront: null as File | null,
    nidBack: null as File | null,
    tradeLicense: null as File | null,
    username: '',
    password: '',
    confirmPassword: '',
    captchaInput: '',
    agreeTerms: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 3;

  // Generate random captcha
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Full name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
      else if (!/^(017|013|019|014|015|016|018)\d{8}$/.test(formData.mobile)) newErrors.mobile = 'Invalid mobile number';
    }

    if (step === 2) {
      if (!formData.nidFront) newErrors.nidFront = 'NID front photo is required';
      if (!formData.nidBack) newErrors.nidBack = 'NID back photo is required';
      if (!formData.tradeLicense) newErrors.tradeLicense = 'Trade license is required';
    }

    if (step === 3) {
      if (!formData.username.trim()) newErrors.username = 'Username is required';
      if (!formData.password) newErrors.password = 'Password is required';
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      if (!formData.captchaInput) newErrors.captchaInput = 'Security code is required';
      else if (formData.captchaInput !== captcha) newErrors.captchaInput = 'Invalid security code';
      if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;

    setIsLoading(true);
    
    // Simulate registration process
    setTimeout(() => {
      setIsLoading(false);
      alert('Registration successful! Please check your email for verification.');
      navigate('/signin');
    }, 2000);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="w-full">
      {/* Form Header */}
      <div className="text-center mb-8">
        <h3 className="text-3xl font-semibold text-gray-800 mb-2">Create Account</h3>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-gray-200 rounded-sm mb-5 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-400 rounded-sm"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step Indicator */}
      <div className="flex justify-center mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                step < currentStep 
                  ? 'bg-green-500 text-white' 
                  : step === currentStep 
                    ? 'bg-blue-600 text-white scale-110' 
                    : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step < currentStep ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                step
              )}
            </div>
            {step < 3 && (
              <div className={`w-5 h-0.5 mx-2 ${step < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block mb-2 text-gray-800 font-medium text-sm">Full Name *</label>
              <input 
                type="text"
                className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-all duration-300 bg-gray-50 ${
                  errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-600 focus:bg-white focus:shadow-lg'
                }`}
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
              {errors.name && (
                <div className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name}
                </div>
              )}
            </div>

            <div>
              <label className="block mb-2 text-gray-800 font-medium text-sm">Email Address *</label>
              <input 
                type="email"
                className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-all duration-300 bg-gray-50 ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-600 focus:bg-white focus:shadow-lg'
                }`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
              {errors.email && (
                <div className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </div>
              )}
            </div>

            <div>
              <label className="block mb-2 text-gray-800 font-medium text-sm">Mobile Number *</label>
              <input 
                type="tel"
                className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-all duration-300 bg-gray-50 ${
                  errors.mobile ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-600 focus:bg-white focus:shadow-lg'
                }`}
                placeholder="Enter mobile number"
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value.replace(/[^0-9]/g, ''))}
              />
              {errors.mobile && (
                <div className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.mobile}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Documents */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div>
              <label className="block mb-2 text-gray-800 font-medium text-sm">NID Front Photo *</label>
              <input 
                type="file"
                accept=".jpg,.jpeg,.png"
                className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-all duration-300 bg-gray-50 ${
                  errors.nidFront ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-600 focus:bg-white'
                }`}
                onChange={(e) => handleFileChange('nidFront', e.target.files?.[0] || null)}
              />
              {errors.nidFront && (
                <div className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.nidFront}
                </div>
              )}
            </div>

            <div>
              <label className="block mb-2 text-gray-800 font-medium text-sm">NID Back Photo *</label>
              <input 
                type="file"
                accept=".jpg,.jpeg,.png"
                className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-all duration-300 bg-gray-50 ${
                  errors.nidBack ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-600 focus:bg-white'
                }`}
                onChange={(e) => handleFileChange('nidBack', e.target.files?.[0] || null)}
              />
              {errors.nidBack && (
                <div className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.nidBack}
                </div>
              )}
            </div>

            <div>
              <label className="block mb-2 text-gray-800 font-medium text-sm">Trade License *</label>
              <input 
                type="file"
                accept=".jpg,.jpeg,.png"
                className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-all duration-300 bg-gray-50 ${
                  errors.tradeLicense ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-600 focus:bg-white'
                }`}
                onChange={(e) => handleFileChange('tradeLicense', e.target.files?.[0] || null)}
              />
              {errors.tradeLicense && (
                <div className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.tradeLicense}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Account Details */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div>
              <label className="block mb-2 text-gray-800 font-medium text-sm">Username *</label>
              <input 
                type="text"
                className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-all duration-300 bg-gray-50 ${
                  errors.username ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-600 focus:bg-white focus:shadow-lg'
                }`}
                placeholder="Choose a username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
              />
              {errors.username && (
                <div className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.username}
                </div>
              )}
            </div>

            <div>
              <label className="block mb-2 text-gray-800 font-medium text-sm">Password *</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-4 py-3 pr-12 border-2 rounded-xl text-base transition-all duration-300 bg-gray-50 ${
                    errors.password ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-600 focus:bg-white focus:shadow-lg'
                  }`}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </div>
              )}
            </div>

            <div>
              <label className="block mb-2 text-gray-800 font-medium text-sm">Confirm Password *</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  className={`w-full px-4 py-3 pr-12 border-2 rounded-xl text-base transition-all duration-300 bg-gray-50 ${
                    errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-600 focus:bg-white focus:shadow-lg'
                  }`}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            {/* Captcha */}
            <div>
              <label className="block mb-2 text-gray-800 font-medium text-sm">Security Code *</label>
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="bg-gray-100 border-2 border-gray-200 rounded-lg p-3 font-mono text-lg font-bold text-gray-800 select-none min-w-[150px] text-center"
                  style={{width: '150px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                >
                  {captcha}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCaptcha(generateCaptcha());
                    handleInputChange('captchaInput', '');
                  }}
                  className="bg-gray-50 border-2 border-gray-200 rounded-lg p-2 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:rotate-180"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <input 
                type="text"
                className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-all duration-300 bg-gray-50 ${
                  errors.captchaInput ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-600 focus:bg-white focus:shadow-lg'
                }`}
                placeholder="Enter security code"
                value={formData.captchaInput}
                onChange={(e) => handleInputChange('captchaInput', e.target.value)}
              />
              {errors.captchaInput && (
                <div className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.captchaInput}
                </div>
              )}
            </div>

            {/* Terms Checkbox */}
            <div>
              <label className="flex items-center">
                <input 
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                  className="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">I agree to the Terms and Conditions *</span>
              </label>
              {errors.agreeTerms && (
                <div className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.agreeTerms}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-200 border-2 border-gray-200"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Previous
            </button>
          )}
          
          <div className="ml-auto">
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Next
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Register
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Sign In Link */}
      <div className="text-center mt-6">
        <Link
          to="/signin"
          className="text-blue-600 hover:underline"
        >
          Already have an account? Sign In
        </Link>
      </div>
    </div>
  );
}