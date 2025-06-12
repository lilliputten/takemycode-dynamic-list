-- Create session data table
create table if not exists session_data (
  sid varchar not null references session (sid) on delete cascade,
  filter text,

  constraint session_data_pkey primary key (sid)
);

-- Create checked records table
create table if not exists checked_records (
  sid varchar not null references session (sid) on delete cascade,
  record_id integer not null,
  checked boolean not null,

  constraint checked_records_pkey primary key(sid, record_id)
);

-- Create records order table
create table if not exists sorted_records (
  sid varchar not null references session (sid) on delete cascade,

  -- Source record id
  record_id integer not null,
  -- Target record id
  target_id integer not null,

  -- NOTE: If sourceIndex > targetIndex then source item should be inserted after target, otherwise before

  constraint sorted_records_pkey primary key(sid, record_id)
);

--  -- EXAMPLE: Add session, session data and checkd records and delete both by deleting the session (via cascade)
--
--  insert into session values ('xxx', '{}', NOW())
--    on conflict do nothing;
--  -- Save filter value into session data
--  insert into session_data values ('xxx', 'Filter')
--    on conflict do nothing;
--  -- Update filter value
--  insert into session_data (sid, filter) values ('xxx', 'Updated')
--    on conflict (sid) do update
--    set filter='Updated';
--
--  -- Add checked value
--  insert into checked_records (sid, record_id, checked) values ('xxx', 1, true)
--    on conflict do nothing;
--  -- Delete checked value
--  delete from checked_records WHERE sid='xxx' and record_id=1;
--
--  -- Add sorted record
--  insert into sorted_records (sid, record_id, target_id) values ('xxx', 1, 2)
--    on conflict do nothing;
--  -- Update sorted record
--  insert into sorted_records (sid, record_id, target_id) values ('xxx', 1, 9)
--    on conflict (sid, record_id) do update
--    set target_id=9;
--
--  -- Delete the session and all the cascaded data
--  delete from session WHERE sid='xxx';
