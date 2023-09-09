import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@material-tailwind/react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Header from './components/Layout/Header';
import JobPage from './pages/JobPage';
import NotFoundPage from './pages/NotFoundPage';

const queryClient = new QueryClient();

export const App = () => {
  return (
    <>
      <div className="w-screen-full">
        <Header />

        {/* Jobs */}
        <div className="container max-w-6xl mx-auto mt-10">
          <Routes>
            <Route path="/" element={<JobPage />} />
            <Route path="/jobs" element={<JobPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export const WrappedApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default WrappedApp;
