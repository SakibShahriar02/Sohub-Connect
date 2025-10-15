import { useState } from 'react';
import PageMeta from '../../components/common/PageMeta';

interface Transaction {
  id: number;
  account_id: string;
  voucher_head_id: string;
  type: string;
  category: string;
  ref: string;
  amount: number;
  dr: number;
  cr: number;
  bal: number;
  date: string;
  pay_via: string;
  description: string;
  attachments: string;
  created_at: string;
  updated_at: string;
}

const dummyTransactions: Transaction[] = [
  {
    id: 1,
    account_id: 'ACC001',
    voucher_head_id: 'VH001',
    type: 'Payment',
    category: 'Service',
    ref: 'TXN001',
    amount: 150.00,
    dr: 0.00,
    cr: 150.00,
    bal: 850.00,
    date: '2024-01-20',
    pay_via: 'Credit Card',
    description: 'Monthly VoIP service payment',
    attachments: 'receipt_001.pdf',
    created_at: '2024-01-20 10:30:00',
    updated_at: '2024-01-20 10:30:00'
  },
  {
    id: 2,
    account_id: 'ACC001',
    voucher_head_id: 'VH002',
    type: 'Charge',
    category: 'Usage',
    ref: 'TXN002',
    amount: 45.50,
    dr: 45.50,
    cr: 0.00,
    bal: 804.50,
    date: '2024-01-19',
    pay_via: 'Auto Debit',
    description: 'International call charges',
    attachments: '',
    created_at: '2024-01-19 15:45:00',
    updated_at: '2024-01-19 15:45:00'
  },
  {
    id: 3,
    account_id: 'ACC002',
    voucher_head_id: 'VH003',
    type: 'Refund',
    category: 'Adjustment',
    ref: 'TXN003',
    amount: 25.00,
    dr: 0.00,
    cr: 25.00,
    bal: 829.50,
    date: '2024-01-18',
    pay_via: 'Bank Transfer',
    description: 'Service downtime compensation',
    attachments: 'refund_003.pdf',
    created_at: '2024-01-18 09:20:00',
    updated_at: '2024-01-18 09:20:00'
  },
  {
    id: 4,
    account_id: 'ACC001',
    voucher_head_id: 'VH004',
    type: 'Payment',
    category: 'Setup',
    ref: 'TXN004',
    amount: 200.00,
    dr: 0.00,
    cr: 200.00,
    bal: 1029.50,
    date: '2024-01-17',
    pay_via: 'Wire Transfer',
    description: 'New extension setup fee',
    attachments: 'invoice_004.pdf',
    created_at: '2024-01-17 14:15:00',
    updated_at: '2024-01-17 14:15:00'
  },
  {
    id: 5,
    account_id: 'ACC003',
    voucher_head_id: 'VH005',
    type: 'Charge',
    category: 'Service',
    ref: 'TXN005',
    amount: 75.25,
    dr: 75.25,
    cr: 0.00,
    bal: 954.25,
    date: '2024-01-16',
    pay_via: 'PayPal',
    description: 'Premium feature activation',
    attachments: '',
    created_at: '2024-01-16 11:30:00',
    updated_at: '2024-01-16 11:30:00'
  }
];

export default function TransactionHistory() {
  const [transactions] = useState<Transaction[]>(dummyTransactions);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Payment':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Charge':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Refund':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <>
      <PageMeta
        title="Transaction History | SOHUB Connect"
        description="View transaction history and billing records"
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transaction History</h1>
            <p className="text-gray-600 dark:text-gray-400">View all transaction records and billing history</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Transaction</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payment Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{transaction.ref}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">ID: {transaction.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(transaction.type)}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div className="font-medium">${transaction.amount.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">
                        {transaction.dr > 0 && <span className="text-red-600">DR: ${transaction.dr.toFixed(2)}</span>}
                        {transaction.cr > 0 && <span className="text-green-600">CR: ${transaction.cr.toFixed(2)}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      ${transaction.bal.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {transaction.pay_via}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="max-w-48 truncate text-sm text-gray-900 dark:text-white" title={transaction.description}>
                        {transaction.description}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {transactions.length === 0 && (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            No transaction history found.
          </div>
        )}
      </div>
    </>
  );
}