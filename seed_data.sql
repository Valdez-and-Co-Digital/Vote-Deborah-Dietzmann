-- Seed Events
INSERT INTO events (id, title, description, location, event_date, capacity, created_at)
VALUES 
  (gen_random_uuid(), 'Town Hall Meet & Greet', 'Join Deborah for a discussion on local issues.', 'Community Center', current_date + interval '3 days', 100, current_date - interval '2 days'),
  (gen_random_uuid(), 'Weekend Canvassing', 'Knocking on doors in District 4.', 'Campaign HQ', current_date + interval '5 days', 50, current_date - interval '1 days'),
  (gen_random_uuid(), 'Phone Bank Tuesday', 'Help us reach voters by phone.', 'Virtual / Campaign HQ', current_date + interval '7 days', 30, current_date),
  (gen_random_uuid(), 'Fundraising Dinner', 'Gala dinner to support the campaign.', 'Riverside Hotel', current_date - interval '14 days', 200, current_date - interval '30 days');

-- Seed Volunteers
INSERT INTO volunteers (id, first_name, last_name, email, phone, interest_door_knocking, interest_phone_banking, interest_host_event, interest_other, status, created_at)
VALUES 
  (gen_random_uuid(), 'Alice', 'Smith', 'alice.smith@example.com', '555-0101', true, false, false, false, 'active', current_date - interval '10 days'),
  (gen_random_uuid(), 'Bob', 'Johnson', 'bob.j@example.com', '555-0102', false, true, false, false, 'new', current_date - interval '2 days'),
  (gen_random_uuid(), 'Carol', 'Williams', 'carol.w@example.com', '555-0103', true, true, false, false, 'contacted', current_date - interval '5 days'),
  (gen_random_uuid(), 'David', 'Brown', 'david.b@example.com', '555-0104', false, false, true, false, 'new', current_date - interval '1 days'),
  (gen_random_uuid(), 'Eve', 'Davis', 'eve.d@example.com', '555-0105', true, false, false, true, 'active', current_date - interval '15 days');
