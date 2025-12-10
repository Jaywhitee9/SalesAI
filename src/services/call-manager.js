const EventEmitter = require('events');

class CallManager extends EventEmitter {
  constructor() {
    super();
    this.calls = new Map();
  }

  getCall(callSid, context = null) {
    if (!this.calls.has(callSid)) {
      if (!context) {
        throw new Error(`Call ${callSid} not found and no context provided for creation`);
      }
      this.calls.set(callSid, {
        callSid,
        accountId: context.account.accountId,
        agentId: context.agent.agentId,
        sonioxSockets: {
          inbound: null, // Customer
          outbound: null // Agent
        },
        transcripts: {
          customer: [], // Array of finalized segments
          agent: []
        },
        frontendSocket: null,
        coachingHistory: [], // array of { type, message, timestamp }
        lastCoachingTime: 0,
        startTime: Date.now()
      });
      console.log(`[CallManager] Created state for call ${callSid} [Acc: ${context.account.name}]`);
    }
    return this.calls.get(callSid);
  }

  cleanupCall(callSid) {
    if (this.calls.has(callSid)) {
      const call = this.calls.get(callSid);

      // Close Soniox sockets
      if (call.sonioxSockets.inbound) {
        try { call.sonioxSockets.inbound.close(); } catch (e) { }
      }
      if (call.sonioxSockets.outbound) {
        try { call.sonioxSockets.outbound.close(); } catch (e) { }
      }

      // Notify frontend if connected
      if (call.frontendSocket) {
        try {
          call.frontendSocket.send(JSON.stringify({ type: 'call_ended', callSid }));
        } catch (e) { }
      }

      this.calls.delete(callSid);
      console.log(`[CallManager] Cleaned up call ${callSid}`);
    }
  }

  // Helper to append transcript and emit update
  addTranscript(callSid, role, text, isFinal) {
    const call = this.getCall(callSid);

    // Map track to role
    // Map track to role if needed, otherwise use as is
    const uiRole = (role === 'inbound') ? 'customer' : (role === 'outbound' ? 'agent' : role);

    if (isFinal) {
      call.transcripts[uiRole].push({
        text,
        timestamp: Date.now()
      });

      this.emit('transcript_final', { callSid, role: uiRole, text });

      // Also broadcast to frontend
      this.broadcastToFrontend(callSid, {
        type: 'transcript',
        role: uiRole,
        text,
        isFinal: true,
        // Optional fields for schema consistency
        severity: null,
        message: null,
        suggested_reply: null
      });
    } else {
      // Broadcast partial to frontend
      this.broadcastToFrontend(callSid, {
        type: 'transcript',
        role: uiRole,
        text,
        isFinal: false,
        severity: null,
        message: null,
        suggested_reply: null
      });
    }
  }

  broadcastToFrontend(callSid, message) {
    const call = this.getCall(callSid);
    if (call && call.frontendSocket && call.frontendSocket.readyState === 1) { // OPEN
      call.frontendSocket.send(JSON.stringify(message));
    }
  }
}

module.exports = new CallManager();
