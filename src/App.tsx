import { ChatProvider } from './context/chatContextProvider';
import AppContent from './AppContent';
import { DriveProvider } from './context/DriveContext';

function App() {
  return (
    <DriveProvider>
      <ChatProvider>
        <AppContent />
      </ChatProvider>
    </DriveProvider>
  );
}

export default App;
