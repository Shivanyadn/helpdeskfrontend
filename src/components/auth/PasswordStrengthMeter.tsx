import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface PasswordStrengthMeterProps {
  password: string;
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const [strength, setStrength] = useState(0);
  const [label, setLabel] = useState('');
  const [color, setColor] = useState('');
  const [tips, setTips] = useState<string[]>([]);

  useEffect(() => {
    // Calculate password strength
    let calculatedStrength = 0;
    const newTips: string[] = [];
    
    // Length check
    if (password.length < 6) {
      newTips.push('Use at least 6 characters');
    } else if (password.length < 9) {
      calculatedStrength += 1;
      newTips.push('Consider using a longer password');
    } else {
      calculatedStrength += 2;
    }
    
    // Complexity checks
    if (!/[A-Z]/.test(password)) {
      newTips.push('Add uppercase letters');
    } else {
      calculatedStrength += 1;
    }
    
    if (!/[0-9]/.test(password)) {
      newTips.push('Add numbers');
    } else {
      calculatedStrength += 1;
    }
    
    if (!/[^A-Za-z0-9]/.test(password)) {
      newTips.push('Add special characters');
    } else {
      calculatedStrength += 1;
    }
    
    // Set strength level (0-5)
    setStrength(calculatedStrength);
    setTips(newTips);
    
    // Set label and color based on strength
    switch (calculatedStrength) {
      case 0:
        setLabel('Very Weak');
        setColor('bg-red-500');
        break;
      case 1:
        setLabel('Weak');
        setColor('bg-red-400');
        break;
      case 2:
        setLabel('Fair');
        setColor('bg-yellow-500');
        break;
      case 3:
        setLabel('Good');
        setColor('bg-yellow-400');
        break;
      case 4:
        setLabel('Strong');
        setColor('bg-green-400');
        break;
      case 5:
        setLabel('Very Strong');
        setColor('bg-green-500');
        break;
      default:
        setLabel('');
        setColor('bg-gray-300');
    }
  }, [password]);

  return (
    <div className="w-full space-y-2 p-2 bg-gray-50 dark:bg-gray-800/60 rounded-lg">
      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-500 dark:text-gray-400">Password Strength:</span>
        <motion.span 
          key={label}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`font-medium px-2 py-0.5 rounded ${
            strength <= 1 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
            strength <= 3 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 
            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          }`}
        >
          {label}
        </motion.span>
      </div>
      
      <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div 
          className={`h-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${(strength / 5) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {tips.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="text-xs text-gray-600 dark:text-gray-400 mt-1"
        >
          <p className="font-medium mb-1">Tips to improve:</p>
          <ul className="list-disc pl-4 space-y-0.5">
            {tips.map((tip, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {tip}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}