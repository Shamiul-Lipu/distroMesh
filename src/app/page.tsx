import type { Metadata } from 'next';
import { DistroMeshLanding } from '../components/marketing/DistroMeshLanding';

export const metadata: Metadata = {
  title: 'distroMesh | Distribution management across every business',
  description: 'Review your distribution business portfolio, investigate what needs attention, and keep each workspace distinct.',
};

export default function HomePage() {
  return <DistroMeshLanding />;
}
