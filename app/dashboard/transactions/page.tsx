import { TransactionHistory } from "@/components/transactions/transaction-history"

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
        <p className="text-gray-600">View and manage all your transactions.</p>
      </div>

      <TransactionHistory />
    </div>
  )
}
