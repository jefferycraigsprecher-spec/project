'use client'

import * as React from 'react'

type ErrorBoundaryProps = {
  children: React.ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-4">
          <div className="max-w-lg rounded-3xl border border-white/10 bg-slate-900/95 p-10 text-center shadow-2xl">
            <h1 className="text-3xl font-bold">Something went wrong.</h1>
            <p className="mt-4 text-sm text-slate-300">Please refresh the page or contact support if the issue persists.</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
