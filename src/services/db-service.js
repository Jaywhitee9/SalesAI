const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../data');
const CALLS_FILE = path.join(DB_PATH, 'calls_db.json');

// Ensure DB directory exists
if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(DB_PATH, { recursive: true });
}

// Ensure DB file exists
if (!fs.existsSync(CALLS_FILE)) {
    fs.writeFileSync(CALLS_FILE, JSON.stringify([], null, 2));
}

class DBService {
    constructor() {
        this.cache = null;
    }

    // Helper to read DB
    _readDB() {
        try {
            const data = fs.readFileSync(CALLS_FILE, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            console.error('[DB] Read Error:', err);
            return [];
        }
    }

    // Helper to write DB
    _writeDB(data) {
        try {
            fs.writeFileSync(CALLS_FILE, JSON.stringify(data, null, 2));
        } catch (err) {
            console.error('[DB] Write Error:', err);
        }
    }

    /**
     * Save a completed call record
     * @param {Object} callData 
     */
    async saveCall(callData) {
        const calls = this._readDB();

        const record = {
            id: callData.callSid || Date.now().toString(),
            timestamp: Date.now(),
            agentId: callData.agentId,
            customerNumber: callData.customerNumber || 'Unknown',
            duration: Math.floor((Date.now() - callData.startTime) / 1000),
            summary: callData.summary, // The AI summary
            transcript: callData.transcripts, // Full transcript
            score: callData.summary?.score || 0
        };

        calls.unshift(record); // Add to top
        this._writeDB(calls);
        console.log(`[DB] Saved call record ${record.id}`);
        return record;
    }

    /**
     * Get recent calls
     * @param {number} limit 
     */
    async getRecentCalls(limit = 10) {
        const calls = this._readDB();
        return calls.slice(0, limit);
    }
}

module.exports = new DBService();
