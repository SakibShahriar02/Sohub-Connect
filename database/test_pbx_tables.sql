-- Test if PBX tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('pbx_extensions', 'vb_callerid');

-- Check table structure
\d pbx_extensions;
\d vb_callerid;