import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Activity, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthProps {
  onAuthComplete: (user: { name: string; email: string }) => void;
}

export default function Auth({ onAuthComplete }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onAuthComplete({
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
    });
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 rounded-3xl bg-white p-8 shadow-2xl shadow-emerald-100 border border-gray-100"
      >
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xl shadow-emerald-200">
            <Activity size={32} />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-gray-900">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {isLogin ? 'Sign in to access SEO Pulse' : 'Join Muhammad Usman Umar\'s SEO Pulse'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative"
                >
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-3 text-sm transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                    placeholder="Full Name"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-3 text-sm transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                placeholder="Email address"
              />
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-3 text-sm transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700 hover:shadow-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:bg-emerald-400"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Sign Up'}
                  <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={18} />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-medium text-emerald-600 hover:text-emerald-500"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-6 text-center">
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
            Developed by Muhammad Usman Umar
          </p>
        </div>
      </motion.div>
    </div>
  );
}
