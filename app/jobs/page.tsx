
import { Suspense } from 'react';
import JobsPage from './JobsPage';

export default function JobsPageWrapper() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <JobsPage />
    </Suspense>
  );
}
