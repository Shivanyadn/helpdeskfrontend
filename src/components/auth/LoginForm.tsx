import { useState, lazy, useEffect, memo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FiUser, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { ComponentType } from 'react';
import { IconBaseProps } from 'react-icons';

// Lazy load the password strength meter component only when needed
const PasswordStrengthMeter = lazy(() => import('@/components/auth/PasswordStrengthMeter'));

// Fixed helper component to render icons properly with TypeScript
const Icon = ({ icon: IconComponent }: { icon: ComponentType<IconBaseProps> }) => {
  return IconComponent ? <IconComponent size={20} /> : null;
};

interface LoginFormProps {
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

// Memoize the component to prevent unnecessary re-renders
const LoginForm = memo(({ 
  username, 
  setUsername, 
  password, 
  setPassword, 
  handleSubmit 
}: LoginFormProps) => {
  const { isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [showStrengthMeter, setShowStrengthMeter] = useState(false);
  const [formReady, setFormReady] = useState(false);

  // Check if form is ready to submit (both fields have values)
  useEffect(() => {
    setFormReady(username.length > 0 && password.length > 0);
  }, [username, password]);

  // Enhanced animation variants
  const inputVariants = {
    focused: { scale: 1.01, borderColor: "#6366f1", boxShadow: "0 0 0 2px rgba(99, 102, 241, 0.2)" },
    unfocused: { scale: 1, borderColor: "#e5e7eb", boxShadow: "none" },
    filled: { scale: 1, borderColor: "#10b981", boxShadow: "none" }
  };

  // Handle password focus
  const handlePasswordFocus = () => {
    setFocused('password');
    if (password.length > 0) {
      setShowStrengthMeter(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-1">Account Details</h3>
      
      {/* Username field with enhanced styling */}
      <motion.div 
        className="relative group"
        initial="unfocused"
        animate={focused === 'username' ? "focused" : username ? "filled" : "unfocused"}
        variants={inputVariants}
        transition={{ duration: 0.2 }}
      >
        <label 
          htmlFor="username" 
          className={`absolute left-10 transition-all duration-200 pointer-events-none ${
            focused === 'username' || username 
              ? '-top-2 text-xs bg-white dark:bg-gray-800 px-1 text-indigo-500' 
              : 'top-3 text-gray-500'
          }`}
        >
          Username
        </label>
        <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-colors ${focused === 'username' || username ? 'text-indigo-500' : 'text-gray-500'}`}>
        <Icon icon={FiUser as ComponentType<IconBaseProps>} />
        </div>
        <input
          type="text"
          id="username"
          className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none transition-all duration-200 dark:bg-gray-800/50 dark:border-gray-600 dark:text-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onFocus={() => setFocused('username')}
          onBlur={() => setFocused(null)}
          autoComplete="username"
        />
        {username && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-3 top-3 text-green-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5"></path>
            </svg>
          </motion.div>
        )}
      </motion.div>

      {/* Password field with enhanced styling */}
      <motion.div 
        className="relative group"
        initial="unfocused"
        animate={focused === 'password' ? "focused" : password ? "filled" : "unfocused"}
        variants={inputVariants}
        transition={{ duration: 0.2 }}
      >
        <label 
          htmlFor="password" 
          className={`absolute left-10 transition-all duration-200 pointer-events-none ${
            focused === 'password' || password 
              ? '-top-2 text-xs bg-white dark:bg-gray-800 px-1 text-indigo-500' 
              : 'top-3 text-gray-500'
          }`}
        >
          Password
        </label>
        <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-colors ${focused === 'password' || password ? 'text-indigo-500' : 'text-gray-500'}`}>
        <Icon icon={FiLock as ComponentType<IconBaseProps>} />

        </div>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          className="w-full pl-10 pr-12 py-3 rounded-xl border focus:outline-none transition-all duration-200 dark:bg-gray-800/50 dark:border-gray-600 dark:text-white"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (e.target.value && focused === 'password') {
              setShowStrengthMeter(true);
            } else {
              setShowStrengthMeter(false);
            }
          }}
          onFocus={handlePasswordFocus}
          onBlur={() => {
            setFocused(null);
            setTimeout(() => setShowStrengthMeter(false), 200);
          }}
          autoComplete="current-password"
        />
        <button 
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword
  ? <Icon icon={FiEyeOff as ComponentType<IconBaseProps>} />
  : <Icon icon={FiEye as ComponentType<IconBaseProps>} />}

        </button>
        
        {/* Password strength meter (conditionally rendered) */}
        {showStrengthMeter && password && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1"
          >
            <PasswordStrengthMeter password={password} />
          </motion.div>
        )}
      </motion.div>

      {/* Remember me checkbox with improved styling */}
      <div className="flex items-center justify-between">
        <label className="inline-flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors cursor-pointer"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            Remember me
          </span>
        </label>
        
        <a
          href="#"
          className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors"
        >
          Forgot password?
        </a>
      </div>

      {/* Login button with enhanced animation */}
      <motion.button
        type="submit"
        disabled={isLoading || !formReady}
        whileHover={formReady ? { scale: 1.02 } : {}}
        whileTap={formReady ? { scale: 0.98 } : {}}
        className={`w-full py-3.5 px-4 flex items-center justify-center gap-2 text-white rounded-xl transition-all shadow-md hover:shadow-lg transform disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none ${
          formReady 
            ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700' 
            : 'bg-gray-400'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Authenticating...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <span>Sign In</span>
            <Icon icon={FiArrowRight as ComponentType<IconBaseProps>} />
          </div>
        )}
      </motion.button>
    </form>
  );
});

LoginForm.displayName = 'LoginForm';
export default LoginForm;