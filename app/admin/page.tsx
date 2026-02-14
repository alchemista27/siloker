'use client';

import { useEffect, useState } from 'react';
import { Job } from '@/lib/supabaseClient';

export default function AdminPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary_min: '',
    salary_max: '',
    description: '',
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs?limit=100');
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newJob = {
      ...formData,
      slug: generateSlug(formData.title),
      salary_min: parseInt(formData.salary_min),
      salary_max: parseInt(formData.salary_max),
    };

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newJob),
      });

      if (!res.ok) throw new Error('Failed to create job');

      const createdJob = await res.json();
      setJobs([createdJob, ...jobs]);
      setFormData({
        title: '',
        company: '',
        location: '',
        salary_min: '',
        salary_max: '',
        description: '',
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Gagal membuat lowongan');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus lowongan ini?')) return;

    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete job');

      setJobs(jobs.filter(job => job.id !== id));
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Gagal menghapus lowongan');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-gray-600">Kelola lowongan kerja Anda</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            {showForm ? 'Batal' : '+ Tambah Lowongan'}
          </button>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Tambah Lowongan Baru</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Posisi
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Frontend Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Perusahaan
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="PT Teknologi Indonesia"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gaji Minimum (Rp)
                  </label>
                  <input
                    type="number"
                    name="salary_min"
                    value={formData.salary_min}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10000000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gaji Maksimum (Rp)
                  </label>
                  <input
                    type="number"
                    name="salary_max"
                    value={formData.salary_max}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="15000000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lokasi
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Jakarta"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Pekerjaan
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Deskripsikan detail pekerjaan, requirement, dan benefit..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Tambah Lowongan
              </button>
            </form>
          </div>
        )}

        {/* Jobs List Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold">Daftar Lowongan</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : jobs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">
                      Judul
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">
                      Perusahaan
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">
                      Lokasi
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">
                      Gaji
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-8 py-4 text-sm text-gray-900 font-medium">
                        {job.title}
                      </td>
                      <td className="px-8 py-4 text-sm text-gray-600">
                        {job.company}
                      </td>
                      <td className="px-8 py-4 text-sm text-gray-600">
                        {job.location}
                      </td>
                      <td className="px-8 py-4 text-sm text-gray-600">
                        Rp {job.salary_min.toLocaleString('id-ID')} - Rp{' '}
                        {job.salary_max.toLocaleString('id-ID')}
                      </td>
                      <td className="px-8 py-4 text-sm">
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="text-red-600 hover:text-red-700 font-semibold"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-600">Belum ada lowongan. Buat lowongan baru untuk memulai.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
