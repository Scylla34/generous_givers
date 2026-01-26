-- Update notifications type check constraint to include event types
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;

ALTER TABLE notifications ADD CONSTRAINT notifications_type_check 
CHECK (type IN (
    'DONATION_RECEIVED',
    'DONATION_COMPLETED', 
    'DONATION_FAILED',
    'PROJECT_CREATED',
    'PROJECT_UPDATED',
    'PROJECT_COMPLETED',
    'PROJECT_DELETED',
    'VISIT_SCHEDULED',
    'VISIT_COMPLETED',
    'USER_REGISTERED',
    'SYSTEM_ALERT',
    'EVENT_REMINDER',
    'EVENT_CREATED',
    'EVENT_UPDATED',
    'EVENT_DELETED'
));