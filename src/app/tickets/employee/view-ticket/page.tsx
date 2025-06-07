// app/tickets/employee/view-ticket/page.tsx
"use client"; // Ensure this is a Client Component if needed

import { Suspense } from "react";
import ViewTicketComponent from "@/app/tickets/employee/view-ticket/ViewTicketComponent";

export default function ViewTicketPage() {
  return (
    <Suspense fallback={<div>Loading ticket...</div>}>
      <ViewTicketComponent />
    </Suspense>
  );
}
