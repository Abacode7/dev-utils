import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import JsonValidator from './pages/JsonValidator';
import JsonMinifier from './pages/JsonMinifier';
import JWTDecoder from './pages/JWTDecoder';
import JasyptEncryption from './pages/JasyptEncryption';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/json-validator" element={<JsonValidator />} />
          <Route path="/json-minifier" element={<JsonMinifier />} />
          <Route path="/jwt-decoder" element={<JWTDecoder />} />
          <Route path="/jasypt" element={<JasyptEncryption />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App
