import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { tickets } from "../../data/ticketData";

const responses = [
  { id: 1, author: "Support Team", message: "We are investigating this issue.", time: "2024-01-15 10:30" },
  { id: 2, author: "User", message: "Still having the same problem.", time: "2024-01-15 14:20" }
];

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newResponse, setNewResponse] = useState("");
  
  const ticketData = tickets.find(t => t.id === parseInt(id || '0'));
  
  if (!ticketData) {
    return <div>Ticket not found</div>;
  }

  const handleAddResponse = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New response:", newResponse);
    setNewResponse("");
  };

  return (
    <>
      <PageMeta title={`Ticket #${id} | SOHUB Connect`} description="Ticket details and responses" />
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            {ticketData.unique_id} - {ticketData.ticket_for}
          </h1>
          <button
            onClick={() => navigate("/tickets")}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
          >
            Back to Tickets
          </button>
        </div>

        {/* Ticket Info */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Status:</span>
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                ticketData.status === 'Open' ? 'bg-red-100 text-red-800' :
                ticketData.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {ticketData.status}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Created By:</span>
              <span className="ml-2 text-sm text-gray-800 dark:text-white/90">{ticketData.created_by}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Created:</span>
              <span className="ml-2 text-sm text-gray-800 dark:text-white/90">{ticketData.created_at}</span>
            </div>
          </div>
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description:</h3>
            <p className="text-gray-800 dark:text-white/90">{ticketData.description}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Comment:</h3>
            <p className="text-gray-800 dark:text-white/90">{ticketData.comment}</p>
          </div>
        </div>

        {/* Responses */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Responses</h3>
          
          <div className="space-y-4 mb-6">
            {responses.map((response) => (
              <div key={response.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800 dark:text-white/90">{response.author}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{response.time}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{response.message}</p>
              </div>
            ))}
          </div>

          {/* Add Response Form */}
          <form onSubmit={handleAddResponse} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Add Response
              </label>
              <textarea
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Type your response here..."
                required
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Add Response
            </button>
          </form>
        </div>
      </div>
    </>
  );
}