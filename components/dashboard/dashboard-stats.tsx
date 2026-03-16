"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingCart, ShoppingBag } from "lucide-react"

type MethodKey = string

type MethodStat = {
  totalSales: number
  totalTransactions: number
  totalItemsSold: number
}

export function DashboardStats() {
  const [stats, setStats] = useState([
    {
      title: "Total Sales",
      value: "Rp0",
      icon: DollarSign,
    },
    {
      title: "Transactions",
      value: "0",
      icon: ShoppingCart,
    },
    {
      title: "Total Items Sold",
      value: "0",
      icon: ShoppingBag,
    }
  ]);
  const [byMethod, setByMethod] = useState<Record<MethodKey, MethodStat>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        const response = await fetch(`/api/dashboard/stats`);
        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }
        const data = await response.json();
        setStats([
          {
            title: "Total Sales",
            value: `Rp${data.totalSales.toLocaleString("id-ID")}`,
            icon: DollarSign,
          },
          {
            title: "Transactions",
            value: data.totalTransactions.toString(),
            icon: ShoppingCart,
          },
          {
            title: "Total Items Sold",
            value: data.totalItemsSold.toString(),
            icon: ShoppingBag,
          }
        ]);
        setByMethod(data.byMethod || {})
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false)
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-600" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                    <Icon className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">By Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(byMethod).length === 0 ? (
                <div className="text-sm text-gray-500">No transactions yet.</div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(byMethod).map(([method, s]) => (
                    <div key={method} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border rounded-md p-3">
                      <div className="font-medium">{method.toUpperCase()}</div>
                      <div className="text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-1">
                        <span>
                          Sales: <span className="font-medium text-gray-900">Rp{s.totalSales.toLocaleString("id-ID")}</span>
                        </span>
                        <span>
                          Tx: <span className="font-medium text-gray-900">{s.totalTransactions}</span>
                        </span>
                        <span>
                          Items: <span className="font-medium text-gray-900">{s.totalItemsSold}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
