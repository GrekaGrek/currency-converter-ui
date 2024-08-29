import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import AdminFeeManagement from './AdminFeeManagement';
import PublicCurrencyConverter from './PublicCurrencyConverter';

const App: React.FC = () => {
  return (
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/admin">Admin</Link>
              </li>
              <li>
                <Link to="/public">Public</Link>
              </li>
            </ul>
          </nav>
          <Routes>
            <Route path="/admin" element={<AdminFeeManagement />} />
            <Route path="/public" element={<PublicCurrencyConverter />} />
          </Routes>
        </div>
      </Router>
  );
};

export default App;
