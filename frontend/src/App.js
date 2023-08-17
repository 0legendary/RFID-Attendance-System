
import LoginPage from "./Components/User/LoginPage";
import HomePage from "./Components/User/HomePage";
import Header from "./Components/User/Header";
import Footer from "./Components/User/Footer";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
 
} from "react-router-dom"
import Admin from "./Components/Admin/Admin";
import AdminHeader from "./Components/Admin/AdminHeader";
import UserRegistration from "./Components/Admin/UserRegistration";
import GenerateUID from "./Components/Admin/CardCreation/GenerateUID";
import CardforNewUser from "./Components/Admin/CardCreation/CardforNewUser";
import UIDCreationForm from "./Components/Admin/CardCreation/UIDCreationForm";
import RFIDCardDetails from "./Components/Admin/RFIDCardDetails";



const Layout = ()=>{
  return (
    <div>
      <Header/>
      <Outlet />
      <Footer/>
    </div>
   
  )
}
const AdminLayout = ()=>{
  return (
    <div>
      <AdminHeader/>
      <Outlet />
      <Footer/>
    </div>
   
  )
}
const Registration = ()=>{
  return (
    <div>
      <UserRegistration/>
    </div>
  )
}

const  UserLoginPage= ()=>{
  return (
    <div> 
      <LoginPage/>
      
    </div>
  )
}

const HomePageUser = ()=>{
  return (
    <div>
    <HomePage/>
    </div>
  )
}


const AdminHomePage = ()=>{
  return (
    <div>
    <Admin/>
    </div>
  )
}
/* generating the uid using randomly */

const GenerateUIDpath = ()=>{
  return (
    <div>
    <GenerateUID/>
    </div>
  )
}
const CreateNewCardByUID = ()=>{
  return (
    <div>
      <UIDCreationForm/>
    </div>
  )
}
const CreateNewUserByCard = ()=>{
  return (
    <div>
    <CardforNewUser/>
    </div>
  )
}
const RFIDScannedCards = ()=>{
  return (
    <div>
    <RFIDCardDetails/>
    </div>
  )
}


function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<Layout/>}>
          <Route index element={<UserLoginPage/>}></Route>
        </Route>
        <Route path="/home" element={<Layout/>}>
          <Route index element={<HomePageUser/>}></Route>
        </Route>


        <Route path="/admin" element={<AdminLayout/>}>
          <Route index element={<AdminHomePage/>}></Route>
        </Route>
        <Route path="/admin/register" element={<AdminLayout/>}>
          <Route index element={<Registration/>}></Route>
        </Route>
        <Route path="/admin/rfid-scanned-cards" element={<AdminLayout/>}>
          <Route index element={<RFIDScannedCards/>}></Route>
        </Route>


        <Route path="/admin/generateuid" element={<AdminLayout/>}>
          <Route index element={<GenerateUIDpath/>}></Route>
        </Route>
        <Route path="/admin/new-card" element={<AdminLayout/>}>
          <Route index element={<CreateNewCardByUID/>}></Route>
        </Route>
        <Route path="/admin/new-user" element={<AdminLayout/>}>
          <Route index element={<CreateNewUserByCard/>}></Route>
        </Route>

      </Route>
      
    )
  )
  return (
    <div>
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;

