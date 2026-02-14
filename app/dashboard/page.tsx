"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserDashboard() {
  const [user, setUser] = useState<{name:string,email:string}|null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Demo: hardcoded user
    setUser({ name: "Demo User", email: "user@demo.com" });
    // Fetch jobs applied (dummy)
    setJobs([
      { id: 1, title: "Frontend Developer", company: "PT Maju Mundur" },
      { id: 2, title: "Backend Developer", company: "PT Coding Jaya" },
    ]);
  }, []);

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Dashboard User</h1>
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <div><b>Nama:</b> {user.name}</div>
        <div><b>Email:</b> {user.email}</div>
      </div>
      <h2 className="text-xl font-semibold mb-2">Daftar Lowongan yang Diikuti</h2>
      <ul className="space-y-2">
        {jobs.map(job => (
          <li key={job.id} className="p-3 bg-white rounded shadow flex flex-col md:flex-row md:items-center md:justify-between">
            <span>{job.title} <span className="text-gray-500">({job.company})</span></span>
            <a href={`/jobs/${job.id}`} className="text-blue-600 hover:underline mt-2 md:mt-0">Lihat Detail</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
