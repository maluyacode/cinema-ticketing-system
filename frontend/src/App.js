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
import MoviesList from 'Components/Admin/Movies/MoviesList';
import MovieCreate from 'Components/Admin/Movies/MovieCreate';
import MovieUpdate from 'Components/Admin/Movies/MovieUpdate';
import CinemasList from 'Components/Admin/Cinema/CinemasList';
import CinemaCreate from 'Components/Admin/Cinema/CinemaCreate';
import CinemaUpdate from 'Components/Admin/Cinema/CinemaUpdate';
import ShowsList from 'Components/Admin/Show/ShowsList';
import ShowCreate from 'Components/Admin/Show/ShowCreate';
import ShowUpdate from 'Components/Admin/Show/ShowUpdate';

const hideHeader = window.location.pathname.startsWith('/admin');

function App() {
  return (
    <div className="App">
      <Router>
        {!hideHeader && <Header />}
        <Routes>
          <Route path='/login' element={<Login />} caseSensitive={true} />
          <Route path='/register' element={<Register />} caseSensitive={true} />
          <Route path='/forgot/password' element={<ForgotPassword />} caseSensitive={true} />
          <Route path='/password/reset/:token' element={<ResetPassword />} exact="true" />
          <Route path='/movie/shows/:id' element={<MovieShows />} exact="true" />
          <Route path='/' element={<Home />} caseSensitive={true} />
          <Route path='/reservation/:showId' element={<Reservation />} caseSensitive={true} />
          <Route path='/success' element={<Success />} caseSensitive={true} />

          <Route path='/admin/dashboard' element={<Dashboard />} />

          <Route path='/admin/movies-list' element={<MoviesList />} />
          <Route path='/admin/movie-create' element={<MovieCreate />} />
          <Route path='/admin/movie-update/:id' element={<MovieUpdate />} />

          <Route path='/admin/cinemas-list' element={<CinemasList />} exact={true} />
          <Route path='/admin/cinema-create' element={<CinemaCreate />} exact={true} />
          <Route path='/admin/cinema-update/:id' element={<CinemaUpdate />} exact={true} />

          <Route path='/admin/shows-list' element={<ShowsList />} exact={true} />
          <Route path='/admin/show-create' element={<ShowCreate />} exact={true} />
          <Route path='/admin/show-update/:id' element={<ShowUpdate />} exact={true} />

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
    </div>
  );
}

export default App;
