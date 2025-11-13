import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './state/AuthContext';
import AppRouter from './router/AppRouter';
import './styles/global.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
