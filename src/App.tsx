/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import Auth from './components/Auth';

export default function App() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const handleAuthComplete = (userData: { name: string; email: string }) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {user ? (
        <ChatInterface userName={user.name} onLogout={handleLogout} />
      ) : (
        <Auth onAuthComplete={handleAuthComplete} />
      )}
    </div>
  );
}
