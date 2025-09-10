const items = [
  ['Зернові', 'Пшениця, ячмінь, кукурудза — основа продовольчої безпеки.'],
  ['Олійні', 'Соняшник та ріпак із контролем якості на кожному етапі.'],
  ['Бобові', 'Покращення структури ґрунту та сівозміни.'],
  ['Сучасна техніка', 'ПАР, диференційоване внесення, GPS-моніторинг.'],
  ['Збереження ґрунтів', 'Мульчування, мінімальний обробіток, сидерати.'],
  ['Логістика', 'Раціональні ланцюги від поля до складу.'],
]

export default function Crops() {
  return (
    <section id="crops" className="relative py-24 scroll-mt-24 bg-white/60 dark:bg-white/[0.02] backdrop-blur border-y border-black/10 dark:border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">Рослинництво</h2>
        <p className="text-neutral-700 dark:text-neutral-300 max-w-3xl">
          На наших полях вирощуються зернові (пшениця, ячмінь, кукурудза), бобові та олійні культури. Використовуємо якісне насіння, точне внесення та системи збереження родючості, що забезпечують стабільно високі врожаї.
        </p>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(([title, desc]) => (
            <div key={title} className="group relative rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur p-6 overflow-hidden">
              <h3 className="font-semibold text-black dark:text-white">{title}</h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
