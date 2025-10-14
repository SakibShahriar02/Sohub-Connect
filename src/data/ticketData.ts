export interface TicketType {
  id: number;
  name: string;
  created_by: string;
  created_at: string;
}

export interface Ticket {
  id: number;
  unique_id: string;
  ticket_for: string;
  description: string;
  comment: string;
  created_by: string;
  status: string;
  created_at: string;
}

export const ticketTypes: TicketType[] = [
  { id: 1, name: "Technical Support", created_by: "admin", created_at: "2024-01-01 10:00:00" },
  { id: 2, name: "Billing Issue", created_by: "admin", created_at: "2024-01-01 10:05:00" },
  { id: 3, name: "Feature Request", created_by: "admin", created_at: "2024-01-01 10:10:00" },
  { id: 4, name: "Bug Report", created_by: "admin", created_at: "2024-01-01 10:15:00" },
  { id: 5, name: "General Inquiry", created_by: "admin", created_at: "2024-01-01 10:20:00" }
];

export const tickets: Ticket[] = [
  {
    id: 1,
    unique_id: "TKT-2024-001",
    ticket_for: "Technical Support",
    description: "Unable to login to the system with correct credentials. Getting authentication error.",
    comment: "High priority - customer cannot access their account",
    created_by: "john.doe@example.com",
    status: "Open",
    created_at: "2024-01-15 09:30:00"
  },
  {
    id: 2,
    unique_id: "TKT-2024-002", 
    ticket_for: "Billing Issue",
    description: "Payment was deducted but service not activated. Need immediate resolution.",
    comment: "Customer paid $99 but account shows unpaid",
    created_by: "jane.smith@example.com",
    status: "In Progress",
    created_at: "2024-01-14 14:20:00"
  },
  {
    id: 3,
    unique_id: "TKT-2024-003",
    ticket_for: "Feature Request",
    description: "Request to add dark mode toggle in user dashboard for better user experience.",
    comment: "Enhancement request from premium user",
    created_by: "mike.wilson@example.com", 
    status: "Closed",
    created_at: "2024-01-13 11:45:00"
  },
  {
    id: 4,
    unique_id: "TKT-2024-004",
    ticket_for: "Bug Report",
    description: "Dashboard charts not loading properly on mobile devices. Shows blank screen.",
    comment: "Affects mobile users only",
    created_by: "sarah.johnson@example.com",
    status: "Open", 
    created_at: "2024-01-12 16:10:00"
  },
  {
    id: 5,
    unique_id: "TKT-2024-005",
    ticket_for: "General Inquiry",
    description: "How to export data from the system? Need step by step instructions.",
    comment: "User needs documentation",
    created_by: "david.brown@example.com",
    status: "In Progress",
    created_at: "2024-01-11 13:25:00"
  }
];