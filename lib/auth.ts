import { supabase } from "./supabaseClient";

export async function signUpWithRole({ email, password, name, role }: { email: string; password: string; name: string; role: string }) {
  // 1. Register user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } }
  });
  if (error) return { error };
  const user = data.user;
  if (!user) return { error: { message: "User not created" } };

  // 2. Get role id
  const { data: roles, error: roleErr } = await supabase.from("roles").select("id").eq("name", role).single();
  if (roleErr) return { error: roleErr };
  // 3. Insert user_roles
  const { error: urErr } = await supabase.from("user_roles").insert({ user_id: user.id, role_id: roles.id });
  if (urErr) return { error: urErr };
  return { user };
}

export async function signIn({ email, password }: { email: string; password: string }) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function getUserRole(user_id: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("roles(name)")
    .eq("user_id", user_id)
    .single();
  if (error) return null;
  return data?.roles[0]?.name || null;
}
