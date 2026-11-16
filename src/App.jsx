import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import RutaProtegida from './components/RutaProtegida.jsx'
import Home from './pages/Home.jsx'
import Trabajos from './pages/Trabajos.jsx'
import TrabajoPage from './pages/TrabajoPage.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Parcial2 from './pages/Parcial2.jsx'
import Parcial3 from './pages/Parcial3.jsx'
import TallerHash from './pages/TallerHash.jsx'
import TallerGrafos from './pages/TallerGrafos.jsx'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trabajos" element={<Trabajos />} />
        <Route path="/trabajos/:id" element={<TrabajoPage />} />
        <Route path="/parcial-2" element={<Parcial2 />} />
        <Route path="/parcial-3" element={<Parcial3 />} />
        <Route path="/taller-hash" element={<TallerHash />} />
        <Route path="/taller-grafos" element={<TallerGrafos />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RutaProtegida>
              <AdminDashboard />
            </RutaProtegida>
          }
        />
      </Routes>
    </AuthProvider>
  )
}
