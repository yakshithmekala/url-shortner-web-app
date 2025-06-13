import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home';
import LoginPage from './Pages/LoginPage/LoginPage';
import Navbar from './Components/Navbar/Navbar';
import './App.css';
import './index.css';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
import URLShortener from './Pages/URLShortener/URLShortener';

function App() {
  return (
    <Router>
        <Navbar/>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element={<LoginPage/>} />
            <Route element={<PrivateRoute/>}>
                <Route path='/urlShortener' element={<URLShortener/>} />
            </Route>
        </Routes>
    </Router>
  )
}

export default App
