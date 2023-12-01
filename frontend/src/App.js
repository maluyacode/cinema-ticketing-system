import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css';
import Register from './Components/User/Register'
import Login from './Components/User/Login'
import Header from './Components/Layout/Header'
import Home from './Components/Home'
import { ToastContainer } from 'react-toastify';
import ResetPassword from 'Components/User/ResetPassword';
import ForgotPassword from 'Components/User/ForgotPassword';
import MovieShows from 'Components/Shows/MovieShows';
import SeatSelection from 'Components/Reservation/SeatSelection';
import Reservation from 'Components/Reservation/Reservation';
import Success from 'Components/Reservation/Success';
import Dashboard from 'Components/Admin/Dashboard';
import MovieListing from 'Components/MovieListing';
import MoviesList from 'Components/Admin/Movies/MoviesList';
import MovieCreate from 'Components/Admin/Movies/MovieCreate';
import MovieUpdate from 'Components/Admin/Movies/MovieUpdate';
import CinemasList from 'Components/Admin/Cinema/CinemasList';
import CinemaCreate from 'Components/Admin/Cinema/CinemaCreate';
import CinemaUpdate from 'Components/Admin/Cinema/CinemaUpdate';
import ShowsList from 'Components/Admin/Show/ShowsList';
import ShowCreate from 'Components/Admin/Show/ShowCreate';
import ShowUpdate from 'Components/Admin/Show/ShowUpdate';
import UsersList from 'Components/Admin/User/UsersList';
import UserCreate from 'Components/Admin/User/UserCreate';
import UserUpdate from 'Components/Admin/User/UserUpdate';
import ProtectedRoute from 'utils/ProtectedRoute';
import ReservationsList from 'Components/Admin/Reservation/ReservationsList';
import ReservationUpdate from 'Components/Admin/Reservation/ReservationUpdate';
import Profile from 'Components/User/Profile';
import MyReservations from 'Components/User/MyReservations';
import { HelmetProvider } from 'react-helmet-async';

const hideHeader = window.location.pathname.startsWith('/admin');

function App() {
  return (
    <div className="App">
      <HelmetProvider>
        <Router>
          <Header key={hideHeader} />
          <Routes>
            <Route path='/' element={<Home />} caseSensitive={true} />
            <Route path='/login' element={<Login />} caseSensitive={true} />
            <Route path='/register' element={<Register />} caseSensitive={true} />
            <Route path='/forgot/password' element={<ForgotPassword />} caseSensitive={true} />
            <Route path='/password/reset/:token' element={<ResetPassword />} exact="true" />
            <Route path='/sarili' element={<Profile />} exact="true" />
            <Route path='/reservations-ticket-seats' element={<MyReservations />} exact="true" />

            <Route path='/movies' element={<MovieListing />} exact="true" />
            <Route path='/movie/shows/:id' element={<MovieShows />} exact="true" />
            <Route path='/reservation/:showId' element={<Reservation />} caseSensitive={true} />
            <Route path='/success' element={<Success />} caseSensitive={true} />

            <Route path='/admin/dashboard' element={<ProtectedRoute isAdmin={true}> <Dashboard /> </ProtectedRoute>} />

            <Route path='/admin/movies-list' element={<ProtectedRoute isAdmin={true}> <MoviesList /> </ProtectedRoute>} />
            <Route path='/admin/movie-create' element={<ProtectedRoute isAdmin={true}> <MovieCreate /> </ProtectedRoute>} />
            <Route path='/admin/movie-update/:id' element={<ProtectedRoute isAdmin={true}> <MovieUpdate /> </ProtectedRoute>} />

            <Route path='/admin/cinemas-list' element={<ProtectedRoute isAdmin={true}> <CinemasList /> </ProtectedRoute>} exact={true} />
            <Route path='/admin/cinema-create' element={<ProtectedRoute isAdmin={true}> <CinemaCreate /> </ProtectedRoute>} exact={true} />
            <Route path='/admin/cinema-update/:id' element={<CinemaUpdate />} exact={true} />

            <Route path='/admin/shows-list' element={<ProtectedRoute isAdmin={true}> <ShowsList /> </ProtectedRoute>} exact={true} />
            <Route path='/admin/show-create' element={<ProtectedRoute isAdmin={true}> <ShowCreate /> </ProtectedRoute>} exact={true} />
            <Route path='/admin/show-update/:id' element={<ProtectedRoute isAdmin={true}> <ShowUpdate /> </ProtectedRoute>} exact={true} />

            <Route path='/admin/users-list' element={<ProtectedRoute isAdmin={true}> <UsersList /> </ProtectedRoute>} exact={true} />
            <Route path='/admin/user-create' element={<ProtectedRoute isAdmin={true}> <UserCreate /> </ProtectedRoute>} exact={true} />
            <Route path='/admin/user-update/:id' element={<ProtectedRoute isAdmin={true}> <UserUpdate /> </ProtectedRoute>} exact={true} />

            <Route path='/admin/reservations-list/' element={<ProtectedRoute isAdmin={true}> <ReservationsList /> </ProtectedRoute>} exact={true} />
            <Route path='/admin/reservation-update/:id' element={<ProtectedRoute isAdmin={true}> <ReservationUpdate /> </ProtectedRoute>} exact={true} />

          </Routes>
          <ToastContainer
            position="top-center"
            autoClose={1500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </Router>
      </HelmetProvider>
    </div>
  );
}

export default App;
