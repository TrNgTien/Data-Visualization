import Content from "./components/content/Content";
import Header from "./components/header/Header";
import Sidebar from "./components/sidebar/Sidebar";
import "./App.css";

function App() {
  return (
    <>
      <Header />
      <div className="container">
        <Content />
      </div>
    </>
  );
}

export default App;
