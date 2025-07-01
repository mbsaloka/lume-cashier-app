import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
      </div>

      <DashboardStats />
      <RecentTransactions />
    </div>
  )
}
