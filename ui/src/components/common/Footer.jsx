import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer className="main-footer">
    <div className="footer-content">
      <span>© {new Date().getFullYear()} CookCraft. All rights reserved.</span>
      <span>Made with <span style={{color:'#a50034',fontWeight:700}}>&#10084;</span> by Your Team</span>
    </div>
  </footer>
);

export default Footer;
