import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate form
    if (!email || !captchaInput) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    // Validate captcha
    if (captchaInput !== captcha) {
      setError('Invalid captcha. Please try again.');
      setCaptcha(generateCaptcha());
      setCaptchaInput('');
      setIsLoading(false);
      return;
    }

    // Simulate password reset process
    setTimeout(() => {
      setIsLoading(false);
      alert('Password reset instructions have been sent to your email address.');
      navigate('/signin');
    }, 2000);
  };

  return (
    <div className="w-full">
      {/* Form Header */}
      <div className="text-center mb-8">
        <h3 className="text-3xl font-semibold text-gray-800 mb-2">Forgot Password?</h3>
        <p className="text-gray-600">Enter your email / username and receive reset instructions via email.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Email/Username Field */}
        <div className="mb-6">
          <label className="block mb-2 text-gray-800 font-medium text-sm">Email / Username *</label>
          <input 
            type="text"
            className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-all duration-300 bg-gray-50 ${
              error && !email ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-600 focus:bg-white focus:shadow-lg'
            }`}
            placeholder="Email / Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Back to Login */}
        <div className="text-right mb-6">
          <Link
            to="/signin"
            className="text-blue-600 hover:underline text-sm"
          >
            Back to Login
          </Link>
        </div>

        {/* Captcha */}
        <div className="mb-4">
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
                setCaptchaInput('');
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
              error && !captchaInput ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-600 focus:bg-white focus:shadow-lg'
            }`}
            placeholder="Enter security code"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            required
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Resetting...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Reset Password
            </>
          )}
        </button>
      </form>

      {/* Register Link */}
      <div className="text-center mt-6 pt-5 border-t border-gray-200">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}