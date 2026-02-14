'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Job } from '@/lib/supabaseClient';
import JobCard from './components/JobCard';
import { User, Subscription } from '@supabase/supabase-js';

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      window.location.href = `/jobs?search=${encodeURIComponent(search)}`;
    }
  };

  // Tambahkan state user
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const res = await fetch('/api/jobs?limit=6');
        const data = await res.json();
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedJobs();

    let subscription: Subscription;
    const getSessionAndRole = async () => {
      const { supabase } = await import("@/lib/supabaseClient");
      const { getUserRole } = await import("@/lib/auth");
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      if (session?.user) {
        const userRole = await getUserRole(session.user.id);
        setRole(userRole);
      } else {
        setRole(null);
      }

      const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          const userRole = await getUserRole(session.user.id);
          setRole(userRole);
        } else {
          setRole(null);
        }
      });
      subscription = data.subscription;
    };
    getSessionAndRole();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-linear-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Temukan Pekerjaan Impian Anda
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Jelajahi ribuan lowongan kerja dari perusahaan terbaik
            </p>
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Cari posisi, perusahaan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-6 py-3 rounded-lg bg-white text-gray-900 border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-lg font-semibold text-white transition"
              >
                Cari
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-2">Lowongan Terbaru</h2>
            <p className="text-gray-600">
              Jangan lewatkan kesempatan emas untuk bergabung dengan tim terbaik
            </p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
              <div className="text-center">
                <Link
                  href="/jobs"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
                >
                  Lihat Semua Lowongan
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Belum ada lowongan tersedia</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {user ? (
            <>
              <h2 className="text-2xl font-bold mb-4">Selamat Datang!</h2>
              <p className="text-gray-600 mb-8">Akses dashboard Anda untuk mengelola data dan melihat aktivitas akun.</p>
              <Link
                href={role === "admin" ? "/admin" : "/dashboard"}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
              >
                Ke Dashboard
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4">Siap untuk Langkah Berikutnya?</h2>
              <p className="text-gray-600 mb-8">Daftar dan temukan lowongan kerja impianmu, atau login untuk melamar pekerjaan!</p>
              <div className="flex justify-center gap-4">
                <Link
                  href="/login"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition"
                >
                  Register
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
