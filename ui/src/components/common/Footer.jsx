import React from 'react';
import { Layout, Typography } from 'antd';
import './Footer.css';

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

const Footer = () => (
  <AntFooter className="main-footer" style={{ background: '#a50034', color: '#fff', textAlign: 'center', marginTop: 60, padding: '22px 0 18px 0' }}>
    <div className="footer-content">
      <Text style={{ color: '#fff', fontWeight: 500, fontSize: '1.08rem' }}>
        © {new Date().getFullYear()} CookCraft. All rights reserved.
      </Text>
      <Text style={{ color: '#fff', fontWeight: 500, fontSize: '1.08rem' }}>
        Made by hoangfcoongminh
      </Text>
    </div>
  </AntFooter>
);

export default Footer;
