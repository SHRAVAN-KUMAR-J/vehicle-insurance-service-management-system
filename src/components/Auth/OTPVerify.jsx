import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, RotateCcw, CheckCircle } from 'lucide-react';

function OTPVerify() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { verifyOTP, register } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { email, purpose } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResendMessage('');
    setIsVerifying(true);
    
    try {
      if (purpose !== 'register') {
        throw new Error('Invalid verification context');
      }
      await verifyOTP(email, otp);
      navigate('/login', { replace: true, state: { message: 'Verification successful. Please login.' } });
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Failed to verify OTP';
      setError(errorMessage);
      if (errorMessage.includes('Too many failed attempts') || errorMessage.includes('Invalid or expired OTP')) {
        setResendMessage('Please request a new OTP.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setResendMessage('');
    setIsResending(true);
    
    try {
      await register({ email, purpose: 'register' });
      setResendMessage('A new OTP has been sent to your email.');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    if (!email || purpose !== 'register') {
      navigate('/login');
    }
  }, [email, purpose, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
        <div className="flex flex-col md:flex-row">
          {/* Content Section */}
          <div className="md:w-1/2 p-8 md:p-12 bg-gradient-to-br from-purple-600 to-purple-700 text-white">
            <div className="max-w-xs mx-auto text-center md:text-left">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-6 transform transition-transform duration-300 hover:rotate-12">
                <Shield className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Secure Verification</h3>
              <p className="text-purple-100 mb-2">
                We've sent a 6-digit verification code to your email address.
              </p>
              <p className="text-purple-200 text-sm">
                This code will expire in 10 minutes for security reasons.
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="md:w-1/2 p-8 md:p-12">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 transform transition-transform duration-300 hover:scale-110">
                  <CheckCircle className="text-white w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Verify OTP</h2>
                <p className="text-gray-600">Enter the code sent to your email</p>
                {email && (
                  <p className="text-sm text-gray-500 mt-2 bg-gray-50 px-3 py-1 rounded-full inline-block">
                    {email}
                  </p>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 animate-shake">
                  {error}
                </div>
              )}

              {resendMessage && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6">
                  {resendMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative group">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-center text-xl font-semibold tracking-widest transition-all duration-300 group-hover:border-purple-400"
                    placeholder="Enter OTP"
                    maxLength={6}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 focus:ring-4 focus:ring-purple-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isVerifying ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                      Verifying...
                    </div>
                  ) : (
                    'Verify OTP'
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isResending}
                    className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium transition-colors duration-300 disabled:opacity-50"
                  >
                    <RotateCcw className={`w-4 h-4 mr-2 ${isResending ? 'animate-spin' : ''}`} />
                    {isResending ? 'Sending...' : 'Resend OTP'}
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-500 text-sm">
                  Didn't receive the code? Check your spam folder or try resending.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OTPVerify;