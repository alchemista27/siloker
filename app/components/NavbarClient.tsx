"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { getUserRole } from "../../lib/auth";
import { User } from "@supabase/supabase-js";

export default function NavbarClient() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const getSessionAndRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      if (session?.user) {
        const userRole = await getUserRole(session.user.id);
        setRole(userRole);
      } else {
        setRole(null);
      }
    };
    getSessionAndRole();
    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        const userRole = await getUserRole(session.user.id);
        setRole(userRole);
      } else {
        setRole(null);
      }
    });
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold text-blue-600">
        Siloker
      </Link>
      <div className="flex gap-6">
        <Link href="/jobs" className="text-gray-600 hover:text-gray-900">
          Cari Lowongan
        </Link>
        <Link href="/about" className="text-gray-600 hover:text-gray-900">
          Tentang Kami
        </Link>
        <Link href="/faq" className="text-gray-600 hover:text-gray-900">
          FAQ
        </Link>
        {user === null ? (
          <>
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link href="/register" className="text-gray-600 hover:text-gray-900">
              Register
            </Link>
          </>
        ) : role === null ? null : (
          <>
            <Link href={role === "admin" ? "/admin" : "/dashboard"} className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <button
              className="text-gray-600 hover:text-gray-900"
              onClick={async () => {
                await supabase.auth.signOut();
              }}
              type="button"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
