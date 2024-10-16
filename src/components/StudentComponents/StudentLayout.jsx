import React from 'react';
import Header from '../Header.jsx';
import Footer from '../Footer.jsx';

const StudentLayout = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flexGrow: 1, padding: '10px' }}>{children}</main>
      <Footer />
    </div>
  );
};

export default StudentLayout;
