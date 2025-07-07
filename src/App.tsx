import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import JsonValidator from './pages/JsonValidator';
import JsonMinifier from './pages/JsonMinifier';
import JwtDecoder from './pages/JwtDecoder';
import JasyptEncryption from './pages/JasyptEncryption';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/json-validator" element={<JsonValidator />} />
          <Route path="/json-minifier" element={<JsonMinifier />} />
          <Route path="/jwt-decoder" element={<JwtDecoder />} />
          <Route path="/jasypt" element={<JasyptEncryption />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App
