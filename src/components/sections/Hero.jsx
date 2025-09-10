import logo from '../../assets/logo.svg'
import { kpis } from '../../data/stats'

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative z-10">
            <p className="text-emerald-600 dark:text-emerald-400 font-medium tracking-widest uppercase">Фермерське господарство</p>
            <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
              <span className="text-gradient">«Калина Лошнівська»</span>
            </h1>
            <p className="mt-5 text-neutral-600 dark:text-neutral-300 max-w-xl">
              Сучасне багатопрофільне підприємство, що поєднує рослинництво та тваринництво. Засноване у 2011 році в селі Лошнів Теребовлянської громади.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#about" className="px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-900 font-semibold shadow-[0_0_30px_#10b981]/40 transition">Дізнатися більше</a>
              <a href="#contact" className="px-6 py-3 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition">Контакти</a>
            </div>
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
              {kpis.map(({ id, stat, label }) => (
                <div key={id} className="rounded-xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-black dark:text-white">{stat}</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <img
              src={logo}
              alt="Логотип ФГ «Калина Лошнівська»"
              className="w-full h-auto max-w-[28rem] sm:max-w-[34rem] lg:max-w-[40rem] animate-float"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
