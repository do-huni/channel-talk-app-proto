import './App.css';
import { AppProvider } from '@channel.io/bezier-react';
import { isMobile } from './utils/userAgent';

function App() {
  return (
    <AppProvider>
      <div style={{ padding: isMobile() ? '16px' : '0 24px 24px 24px' }}>
        <div>2승준 화이팅</div>
      </div>
    </AppProvider>
  );
}

export default App;
