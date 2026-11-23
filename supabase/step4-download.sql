-- ধাপ ৪: ডাউনলোড API-এর জন্য (schema.sql চালানোর পরে চালান; বারবার চালালেও সমস্যা নেই)
alter table download_log add column if not exists counted boolean not null default false;
create index if not exists download_log_ip_time on download_log(ip_hash, created_at desc);

-- এক কলেই: প্রকাশিত কিনা যাচাই + IP হারের সীমা + (ঘণ্টায় একবার/IP/রিসোর্স) কাউন্টার আপডেট + ফাইল পাথ ফেরত
create or replace function begin_download(rid uuid, iph text, do_count boolean default true, max_per_window int default 20, window_minutes int default 10)
returns table(out_status text, out_path text, out_name text)
language plpgsql security definer set search_path = public as $$
declare r resources%rowtype; first_time boolean;
begin
  select * into r from resources where resources.id = rid and resources.status = 'published';
  if not found then return query select 'not_found'::text, null::text, null::text; return; end if;
  if (select count(*) from download_log d where d.ip_hash = iph and d.created_at > now() - make_interval(mins => window_minutes)) >= max_per_window then
    return query select 'rate_limited'::text, null::text, null::text; return;
  end if;
  first_time := do_count and not exists (select 1 from download_log d where d.resource_id = rid and d.ip_hash = iph and d.counted and d.created_at > now() - interval '1 hour');
  insert into download_log(resource_id, ip_hash, counted) values (rid, iph, first_time);
  if first_time then update resources set download_count = download_count + 1 where resources.id = rid; end if;
  if random() < 0.01 then delete from download_log where created_at < now() - interval '30 days'; end if;
  return query select 'ok'::text, r.file_path, r.file_name;
end $$;
revoke all on function begin_download(uuid, text, boolean, int, int) from public, anon, authenticated;
grant execute on function begin_download(uuid, text, boolean, int, int) to service_role;
