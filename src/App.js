import './App.css';
import PetGrid from './component/PetGrid';
import Header from './component/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Header/>
        <Routes>
          <Route path="/" element={<PetGrid/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
