"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ConfirmPaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  amount: number
  method: "qris" | "cash" | "transfer"
  onConfirm: () => void
  confirmText?: string
  cancelText?: string
  variant?: "destructive" | "default"
}

export function ConfirmPaymentDialog({
  open,
  onOpenChange,
  amount,
  method,
  onConfirm,
  confirmText = "Confirm Payment",
  cancelText = "Cancel",
  variant = "default",
}: ConfirmPaymentDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
          <AlertDialogDescription>
            Make sure the customer has completed the payment of{" "}
            <strong>Rp{amount.toLocaleString("id-ID")}</strong> via{" "}
            <strong>{method.toUpperCase()}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="mr-2">{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
            className={`px-4 py-2 rounded ${
              variant === "destructive" ? "bg-red-500 text-white" : "bg-rose-600 text-white"
            }`}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
