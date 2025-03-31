-- Create notifications table
create table if not exists notifications (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references auth.users(id),
  student_name text not null,
  student_email text not null,
  guardian_name text not null,
  guardian_email text not null,
  latitude double precision not null,
  longitude double precision not null,
  created_at timestamp with time zone default now(),
  sent_at timestamp with time zone,
  status text default 'pending'
);

-- Create function to handle notifications
create or replace function handle_notification()
returns trigger as $$
begin
  -- Here you can add additional logic for email sending
  -- For now, we'll just mark it as sent
  update notifications
  set status = 'sent',
      sent_at = now()
  where id = NEW.id;
  
  return NEW;
end;
$$ language plpgsql;

-- Create trigger to automatically process new notifications
create trigger process_notification
  after insert on notifications
  for each row
  execute function handle_notification();