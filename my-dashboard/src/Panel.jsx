function Panel({ title, children, className = '' }) {
  return (
    <section
      className={`rounded-md border border-gray-800 bg-gray-900 p-4 ${className}`}
    >
      {title ? (
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
          {title}
        </h3>
      ) : null}
      {children}
    </section>
  )
}

export default Panel
