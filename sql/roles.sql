-- Tabel roles
create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  name text unique not null
);

-- Tabel user_roles (relasi user ke role)
create table if not exists user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  role_id uuid references roles(id) on delete cascade
);

-- Seed roles
insert into roles (name) values ('admin') on conflict do nothing;
insert into roles (name) values ('user') on conflict do nothing;
