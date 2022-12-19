import React, { useEffect } from 'react';
import AuthGateContainer from '../../../../features/auth/delivery/AuthGate';
import { TextScreenContainer } from '../../../../features/texts/delivery/components/TextScreen/TextScreenContainer';
import "./App.css";

function App() {
  useEffect(() => {
    document.title = "ОЦРВ Запись";
  }, []);
  return <AuthGateContainer home={<TextScreenContainer />}/>;
}

export default App;
