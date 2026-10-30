import { createContext, useContext, useState } from 'react';

const BrandForgeContext = createContext(null);

export function BrandForgeProvider({ children }) {
  const [user, setUser] = useState(null);
  const [brands, setBrands] = useState([]);

  function clearUser() {
    setUser(null);
  }

  return (
    <BrandForgeContext.Provider value={{ user, brands, setUser, setBrands, clearUser }}>
      {children}
    </BrandForgeContext.Provider>
  );
}

export function useBrandForge() {
  const context = useContext(BrandForgeContext);
  if (!context) {
    throw new Error('useBrandForge must be used within a BrandForgeProvider');
  }
  return context;
}
