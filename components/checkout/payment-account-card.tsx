"use-client"

import { Copy } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface PaymentAccountCardProps {
  name: string
  bank: string
  number: string
}

export function PaymentAccountCard({ name, bank, number }: PaymentAccountCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(number)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white flex items-center justify-between hover:shadow-md transition">
      <div>
        <p className="text-sm text-gray-500">{bank}</p>
        <p className="text-lg font-semibold tracking-wide">{number}</p>
        <p className="text-sm text-gray-700">a.n. {name}</p>
      </div>
      <Button variant="ghost" size="icon" onClick={handleCopy}>
        <Copy className="w-5 h-5" />
        <span className="sr-only">Copy</span>
      </Button>
    </div>
  )
}
