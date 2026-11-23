-- Tawfiq Design Hub: Supabase schema, RLS, storage. Run in Supabase SQL Editor.
create extension if not exists pgcrypto;
create table categories(id uuid primary key default gen_random_uuid(),name text not null,slug text unique not null,icon text,description text,sort_order int default 0,created_at timestamptz default now());
create table resources(id uuid primary key default gen_random_uuid(),title text not null,slug text unique not null,description text,
 category_id uuid references categories(id) on delete set null,preview_image text,preview_images text[] default '{}',file_path text not null,file_name text,file_type text,file_size bigint,
 download_count bigint default 0,featured boolean default false,status text default 'draft' check(status in('draft','published')),tags text[] default '{}',
 created_at timestamptz default now(),updated_at timestamptz default now());
create table site_settings(id int primary key default 1 check(id=1),site_name text default 'Tawfiq Design Hub',site_description text,owner_name text default 'মোঃ তাওফীকুর রহমান',owner_title text default 'গ্রাফিক ডিজাইনার ও ডিজিটাল রিসোর্স নির্মাতা',
 mobile_number text default '01941933085',whatsapp_number text default '01974933285',facebook_url text,profile_image text,about_text text,updated_at timestamptz default now());
insert into site_settings(id) values(1) on conflict do nothing;
create index on resources(category_id);create index on resources(status,created_at desc);create index on resources(download_count desc);
create index on resources using gin(tags);
create index on resources using gin(to_tsvector('simple',coalesce(title,'')||' '||coalesce(description,'')));
create table download_log(id bigserial primary key,resource_id uuid references resources(id) on delete cascade,ip_hash text,created_at timestamptz default now());
create index on download_log(resource_id,ip_hash,created_at);
create function is_admin() returns boolean language sql stable as $$ select coalesce(auth.jwt()->'app_metadata'->>'role','')='admin' $$;
-- Abuse-limited counter: one count per IP hash per resource per hour. Called only from the server (service role).
create function register_download(rid uuid,iph text) returns boolean language plpgsql security definer set search_path=public as $$
begin
 if exists(select 1 from download_log where resource_id=rid and ip_hash=iph and created_at>now()-interval '1 hour') then return false; end if;
 insert into download_log(resource_id,ip_hash) values(rid,iph);
 update resources set download_count=download_count+1 where id=rid and status='published'; return true; end $$;
revoke all on function register_download from public,anon,authenticated;
alter table categories enable row level security;alter table resources enable row level security;alter table site_settings enable row level security;alter table download_log enable row level security;
create policy cat_read on categories for select using(true);
create policy cat_admin on categories for all using(is_admin()) with check(is_admin());
create policy res_read on resources for select using(status='published' or is_admin());
create policy res_admin on resources for all using(is_admin()) with check(is_admin());
create policy set_read on site_settings for select using(true);
create policy set_admin on site_settings for update using(is_admin()) with check(is_admin());
-- Storage: public previews, private files (downloads via signed URL from server only)
insert into storage.buckets(id,name,public) values('previews','previews',true),('resource-files','resource-files',false),('site','site',true) on conflict do nothing;
create policy prev_read on storage.objects for select using(bucket_id in('previews','site'));
create policy st_admin on storage.objects for all using(is_admin()) with check(is_admin());
-- After creating your single user in Authentication > Users, run:
-- update auth.users set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}' where email='YOUR_EMAIL';
