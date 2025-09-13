import React from 'react';
import { Button } from 'antd';
import { UpOutlined } from '@ant-design/icons';

const ScrollToTopButton = () => {
  const handleClick = () => {
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Button
      type="primary"
      shape="circle"
      icon={<UpOutlined />}
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: 100,
        right: 27,
        zIndex: 1000,
        background: '#a50034',
        borderColor: '#a50034',
        width: 36,
        height: 36,
        fontSize: 18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-label="Scroll to top"
    />
  );
};

export default ScrollToTopButton;
