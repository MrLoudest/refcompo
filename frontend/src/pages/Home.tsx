import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { ApiResponse, Health } from '@refcompo/shared';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Icon, type IconName } from '../components/ui/Icon';

export default function Home() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Health>>('/api/health');
      return res.data;
    }
  });

  return (
    <div className="py-12 space-y-12">
      <section className="text-center space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight">Create perfectly formatted citations</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Generate APA 7, Harvard, MLA, or Chicago references using deterministic templates. Autofill
          metadata by ISBN or DOI, edit, and export your reference list.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/create">
            <Button>Start a reference</Button>
          </Link>
          <Link to="/references">
            <Button variant="secondary">View your list</Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {([
          {
            icon: 'Search',
            title: 'Metadata lookup',
            desc: 'Fetch by ISBN or DOI with input validation.'
          },
          {
            icon: 'BadgeCheck',
            title: 'Deterministic rules',
            desc: 'No AI. Style-specific formatters you can trust.'
          },
          {
            icon: 'ListChecks',
            title: 'Manage your list',
            desc: 'Edit, reorder, delete, copy, and export.'
          }
        ] as { icon: IconName; title: string; desc: string }[]).map((f) => (
          <Card key={f.title}>
            <CardHeader className="flex items-center gap-3">
              <Icon name={f.icon} className="h-5 w-5 text-slate-800" />
              <div className="font-medium">{f.title}</div>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">{f.desc}</CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <Button onClick={() => refetch()}>Ping Backend</Button>
          {isLoading && <span>Loading…</span>}
          {error && <span className="text-red-600">Error: {(error as Error).message}</span>}
        </div>
        <pre className="rounded bg-slate-100 p-3 text-sm overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </section>
    </div>
  );
}


