"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingCart, ShoppingBag } from "lucide-react"

export function DashboardStats() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
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

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`);
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
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }
    fetchStats();
  }, []);

  return (
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
  )
}
