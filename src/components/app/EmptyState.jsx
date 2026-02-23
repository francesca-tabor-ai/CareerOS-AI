function EmptyState({ icon = '📭', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <span className="text-5xl mb-4 opacity-70">{icon}</span>
      <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">{title}</h3>
      <p className="text-[var(--color-text-muted)] max-w-md mb-6">{description}</p>
      {action}
    </div>
  )
}

export default EmptyState
