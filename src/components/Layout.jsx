import NavBar from './NavBar.jsx'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-navy">
      <NavBar />
      {children}
      <footer className="border-t border-line/60 px-6 py-8 text-center md:px-10">
        <p className="font-mono text-xs text-slate">
          Keyner García · Ingeniería de Software · UDES · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  )
}
