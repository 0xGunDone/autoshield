export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 pb-8 animate-pulse mt-4">
      {/* Hero Skeleton */}
      <section className="glass rounded-3xl p-8 md:p-12 mb-12 h-[400px] bg-slate-200/5 dark:bg-slate-800/10" />

      {/* Services Skeleton */}
      <section className="space-y-4">
        <div className="h-8 w-48 bg-slate-200/10 dark:bg-slate-800/20 rounded-lg" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="glass rounded-2xl h-72 bg-slate-200/5 dark:bg-slate-800/10"
            />
          ))}
        </div>
      </section>

      {/* Pricing Skeleton */}
      <section className="space-y-4 pt-4">
        <div className="h-8 w-32 bg-slate-200/10 dark:bg-slate-800/20 rounded-lg" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="glass rounded-2xl p-5 h-32 bg-slate-200/5 dark:bg-slate-800/10"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
