import React from 'react';
import { Link } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="admin-layout">
      <nav className="admin-sidebar">
        <ul>
          <li><Link to="/admin">Dashboard</Link></li>
          <li><Link to="/admin/contracts">Contracts</Link></li>
          <li><Link to="/admin/subscriptions">Subscriptions</Link></li>
          <li><Link to="/admin/thresholds">Thresholds</Link></li>
        </ul>
      </nav>
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;