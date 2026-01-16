import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import Profile from '@/pages/Profile'
import CarDetail from '@/pages/CarDetail'
import RegisterCar from '@/pages/RegisterCar'
import Login from '@/pages/Login'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/account" element={<Profile />} />
                <Route path="/car/:id" element={<CarDetail />} />
                <Route path="/register-car" element={<RegisterCar />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
