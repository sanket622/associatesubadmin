import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css"
import Login from "./components/auth/Login";
import NewPassword from "./components/auth/NewPassword";
import DashboardLayout from "./components/dashboard/dashbordlayout/DashboardLayout";

function App() {

  return (
    <>      
        <BrowserRouter>
          <Routes>           
            <Route path="/login" element={<Login />} />           
            <Route path="/newpassword" element={<NewPassword />} />
            <Route path="/*" element={<DashboardLayout />} />                                           
          </Routes>
        </BrowserRouter>
     
    </>
  );
}

export default App;
