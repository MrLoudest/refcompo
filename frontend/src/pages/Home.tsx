import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import Header from '../components/Header';
import { useAppStore } from '../state/appStore';
import type { ApiResponse, Health } from '@refcompo/shared';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const increment = useAppStore((s) => s.increment);
  const count = useAppStore((s) => s.count);
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Health>>('/api/health');
      return res.data;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-100 text-slate-900">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-10 space-y-6">
        <section className="space-y-3">
          <h2 className="text-lg font-medium">Authentication</h2>
          {loading ? (
            <div>Loading session…</div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="text-slate-700">Signed in as {user.email}</span>
              <button
                onClick={signOut}
                className="rounded bg-slate-900 text-white px-3 py-1.5 hover:bg-slate-800"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="rounded bg-red-600 text-white px-4 py-2 hover:bg-red-500"
            >
              Continue with Google
            </button>
          )}
        </section>
        <section className="space-y-2">
          <h1 className="text-2xl font-semibold">RefCompo Starter</h1>
          <p className="text-slate-700">
            Frontend at <code className="px-1 rounded bg-slate-200">5173</code> • Backend at{' '}
            <code className="px-1 rounded bg-slate-200">3001</code>
          </p>
        </section>
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <button
              onClick={increment}
              className="rounded bg-slate-900 text-white px-4 py-2 hover:bg-slate-800"
            >
              Increment Zustand Counter
            </button>
            <span>Count: {count}</span>
          </div>
        </section>
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              className="rounded bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-500"
            >
              Ping Backend
            </button>
            {isLoading && <span>Loading…</span>}
            {error && <span className="text-red-600">Error: {(error as Error).message}</span>}
          </div>
          <pre className="rounded bg-slate-100 p-3 text-sm overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </section>
      </main>
    </div>
  );
}


