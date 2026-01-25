import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AppProviders } from '@/contexts'
import Home from '@/pages/Home'
import Search from '@/pages/Search'
import Profile from '@/pages/Profile'
import VerifyLicense from '@/pages/VerifyLicense'
import CarDetail from '@/pages/CarDetail'
import RegisterCar from '@/pages/RegisterCar'
import Login from '@/pages/Login'
import MyCars from '@/pages/MyCars'
import RentCar from '@/pages/RentCar'
import MyTrips from '@/pages/MyTrips'
import EditCar from '@/pages/EditCar'
import About from '@/pages/About'
import Help from '@/pages/Help'
import Terms from '@/pages/Terms'
import Privacy from '@/pages/Privacy'
import Blog from '@/pages/Blog'
import Careers from '@/pages/Careers'
import HowItWorks from '@/pages/HowItWorks'
import Delivery from '@/pages/Delivery'
import Contact from '@/pages/Contact'
import TripDetail from '@/pages/TripDetail'

function App() {
    return (
        <AppProviders>
            <Toaster position="top-center" richColors />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/account" element={<Profile />} />
                    <Route path="/verify-license" element={<VerifyLicense />} />
                    <Route path="/mycars" element={<MyCars />} />
                    <Route path="/car/:id" element={<CarDetail />} />
                    <Route path="/rent/:id" element={<RentCar />} />
                    <Route path="/register-car" element={<RegisterCar />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/mytrips" element={<MyTrips />} />
                    <Route path="/mycars/edit/:id" element={<EditCar />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/how-it-works" element={<HowItWorks />} />
                    <Route path="/delivery" element={<Delivery />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/trip/:id" element={<TripDetail />} />
                </Routes>
            </BrowserRouter>
        </AppProviders>
    )
}

export default App

