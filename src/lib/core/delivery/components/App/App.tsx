import React from 'react';
import AuthGate from '../../../../features/auth/delivery/AuthGate';
import { TextScreenContainer } from '../../../../features/texts/delivery/components/TextScreen/TextScreenContainer';
import "./App.css";

function App() {
  return <AuthGate home={<TextScreenContainer />}/>;
}

export default App;
