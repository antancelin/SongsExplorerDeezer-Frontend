// packages import
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// graphql import
import { ApolloProvider } from "@apollo/client";
import { client } from "./graphql/client";

// pages import
import SearchPage from "./pages/SearchPage";
import TrackPage from "./pages/TrackPage";

// style import
import "./styles/App.css";

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/track/:id" element={<TrackPage />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
};

export default App;
