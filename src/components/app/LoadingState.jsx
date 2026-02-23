function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-10 h-10 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-[var(--color-text-muted)] text-sm">{message}</p>
    </div>
  )
}

export default LoadingState
