import { ChatProvider } from './context/chatContextProvider';
import AppContent from './AppContent';

function App() {
  return (
    <ChatProvider>
      <AppContent />
    </ChatProvider>
  );
}

export default App;
