// packages import
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// React Query import
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./queryClient";

// pages import
import SearchPage from "./pages/SearchPage";
import TrackPage from "./pages/TrackPage";

// style import
import "./styles/App.css";

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/track/:id" element={<TrackPage />} />
        </Routes>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
