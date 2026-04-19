import Landing from "./pages/Landing";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";

function App() {
  return (
    <>
      <Routes>
  
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
