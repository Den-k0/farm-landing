import { galleryImages } from '../../data/gallery'

export default function Gallery() {
  return (
    <section id="gallery" className="relative py-24 scroll-mt-24 bg-white/60 dark:bg-white/[0.02] backdrop-blur border-y border-black/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold">Фото</h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleryImages.map((src, i) => (
            <div key={src} className="group rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur overflow-hidden">
              <div className="aspect-[4/3] bg-neutral-200/50 dark:bg-neutral-800/50">
                <img
                  src={src}
                  alt={`Фото ${i + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
