// src/app/tickets/agent/view-ticket/page.tsx
'use client';

import { Suspense } from 'react';
import AgentViewTicketPage from './AgentViewTicketPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AgentViewTicketPage />
    </Suspense>
  );
}
