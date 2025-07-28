import React from 'react';

const Button = ({ children, ...props }) => (
  <button {...props} style={{ padding: '10px 24px', background: '#35610c', color: '#fff', border: 'none', borderRadius: 7, fontWeight: 600, fontSize: 16, cursor: 'pointer', ...props.style }}>
    {children}
  </button>
);

export default Button;
