import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProviders } from '@/contexts'
import Home from '@/pages/Home'
import Search from '@/pages/Search'
import Profile from '@/pages/Profile'
import CarDetail from '@/pages/CarDetail'
import RegisterCar from '@/pages/RegisterCar'
import Login from '@/pages/Login'
import MyCars from '@/pages/MyCars'

function App() {
    return (
        <AppProviders>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/account" element={<Profile />} />
                    <Route path="/mycars" element={<MyCars />} />
                    <Route path="/car/:id" element={<CarDetail />} />
                    <Route path="/register-car" element={<RegisterCar />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </BrowserRouter>
        </AppProviders>
    )
}

export default App

