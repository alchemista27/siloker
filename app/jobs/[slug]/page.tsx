import { Metadata } from 'next';
import Link from 'next/link';
import ApplyForm from '@/app/components/ApplyForm';
import { supabase, Job } from '@/lib/supabaseClient';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('slug', slug)
      .single();

    if (data) {
      return {
        title: `${data.title} - Siloker`,
        description: `Detail lowongan kerja untuk posisi ${data.title} di ${data.company}. Salary: Rp ${data.salary_min.toLocaleString('id-ID')} - Rp ${data.salary_max.toLocaleString('id-ID')}`,
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  return {
    title: 'Lowongan Kerja - Siloker',
    description: 'Detail lowongan kerja di Siloker',
  };
}

async function getJob(slug: string): Promise<Job | null> {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data as Job;
  } catch (error) {
    console.error('Error fetching job:', error);
    return null;
  }
}

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const job = await getJob(slug);

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Lowongan Tidak Ditemukan</h1>
            <p className="text-gray-600 mb-8">Lowongan yang Anda cari tidak ada atau sudah dihapus</p>
            <Link
              href="/jobs"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Kembali ke Daftar Lowongan
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formattedSalary = `Rp ${job.salary_min.toLocaleString('id-ID')} - Rp ${job.salary_max.toLocaleString('id-ID')}`;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/jobs" className="text-blue-600 hover:text-blue-700 font-semibold mb-8 flex items-center gap-2">
          <span>←</span> Kembali ke Daftar Lowongan
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <p className="text-xl text-gray-600 mb-6">{job.company}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-t border-b border-gray-200">
              <div>
                <p className="text-gray-600 text-sm">Lokasi</p>
                <p className="text-lg font-semibold text-gray-900">{job.location}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Range Gaji</p>
                <p className="text-lg font-semibold text-gray-900">{formattedSalary}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Posted</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(job.created_at).toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-sm max-w-none mb-8">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {job.description}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Apply Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">Kirim Aplikasi</h2>
              <ApplyForm jobId={job.id} />
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-bold mb-4">Info Lowongan</h3>
              <ul className="space-y-4">
                <li>
                  <p className="text-gray-600 text-sm">Perusahaan</p>
                  <p className="font-semibold text-gray-900">{job.company}</p>
                </li>
                <li>
                  <p className="text-gray-600 text-sm">Lokasi</p>
                  <p className="font-semibold text-gray-900">{job.location}</p>
                </li>
                <li>
                  <p className="text-gray-600 text-sm">Gaji</p>
                  <p className="font-semibold text-gray-900">{formattedSalary}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
