import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/LoginPage/loginPage';
import Register from './pages/RegisterPage/registerPage';
import Layout from './components/layout/layout';
import AddItem from './pages/addItemPage/addItemPage'
import MyAccountPage from './pages/myAccount/myAccount';
import Home from './pages/HomePage/Home';
import MyLibraryPage from './pages/MyLibrary/myLibraryPage';
import ViewCollection from './components/viewCollection/viewCollection';
import LandingPage from './pages/landingPage/landingPage'
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<LandingPage/>}/>
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/home" element={<Layout children={<Home/>} path="/home" />}/>
          <Route path='/newItem' element={<Layout children={<AddItem/>}/>}/>
          <Route path="/myaccount" element={<Layout children={<MyAccountPage/>}/>}/>
          <Route path="/MyLibrary" element={<Layout children={<MyLibraryPage/>}/>}/>
          <Route path="MyLibrary/viewCollection/:collectionId" element={<Layout children={<ViewCollection/>}/>}/>
          <Route path="*" element={<div>error</div>} />
        </Routes>
      </BrowserRouter>
    </> 
  );
}

export default App;