// MyContext.jsx
import React, { createContext, useContext, useState } from "react";

const MyContext = createContext();

export const useMyContext = () => {
  return useContext(MyContext);
};

export const MyContextProvider = ({ children }) => {
  const [activate, setActivate] = useState(true);

  const handleMouseEnter = (event) => {
    if (activate) {
      const { currentTarget } = event;
      const divContent = currentTarget.textContent || currentTarget.innerText;

      const utterance = new SpeechSynthesisUtterance(divContent);
      utterance.lang = "fr-FR";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <MyContext.Provider value={{ activate, setActivate, handleMouseEnter }}>
      {children}
    </MyContext.Provider>
  );
};
export default MyContextProvider;
