"use client"

import type React from "react"

import { useState, useEffect } from "react"

type ToastType = "default" | "success" | "destructive"

interface Toast {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  type?: ToastType
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    // Auto-dismiss toasts after 5 seconds
    const timer = setTimeout(() => {
      setToasts((toasts) => toasts.slice(1))
    }, 5000)

    return () => clearTimeout(timer)
  }, [toasts])

  function toast({
    title,
    description,
    action,
    type = "default",
  }: {
    title?: string
    description?: string
    action?: React.ReactNode
    type?: ToastType
  }) {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((toasts) => [...toasts, { id, title, description, action, type }])
    return id
  }

  function dismiss(id: string) {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id))
  }

  return {
    toast,
    dismiss,
    toasts,
  }
}
