import "./App.css";
import Home from "./pages/home/Home";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="App">
      <Home />
      <Toaster
        toastOptions={{
          style: {
            fontSize: "17px",
          },
        }}
      />
    </div>
  );
}

export default App;
