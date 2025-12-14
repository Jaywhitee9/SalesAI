const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../data');
// Ensure DB directory exists
if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(DB_PATH, { recursive: true });
}

class DBService {
    constructor() {
        this.collections = {
            calls: path.join(DB_PATH, 'calls_db.json'),
            leads: path.join(DB_PATH, 'leads_db.json')
        };
        this._initDB();
    }

    _initDB() {
        Object.values(this.collections).forEach(filePath => {
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, JSON.stringify([], null, 2));
            }
        });
    }

    _read(collection) {
        try {
            const filePath = this.collections[collection];
            if (!filePath) throw new Error(`Collection ${collection} not found`);
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            console.error(`[DB] Read Error (${collection}):`, err);
            return [];
        }
    }

    _write(collection, data) {
        try {
            const filePath = this.collections[collection];
            if (!filePath) throw new Error(`Collection ${collection} not found`);
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        } catch (err) {
            console.error(`[DB] Write Error (${collection}):`, err);
        }
    }

    // --- CALLS ---
    async saveCall(callData) {
        const calls = this._read('calls');
        const record = {
            id: callData.callSid || Date.now().toString(),
            timestamp: Date.now(),
            agentId: callData.agentId,
            customerNumber: callData.customerNumber || 'Unknown',
            duration: Math.floor((Date.now() - callData.startTime) / 1000),
            summary: callData.summary,
            transcript: callData.transcripts,
            score: callData.summary?.score || 0
        };
        calls.unshift(record);
        this._write('calls', calls);
        console.log(`[DB] Saved call record ${record.id}`);
        return record;
    }

    async getRecentCalls(limit = 10) {
        return this._read('calls').slice(0, limit);
    }

    // --- LEADS ---
    async getLeads() {
        return this._read('leads');
    }

    async seedLeads(initialLeads) {
        const current = this._read('leads');
        if (current.length === 0) {
            this._write('leads', initialLeads);
            return true;
        }
        return false;
    }
}

module.exports = new DBService();
