export default function Header() {
  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
        <div className="text-lg font-semibold">RefCompo</div>
        <nav className="text-sm text-slate-600">Monorepo • React + Vite</nav>
      </div>
    </header>
  );
}


