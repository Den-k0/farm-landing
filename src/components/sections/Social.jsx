export default function Social() {
  return (
    <section id="social" className="relative py-24 scroll-mt-24 bg-white/60 dark:bg-white/[0.02] backdrop-blur border-y border-black/10 dark:border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">Соціальна відповідальність</h2>
        <p className="text-neutral-700 dark:text-neutral-300 max-w-3xl">
          Ми активно підтримуємо громади та захисників України: допомога ЗСУ та волонтерам, ремонт та облаштування інфраструктури, підтримка освіти, спорту й культурних ініціатив. Загалом надано понад 12 млн грн допомоги та гуманітарки.
        </p>
        <ul className="mt-6 grid sm:grid-cols-2 gap-3 text-sm text-neutral-700 dark:text-neutral-300">
          <li className="rounded-lg border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur p-3">• Підтримка ЗСУ та волонтерських ініціатив</li>
          <li className="rounded-lg border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur p-3">• Гуманітарна допомога громадам</li>
          <li className="rounded-lg border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur p-3">• Ремонт доріг і соціальних обʼєктів</li>
          <li className="rounded-lg border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur p-3">• Підтримка освіти, спорту та молоді</li>
        </ul>
      </div>
    </section>
  )
}
