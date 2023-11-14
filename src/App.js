import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './Login'; // Import your Login component
import Signup from './signup';
import Homepage from './Home_page'; 
import MFA from './mfa';
import Admin from './admin';
import CastVote from './cast-vote';
function App() {
  return (
    <Router>
      <div>
        
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/homepage" element={<Homepage/>}/>
          <Route path="/mfa" element={<MFA />} /> 
          <Route path="/cast-vote" element={<CastVote/>}/>
          <Route path='/adminview' element={<Admin/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
