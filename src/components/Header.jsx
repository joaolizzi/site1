import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="mmg-logo">
          <div className="mmg-logo-icon">M</div>
          <span>MMG</span>
        </Link>
        
        <nav className="header-nav">
          <Link to="/" className="nav-link">
            Formulário
          </Link>
          <Link to="/admin" className="nav-link">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
