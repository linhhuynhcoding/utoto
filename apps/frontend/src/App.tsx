import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AppProviders } from '@/contexts'
import Home from '@/pages/Home'
import Search from '@/pages/Search'
import Profile from '@/pages/Profile'
import CarDetail from '@/pages/CarDetail'
import RegisterCar from '@/pages/RegisterCar'
import Login from '@/pages/Login'
import MyCars from '@/pages/MyCars'
import RentCar from '@/pages/RentCar'
import MyTrips from '@/pages/MyTrips'
import EditCar from '@/pages/EditCar'

function App() {
    return (
        <AppProviders>
            <Toaster position="top-center" richColors />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/account" element={<Profile />} />
                    <Route path="/mycars" element={<MyCars />} />
                    <Route path="/car/:id" element={<CarDetail />} />
                    <Route path="/rent/:id" element={<RentCar />} />
                    <Route path="/register-car" element={<RegisterCar />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/mytrips" element={<MyTrips />} />
                    <Route path="/mycars/edit/:id" element={<EditCar />} />
                </Routes>
            </BrowserRouter>
        </AppProviders>
    )
}

export default App

