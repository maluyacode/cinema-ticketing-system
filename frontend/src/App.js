import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './App.css';
import Register from './Components/User/Register'
import Login from './Components/User/Login'
import Header from './Components/Layout/Header'

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path='/login' element={<Login />} caseSensitive={true} />
          <Route path='/register' element={<Register />} caseSensitive={true} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
