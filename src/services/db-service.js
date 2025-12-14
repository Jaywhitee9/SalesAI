const { supabase, getSystemUserId } = require('./supabase');

class DBService {

    // --- CALLS ---
    async saveCall(callData) {
        const userId = await getSystemUserId();

        try {
            const { data, error } = await supabase
                .from('calls')
                .insert({
                    agent_id: userId,
                    direction: 'outbound', // Defaulting for now
                    status: 'completed',
                    duration: Math.floor((Date.now() - callData.startTime) / 1000),
                    transcript: callData.transcripts,
                    // If we had a lead_id, we would add it here
                })
                .select()
                .single();

            if (error) throw error;

            // Save Summary
            if (callData.summary) {
                await supabase.from('call_summaries').insert({
                    call_id: data.id,
                    summary_text: callData.summary.summary, // Adjust structure based on LLM output
                    score: callData.summary.score,
                    successful: callData.summary.success
                });
            }

            console.log(`[Supabase] Saved call ${data.id}`);
            return data;
        } catch (err) {
            console.error('[Supabase] Save Call Error:', err);
            return null;
        }
    }

    async getRecentCalls(limit = 10) {
        try {
            const { data, error } = await supabase
                .from('calls')
                .select('*, call_summaries(*)')
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data;
        } catch (err) {
            console.error('[Supabase] Get Calls Error:', err);
            return [];
        }
    }

    // --- LEADS ---
    async getLeads() {
        try {
            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        } catch (err) {
            console.error('[Supabase] Get Leads Error:', err);
            return [];
        }
    }

    async seedLeads(initialLeads) {
        const userId = await getSystemUserId();

        // Transform leads to match Schema
        const dbLeads = initialLeads.map(l => ({
            owner_id: userId,
            name: l.name,
            company: l.company,
            phone: l.phone,
            email: l.email,
            status: l.status,
            priority: l.priority,
            value: parseInt(l.value.replace(/[^0-9]/g, '')) || 0, // Cleanup currency string
            tags: l.tags
        }));

        try {
            const { data, error } = await supabase
                .from('leads')
                .insert(dbLeads)
                .select();

            if (error) throw error;
            return true;
        } catch (err) {
            console.error('[Supabase] Seed Error:', err);
            return false;
        }
    }
}

module.exports = new DBService();
