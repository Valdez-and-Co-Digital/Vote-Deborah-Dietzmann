const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const url = env.split('\n').find(l => l.startsWith('NEXT_PUBLIC_SUPABASE_URL=')).split('=')[1].trim();
let key = env.split('\n').find(l => l.startsWith('SUPABASE_SERVICE_ROLE_KEY=')).split('=')[1].trim();
if(key.startsWith('"')) key = key.slice(1,-1);
const supabase = createClient(url, key);

async function run() {
    // Try to get trigger information
    const { data: triggers, error: triggerError } = await supabase.rpc('get_triggers');
    if (triggerError) {
        console.log("Could not use RPC. Querying raw postgres triggers through REST may not be possible directly.");
        // Instead let's just try to INSERT with service_role to trigger the error and see if it's indeed a trigger
        const { error: insertError } = await supabase.from('events').insert([{
            title: 'Test Event ' + Date.now(),
            description: 'Test',
            location: 'Test Location',
            date: new Date().toISOString(),
            capacity: 100,
            category: 'Test Category'
        }]);
        console.log('Insert Error:', insertError);
    } else {
        console.log('Triggers:', triggers);
    }
}
run();
