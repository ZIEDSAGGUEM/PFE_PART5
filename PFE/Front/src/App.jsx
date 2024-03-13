import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useSelector, useDispatch } from "react-redux";
import {React} from "react"
import NewProduct from "./pages/NewProduct";
import ProductPage from "./pages/ProductPage";
import CategoryPage from "./pages/CategoryPage";
import ScrollToTop from "./components/ScrollToTop";
import CartPage from "./pages/CartPage";
import FavoritePage from "./pages/FavoritePage";
import Contact from "./components/Contact";
import EditProductPage from "./pages/EditProductPage";
import AdminDashboard from "./pages/AdminDashboard";
import { useState, useEffect } from "react";
import Story from "./components/Story";
import OrderPage from "./pages/OrderPage";
import { io } from "socket.io-client";
import { addNotification } from "./features/userSlice";
import Success from "./components/Success";
import UserCartPage from "./pages/UserCartPage";
import Failure from "./components/Failure";

function App() {
  const user = useSelector((state) => state.user);
  const [on, setOn] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    const socket = io("http://localhost:8080");
    socket.off("notification").on("notification", (msgObj, user_id) => {
      // logic for notification
      if (user_id === user._id) {
        dispatch(addNotification(msgObj));
      }
    });

    socket.off("new-order").on("new-order", (msgObj) => {
      if (user.isAdmin) {
        dispatch(addNotification(msgObj));
      }
    });
  }, []);
  const handleClick = (event, activate) => {
    if (activate) {
      const divContent =
        event.currentTarget.textContent || event.currentTarget.innerText;

      const utterance = new SpeechSynthesisUtterance(divContent);
      utterance.lang = "fr-FR"; // Code de langue français
      window.speechSynthesis.speak(utterance);
    }
    else{
      window.speechSynthesis.cancel()
    }
  };
  return (
    <div className="App">
      <button
        style={{
          height: "50px",
          width: "50px",
          right: "25px",
          borderRadius: "50%",
          zIndex: "999",
          top: "75px",
        }}
        className=" position-absolute bg-secondary text-primary "
        onClick={() => setOn(!on)}
      >
        {on ? "Off" : "On"}
      </button>
      <BrowserRouter>
        <Navigation on={on} handleClick={handleClick} />
        <ScrollToTop />

        <Routes>
          <Route index element={<Home on={on} handleClick={handleClick} />} />
          {!user && (
            <>
              <Route
                path="/login"
                element={<Login on={on} handleClick={handleClick} />}
              />
              <Route
                path="/signup"
                element={<Signup on={on} handleClick={handleClick} />}
              />
            </>
          )}

          {user && (
            <>
              <Route path="/cart" element={<UserCartPage />} />
              <Route path="/favorite" element={<FavoritePage />} />
              <Route path="/orders" element={<OrderPage />} />
              <Route path="/success" element={<Success/>}/>
              <Route path="/failure" element={<Failure/>}/>
            </>
          )}
          {user && user.isAdmin && (
            <>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/product/:id/edit" element={<EditProductPage />} />
              <Route path="/verify" element={<Story />} />
            </>
          )}

          <Route
            path="/product/:id"
            element={<ProductPage on={on} handleClick={handleClick} />}
          />
          <Route path="/category/:category" element={<CategoryPage />} />

          <Route path="/contact" element={<Contact />} />
          <Route path="/new-product" element={<NewProduct />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
