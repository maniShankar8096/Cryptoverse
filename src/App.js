import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';

import Header from './components/Header';
import './App.css';
import Home from './Pages/Home';
import Coin from './Pages/Coin';


function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route path='/coins/:coinId' element={<Coin/>}/>
      </Routes>
    </Router>
  );
}

export default App;
