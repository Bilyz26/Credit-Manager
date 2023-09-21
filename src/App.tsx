import {  useState } from "react";
import { Sidebar } from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import {Creditors} from "./components/Creditors";
import  "./App.css";
import Debts from "./components/Debts";

function App() {
  const [selectedMenu, setSelectedMenu] = useState("Dashboard")
  
  return (
    <div className="overflow-hidden flex" style={{"fontFamily": "Outfit", "height": "100vh"}}>
      <Sidebar setSelectedMenu={setSelectedMenu}></Sidebar>
      {selectedMenu === "Dashboard" && <Dashboard />}
      {selectedMenu === "Creditors" && <Creditors />}
      {selectedMenu === "Debts"      && <Debts />}
    </div>
  );
}

export default App;
