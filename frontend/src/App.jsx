import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home';
import LoginPage from './Pages/LoginPage/LoginPage';
import Navbar from './Components/Navbar/Navbar';
import MyURLsPage from './Pages/User/MyURLsPage';
import './index.css';

function App() {
  return (
    <Router>
        <Navbar/>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element={<LoginPage/>} />
            <Route path='/url/list' element={<MyURLsPage/>} />
        </Routes>
    </Router>
  )
}

export default App
