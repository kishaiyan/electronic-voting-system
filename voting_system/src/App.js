import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './Login'; // Import your Login component
import Signup from './signup';
import Homepage from './Home_page'; // Import your Signup component

function App() {
  return (
    <Router>
      <div>
        
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/homepage" element={<Homepage/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
