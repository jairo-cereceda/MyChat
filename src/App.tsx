import { ChatProvider } from './context/ChatContextProvider';
import AppContent from './AppContent';

function App() {
  return (
    <ChatProvider>
      <AppContent />
    </ChatProvider>
  );
}

export default App;
