import { Container } from '../ui/Container';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <Container>
        <div className="py-8 text-sm text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} RefCompo. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="hover:text-slate-900">
              Privacy
            </a>
            <a href="/terms" className="hover:text-slate-900">
              Terms
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}


