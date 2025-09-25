import { useAuth } from '../context/AuthContext';

export function AuthDebug() {
  const { isAuthenticated, user } = useAuth();
  const token = localStorage.getItem('token');

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs max-w-xs">
      <div>Auth: {isAuthenticated ? '✅' : '❌'}</div>
      <div>User: {user?.username || 'None'}</div>
      <div>Token: {token ? '✅' : '❌'}</div>
    </div>
  );
}