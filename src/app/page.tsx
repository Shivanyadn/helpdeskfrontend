'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect, Suspense, useCallback } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { MdOutlineDarkMode, MdLightMode } from 'react-icons/md';
import { FiAlertCircle, FiCheckCircle, FiCoffee, FiShield, FiUsers } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { ComponentType } from 'react';
import { IconBaseProps } from 'react-icons';

// Optimized lazy loading with reduced bundle size
const LoginForm = dynamic(() => import('@/components/auth/LoginForm'), {
  loading: () => <LoginFormSkeleton />,
  ssr: false
});

const LightIcon = MdLightMode as ComponentType<IconBaseProps>;
const DarkIcon = MdOutlineDarkMode as ComponentType<IconBaseProps>;

const CheckIcon = FiCheckCircle as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const AlertIcon = FiAlertCircle as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const GoogleIcon = FcGoogle as unknown as React.FC<React.SVGProps<SVGSVGElement>>;

// Enhanced skeleton loader
function LoginFormSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
      <div className="w-full h-14 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      <div className="w-full h-14 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      <div className="flex justify-between mt-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      </div>
      <div className="w-full h-14 bg-gray-300 dark:bg-gray-600 rounded-xl mt-4"></div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { login, error: authError } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'about'

  // Faster page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Optimized dark mode implementation
  useEffect(() => {
    // Check if dark mode preference exists in localStorage
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(savedDarkMode === 'true');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);
  
  // Apply dark mode to document - separated for performance
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
  }, [darkMode]);

  // Update the handleLogin function to properly store the token
  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
  
    // Validation
    if (!username || !password) {
      setError('Please fill in both fields.');
      return;
    }
  
    try {
      // Call the login function from auth context
      const success = await login(username, password);
      
      if (success) {
        // Get user from localStorage to determine role
        const userData = localStorage.getItem('user_data');
        if (userData) {
          const user = JSON.parse(userData);
          
          // Show success message
          setSuccessMessage(`Login successful! Welcome, ${user.username}.`);
          
          // Faster navigation
          setTimeout(() => {
            // Navigate based on role
            const role = user.role.toLowerCase();
            router.push(role === 'default' ? '/dashboard' : `/dashboard/${role}`);
          }, 800);
        }
      } else {
        // If login failed but no error was set in the auth context
        if (!authError) {
          setError('Login failed. Please check your credentials.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    }
  }, [username, password, login, authError, router]);

  const handleGoogleLogin = () => {
    alert('Google Login not implemented yet.');
  };
  

  // Features data for the about tab
  const features = [
    {
      icon: (() => {
        const Icon = FiUsers as ComponentType<IconBaseProps>;
        return <Icon className="w-6 h-6" />;
      })(),
      title: "User Management",
      description: "Efficiently manage user accounts, roles, and permissions."
    },
    {
      icon: (() => {
        const Icon = FiShield as ComponentType<IconBaseProps>;
        return <Icon className="w-6 h-6" />;
      })(),
      title: "Secure Access",
      description: "Advanced security features to protect sensitive data."
    },
    {
      icon: (() => {
        const Icon = FiCoffee as ComponentType<IconBaseProps>;
        return <Icon className="w-6 h-6" />;
      })(),
      title: "Intuitive Interface",
      description: "User-friendly design for improved productivity."
    }
  ];

  if (isPageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 dark:bg-gray-900">
        <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 relative">
              <div className="absolute inset-0 rounded-full bg-indigo-500 opacity-20 animate-ping"></div>
              <div className="relative flex items-center justify-center w-full h-full rounded-full bg-indigo-100 dark:bg-indigo-900">
                <span className="text-xl">🔧</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-xl mt-2 w-1/2 animate-pulse"></div>
            <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded-xl mt-4 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gradient-to-br from-indigo-50 to-blue-100 text-gray-800'}`}>
      {/* Left side - Illustration/Brand (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-blue-700 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {/* Enhanced background pattern */}
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {[...Array(10)].map((_, i) => (
              <motion.path
                key={i}
                d={`M${i * 10},100 Q${i * 10 + 5},${80 + Math.random() * 20} ${i * 10 + 10},100`}
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="0.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: 0.3,
                  d: `M${i * 10},100 Q${i * 10 + 5},${70 + Math.random() * 30} ${i * 10 + 10},100`
                }}
                transition={{ 
                  duration: 2 + i * 0.2, 
                  repeat: Infinity, 
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              />
            ))}
          </svg>
        </div>
        
        <motion.div 
          className="relative z-10 text-white text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <motion.div 
              className="w-20 h-20 mx-auto bg-white/10 rounded-2xl flex items-center justify-center"
              whileHover={{ rotate: 5, scale: 1.05 }}
            >
              <span className="text-5xl">🔧</span>
            </motion.div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">
            Helpdesk Management System
          </h1>
          
          <p className="text-xl mb-10 text-blue-100">
            Streamline your support operations with our powerful platform
          </p>
          
          {/* Tabs for switching content */}
          <div className="flex justify-center space-x-4 mb-8">
            <button 
              onClick={() => setActiveTab('login')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'login' 
                  ? 'bg-white/20 text-white' 
                  : 'text-blue-100 hover:bg-white/10'
              }`}
            >
              Login
            </button>
            <button 
              onClick={() => setActiveTab('about')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'about' 
                  ? 'bg-white/20 text-white' 
                  : 'text-blue-100 hover:bg-white/10'
              }`}
            >
              About
            </button>
          </div>
          
          <AnimatePresence mode="wait">
            {activeTab === 'login' ? (
              <motion.div 
                key="login-info"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <p className="text-lg text-blue-100">
                  Sign in to access your helpdesk dashboard and manage support tickets efficiently.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-white/10 p-4 rounded-xl">
                    <h3 className="font-semibold mb-2">Quick Access</h3>
                    <p className="text-sm text-blue-100">Streamlined login for fast dashboard access</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl">
                    <h3 className="font-semibold mb-2">Secure Login</h3>
                    <p className="text-sm text-blue-100">Advanced security protocols to protect your data</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="about-info"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <p className="text-lg text-blue-100">
                  Our helpdesk solution provides everything you need to deliver exceptional customer support.
                </p>
                
                <div className="space-y-4 mt-6">
                  {features.map((feature, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3 bg-white/10 p-4 rounded-xl"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{feature.title}</h3>
                        <p className="text-sm text-blue-100">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10">
        <motion.div 
          className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Background pattern */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-100 dark:bg-indigo-900/20 rounded-full opacity-50"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-50"></div>
          
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="absolute top-4 right-4 text-xl p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
            title="Toggle dark mode"
          >
            {darkMode ? <LightIcon className="text-yellow-500" /> : <DarkIcon className="text-indigo-600" />}
          </button>

          {/* Logo */}
          <div className="text-center mb-6 relative z-10">
            <motion.div 
              className="inline-block p-3 bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-2xl mb-3"
              whileHover={{ rotate: [0, -5, 5, -5, 0], transition: { duration: 0.5 } }}
            >
              <span className="text-3xl">🔧</span>
            </motion.div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
              Welcome Back
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Access your helpdesk dashboard
            </p>
          </div>

          {/* Success Message */}
          <AnimatePresence>
            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-300 p-4 rounded-lg mb-6" 
                role="alert"
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                  <CheckIcon className="w-5 h-5 mr-3" />
                  </div>
                  <span>{successMessage}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {(error || authError) && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-lg mb-6" 
                role="alert"
              >
                <div className="flex">
  <div className="flex-shrink-0">
    <AlertIcon className="w-5 h-5 mr-3" />
  </div>
  <span>{error || authError}</span>
</div>

              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <div className="relative z-10">
            <Suspense fallback={<LoginFormSkeleton />}>
              <LoginForm
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                handleSubmit={handleLogin}
              />
            </Suspense>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6 relative z-10">
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
            <span className="px-4 text-gray-500 dark:text-gray-400 text-sm">or continue with</span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
          </div>

          {/* Social Login */}
          <motion.button
  onClick={handleGoogleLogin}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl flex justify-center items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 relative z-10"
>
<GoogleIcon className="w-6 h-6 text-gray-600" />
  <span>Continue with Google</span>
</motion.button>


          {/* Additional help text */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6 relative z-10">
            Need assistance? Contact <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">IT Support</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}