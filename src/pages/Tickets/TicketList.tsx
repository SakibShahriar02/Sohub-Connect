import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { tickets } from "../../data/ticketData";

export default function TicketList() {
  return (
    <>
      <PageMeta title="Tickets | SOHUB Connect" description="Ticket management system" />
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Tickets</h1>
          <Link
            to="/tickets/add"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Add Ticket
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Unique ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Ticket For</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Created By</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Created At</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-gray-200 dark:border-gray-800">
                    <td className="px-6 py-4 text-sm text-gray-800 dark:text-white/90">{ticket.unique_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 dark:text-white/90">{ticket.ticket_for}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        ticket.status === 'Open' ? 'bg-red-100 text-red-800' :
                        ticket.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 dark:text-white/90">{ticket.created_by}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 dark:text-white/90">{ticket.created_at}</td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/tickets/${ticket.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}