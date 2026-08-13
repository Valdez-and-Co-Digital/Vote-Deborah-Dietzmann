-- 1. Create the Audit Logs Table
CREATE TABLE audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Allow admins to view the logs
CREATE POLICY "Admins can view audit logs" ON audit_logs FOR SELECT TO authenticated USING (true);
-- Allow the trigger function (which runs as authenticated user) to insert logs
CREATE POLICY "Admins can insert audit logs" ON audit_logs FOR INSERT TO authenticated WITH CHECK (true);

-- 4. Create the Trigger Function
-- This function automatically captures who made the change and what they changed
CREATE OR REPLACE FUNCTION log_audit_action()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (user_id, user_email, action, entity_type, entity_name)
  VALUES (
    auth.uid(), 
    (SELECT email FROM auth.users WHERE id = auth.uid()), -- Fetch the admin's email
    TG_OP, 
    TG_TABLE_NAME, 
    COALESCE(
      CASE WHEN TG_OP = 'DELETE' THEN OLD.title ELSE NEW.title END, 
      CASE WHEN TG_OP = 'DELETE' THEN OLD.name ELSE NEW.name END, 
      'Unknown'
    )
  );
  
  -- Required return for Postgres triggers
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Attach the Trigger to the Events Table
CREATE TRIGGER audit_events_trigger
AFTER INSERT OR UPDATE OR DELETE ON events
FOR EACH ROW EXECUTE FUNCTION log_audit_action();

-- 6. Attach the Trigger to the Volunteers Table
CREATE TRIGGER audit_volunteers_trigger
AFTER INSERT OR UPDATE OR DELETE ON volunteers
FOR EACH ROW EXECUTE FUNCTION log_audit_action();
