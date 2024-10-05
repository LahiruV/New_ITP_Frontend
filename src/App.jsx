import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import Home from './Pages/Main/Home';
import Profile from './Pages/Main/Profile';
import MainHome from './Pages/Main/MainHome';
import AdminLogin from './Pages/AdminLogReg/AdminLogin';
import AdminRegister from './Pages/AdminLogReg/AdminRegister';
import OwnerLogin from './Pages/AdminLogReg/OwnerLogin';
import OwnerRegister from './Pages/AdminLogReg/OwnerRegister';
import StaffDash from './Pages/AdminDash/StaffDash';
import AddStaff from './Pages/AdminDash/AddStaff';
import FoodMenuDash from './Pages/AdminDash/FoodMenuDash';
import AddFoodMenu from './Pages/AdminDash/AddFoodMenu';
import PropertyDash from './Pages/AdminDash/PropertyDash';
import AddProperty from './Pages/AdminDash/AddProperty';
import UtilityDash from './Pages/AdminDash/UtilityDash';
import AddUtility from './Pages/AdminDash/AddUtility';
import MapDash from './Pages/AdminDash/MapDash';
import AddMap from './Pages/AdminDash/AddMap';
import AdvertisementDash from './Pages/AdminDash/AdvertisementDash';
import AddAdvertisement from './Pages/AdminDash/AddAdvertisement';
import Property from './Pages/Customer/Property';
import BookingForm from './Pages/Customer/BookingForm';
import Booking from './Pages/Customer/Booking';
import SupportTicket from './Pages/Customer/SupportTicket';
import Tickets from './Pages/Customer/Tickets';
import Feedback from './Pages/Customer/Feedback';
import Services from './Pages/Customer/Services';
import ServiceDash from './Pages/AdminDash/ServiceDash';
import BookingDash from './Pages/AdminDash/BookingDash';
import FoodReqDash from './Pages/AdminDash/FoodReqDash';
import Foods from './Pages/Customer/Foods';
import Ads from './Pages/Customer/Ads';
import TicketDash from './Pages/AdminDash/TicketDash';
import FeedbackDash from './Pages/AdminDash/FeedbackDash';
import Map from './Pages/Customer/Map';
import PaymentPage from './Pages/Customer/PaymentPage';
import FinanceDash from './Pages/AdminDash/FinanceDash';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainHome />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/home" element={<Home />} />

        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/adminRegister" element={<AdminRegister />} />
        <Route path="/ownerLogin" element={<OwnerLogin />} />
        <Route path="/ownerRegister" element={<OwnerRegister />} />
        <Route path="/staffDash" element={<StaffDash />} />
        <Route path="/addStaff" element={<AddStaff />} />
        <Route path="/foodMenuDash" element={<FoodMenuDash />} />
        <Route path="/addFoodMenu" element={<AddFoodMenu />} />
        <Route path="/propertyDash" element={<PropertyDash />} />
        <Route path="/addProperty" element={<AddProperty />} />
        <Route path="/utilityDash" element={<UtilityDash />} />
        <Route path="/addUtility" element={<AddUtility />} />
        <Route path="/mapDash" element={<MapDash />} />
        <Route path="/addMap" element={<AddMap />} />
        <Route path="/advertisementDash" element={<AdvertisementDash />} />
        <Route path="/addAdvertisement" element={<AddAdvertisement />} />
        <Route path="/serviceDash" element={<ServiceDash />} />
        <Route path="/bookingDash" element={<BookingDash />} />
        <Route path="/foodReqDash" element={<FoodReqDash />} />
        <Route path="/ticketDash" element={<TicketDash />} />
        <Route path="/feedbackDash" element={<FeedbackDash />} />
        <Route path="/financeDash" element={<FinanceDash />} />

        <Route path="/services" element={<Services />} />
        <Route path="/bookingForm" element={<BookingForm />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/supticket" element={<SupportTicket />} />
        <Route path="/suptickets" element={<Tickets />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/bodims" element={<Property />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/foods" element={<Foods />} />
        <Route path="/ads" element={<Ads />} />
        <Route path="/googleMap" element={<Map />} />
        <Route path="/paymentPage" element={<PaymentPage />} />
      </Routes>
    </Router>
  );
}

export default App;
