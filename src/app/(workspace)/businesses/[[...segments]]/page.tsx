// ExecutiveShell in the shared layout renders each business and section from the URL.
import { notFound } from 'next/navigation';
import { isBusinessRouteName } from '@/utils/businessRoutes';

export default async function BusinessRoute({
  params,
}: {
  params: Promise<{ segments?: string[] }>;
}) {
  const { segments = [] } = await params;
  if (segments.length > 2 || (segments.length === 2 && !isBusinessRouteName(segments[1]))) {
    notFound();
  }

  return null;
}
