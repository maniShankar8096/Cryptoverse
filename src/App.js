import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';

import Header from './components/Header';
import './App.css';
import Home from './Pages/Home';
import Coin from './Pages/Coin';
import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles(()=>({
  app:{
    backgroundColor:'#14161a',
    color:'white',
    minHeight:'100vh',
  }
}))

function App() {
  const classes=useStyles();

  return (
    <Router>
     <div className={classes.app}>
      <Header/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path='/coins/:id' element={<Coin/>}/>
        </Routes>
     </div>
    </Router>
  );
}

export default App;
