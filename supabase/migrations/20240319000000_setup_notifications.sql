-- Create notification status enum
create type notification_status as enum (
    'pending',
    'processing',
    'queued',
    'sent',
    'failed',
    'cors_error',
    'network_error',
    'retry_scheduled'
);

-- Create notifications table if it doesn't exist
create table if not exists public.notifications (
    id uuid default gen_random_uuid() primary key,
    student_id uuid references auth.users(id),
    student_name text not null,
    student_email text not null,
    guardian_name text not null,
    guardian_email text not null,
    latitude double precision not null,
    longitude double precision not null,
    created_at timestamptz default now(),
    sent_at timestamptz,
    status notification_status default 'pending',
    error_message text,
    service_name text default 'email-service',
    retry_count int default 0,
    last_error_code text,
    next_retry_at timestamptz,
    cors_origin text,
    request_headers jsonb
);

-- Create function to schedule retry
create or replace function schedule_notification_retry(
    p_notification_id uuid,
    p_delay_minutes int default 5
)
returns void as $$
begin
    update public.notifications
    set status = 'retry_scheduled'::notification_status,
        next_retry_at = now() + (p_delay_minutes || ' minutes')::interval,
        retry_count = retry_count + 1
    where id = p_notification_id;
end;
$$ language plpgsql;

-- Update handle_failed_notification function
create or replace function handle_failed_notification(
    p_notification_id uuid,
    p_error_type text,
    p_error_message text,
    p_cors_origin text default null,
    p_request_headers jsonb default null
)
returns void as $$
declare
    max_retries constant int := 3;
    v_current_retry int;
begin
    select retry_count into v_current_retry
    from public.notifications
    where id = p_notification_id;

    if v_current_retry < max_retries then
        perform schedule_notification_retry(p_notification_id);
    else
        update public.notifications
        set status = case 
                when p_error_type = 'CORS' then 'cors_error'::notification_status
                when p_error_type = 'NETWORK' then 'network_error'::notification_status
                else 'failed'::notification_status
            end,
            error_message = p_error_message,
            cors_origin = p_cors_origin,
            request_headers = p_request_headers,
            sent_at = now()
        where id = p_notification_id;
    end if;
end;
$$ language plpgsql;

-- Update process_notification function
create or replace function process_notification()
returns trigger as $$
declare
    max_retries constant int := 3;
begin
    if NEW.status = 'failed' or NEW.status = 'cors_error' or NEW.status = 'network_error' then
        if NEW.retry_count < max_retries then
            update public.notifications
            set status = 'queued'::notification_status,
                retry_count = retry_count + 1
            where id = NEW.id;
        end if;
    else
        update public.notifications
        set status = 'processing'::notification_status,
            sent_at = now()
        where id = NEW.id;
    end if;

    return NEW;
end;
$$ language plpgsql;

-- Create trigger for notification processing
create trigger notification_after_insert
    after insert on public.notifications
    for each row
    execute function process_notification();

-- Enable RLS
alter table public.notifications enable row level security;

-- Allow service role full access
create policy "Service role can access everything"
on public.notifications
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

-- Allow authenticated users to view their own notifications
create policy "Users can view their own notifications"
on public.notifications
for select
using (auth.uid() = student_id);

-- Allow authenticated users to insert their own notifications
create policy "Users can insert their own notifications"
on public.notifications
for insert
with check (auth.uid() = student_id);

-- Create index for better query performance
create index if not exists idx_notifications_student_id 
on public.notifications(student_id);

-- Grant necessary permissions
grant usage on schema public to service_role, authenticated, anon;
grant all on public.notifications to service_role;
grant select, insert on public.notifications to authenticated;