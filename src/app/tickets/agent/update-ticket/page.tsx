// src/app/tickets/agent/update-ticket/page.tsx
import React, { Suspense } from 'react';
import AgentUpdateTicketClient from './AgentUpdateTicketClient';


export default function AgentUpdateTicketPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AgentUpdateTicketClient />
    </Suspense>
  );
}
