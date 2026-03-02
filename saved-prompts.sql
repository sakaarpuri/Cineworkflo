create table if not exists public.saved_prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  idea text not null,
  prompt text not null,
  mood text,
  use_case text,
  skill_level text,
  include_audio_sfx boolean not null default false,
  include_image_details boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create unique index if not exists saved_prompts_user_prompt_unique
  on public.saved_prompts (user_id, prompt);

alter table public.saved_prompts enable row level security;

drop policy if exists "saved_prompts_select_own" on public.saved_prompts;
create policy "saved_prompts_select_own"
  on public.saved_prompts
  for select
  using (auth.uid() = user_id);

drop policy if exists "saved_prompts_insert_own" on public.saved_prompts;
create policy "saved_prompts_insert_own"
  on public.saved_prompts
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "saved_prompts_delete_own" on public.saved_prompts;
create policy "saved_prompts_delete_own"
  on public.saved_prompts
  for delete
  using (auth.uid() = user_id);
