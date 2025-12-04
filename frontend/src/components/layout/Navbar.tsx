import { Link, NavLink } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { Container } from '../ui/Container';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur">
      <Container>
        <div className="h-14 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 font-semibold">
            <Icon name="BookOpen" className="h-5 w-5 text-slate-800" />
            RefCompo
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <NavLink to="/create" className={({ isActive }) => (isActive ? 'font-medium' : '')}>
              Create
            </NavLink>
            <NavLink
              to="/references"
              className={({ isActive }) => (isActive ? 'font-medium' : '')}
            >
              Reference List
            </NavLink>
            <a
              href="https://github.com/MrLoudest/refcompo"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900"
            >
              <Icon name="Github" className="h-4 w-4" />
              GitHub
            </a>
          </nav>
        </div>
      </Container>
    </header>
  );
}


