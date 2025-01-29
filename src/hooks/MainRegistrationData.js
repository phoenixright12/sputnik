import { createContext, useContext, useState } from "react";

const MainRegistrationDataContext = createContext();
export const useRegistrationData = () =>
  useContext(MainRegistrationDataContext);

// Провайдер контекста
export const MainRegistrationDataProvider = ({ children }) => {
  const [registrationData, setRegistrationData] = useState({});

  return (
    <MainRegistrationDataContext.Provider // Здесь исправлено
      value={{ registrationData, setRegistrationData }}
    >
      {children}
    </MainRegistrationDataContext.Provider>
  );
};
