"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"
import React,{ ReactNode } from 'react';

export default function SessionProvider({ children }: { children: ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        {children}
      </ErrorBoundary>
    </NextAuthSessionProvider>
  )
}

class ErrorBoundary extends React.Component<{children: ReactNode, fallback: ReactNode}> {
  state = { hasError: false }

  static getDerivedStateFromError(error: any) {
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log({ error, errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}