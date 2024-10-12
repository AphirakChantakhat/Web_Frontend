import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import History from "./components/History/List.js"
import Devices from "./components/Device/List.js"
import Groups from "./components/Group/List.js"
import "./style/app.css"
import Users from "./components/User/List.js";
import AddUser from "./components/User/AddUser.js";
import EditUser from "./components/User/EditUser.js";
import AddDevice from "./components/Device/AddDevice.js";
import EditDevice from "./components/Device/EditDevice.js";
import AddGroup from "./components/Group/AddGroup.js";
import EditGroup from "./components/Group/EditGroup.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<History />} />
        <Route path="/dashboard/user/list" element={<Users />} />
        <Route path="/dashboard/user/add" element={<AddUser/>}/>
        <Route path="/dashboard/user/edit/:id" element={<EditUser/>}/>
        <Route path="/dashboard/devices/list" element={<Devices />} />
        <Route path="/dashboard/devices/add" element={<AddDevice />} />
        <Route path="/dashboard/devices/edit/:id" element={<EditDevice />} />
        <Route path="/dashboard/groups/list" element={<Groups />} />
        <Route path="/dashboard/groups/add" element={<AddGroup />} />
        <Route path="/dashboard/groups/edit/:id" element={<EditGroup/>}/>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
