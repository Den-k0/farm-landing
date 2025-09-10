export default function Livestock() {
  const livestockImage = '/photo_pigs.webp'
  return (
    <section id="livestock" className="relative py-24 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Тваринництво</h2>
            <p className="text-neutral-700 dark:text-neutral-300">
              Господарство активно розвиває свинарство — понад 7 000 голів свиней датської генетики. У власності — два сучасні свинокомплекси у селах Лошнів та Сущин. Ми забезпечуємо оптимальні умови вирощування, збалансоване харчування та ветеринарний супровід.
            </p>
            <ul className="mt-6 grid sm:grid-cols-2 gap-3 text-sm text-neutral-700 dark:text-neutral-300">
              <li className="rounded-lg border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur p-3">• 2 свинокомплекси (Лошнів, Сущин)</li>
              <li className="rounded-lg border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur p-3">• 7000+ голів</li>
              <li className="rounded-lg border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur p-3">• Контроль якості та біобезпека</li>
              <li className="rounded-lg border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur p-3">• Ветеринарний супровід</li>
            </ul>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] backdrop-blur overflow-hidden shadow-2xl">
              <img
                src={livestockImage}
                alt="Свинарство та виробничі потужності"
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div aria-hidden className="pointer-events-none absolute -inset-6 -z-10">
              <div className="absolute inset-0 rounded-3xl ring-1 ring-emerald-600/15 dark:ring-emerald-500/20 blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
