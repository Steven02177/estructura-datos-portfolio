import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import RutaProtegida from './components/RutaProtegida.jsx'
import Home from './pages/Home.jsx'
import Trabajos from './pages/Trabajos.jsx'
import TrabajoPage from './pages/TrabajoPage.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trabajos" element={<Trabajos />} />
        <Route path="/trabajos/:id" element={<TrabajoPage />} />
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
