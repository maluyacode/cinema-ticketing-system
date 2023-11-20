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
