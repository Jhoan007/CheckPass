import React, { useEffect, useState } from 'react';

const Navbar = () => {
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setNombre(user.nombreCompleto); // nombre completo de login
    }
  }, []);

  return (
    <header className="navbar">
      <div className="user-name">Hola, {nombre || 'Invitado'}</div>
    </header>
  );
};

export default Navbar;
