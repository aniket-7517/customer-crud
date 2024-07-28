import React from "react";
import { Routes, Route } from "react-router-dom";
import CustomerList from "./components/CustomerList";
import CustomerForm from "./components/CustomerForm";
import Navbar from "./Navbar";

const App = () => {
  return (
    <div>
      <Navbar/>
      <Routes>
          <Route path="/add" element={<CustomerForm/>} />
          <Route path="/edit/:id" element={<CustomerForm/>} />
          <Route path="/" element={<CustomerList/>}></Route>
      </Routes>
    </div>
  );
};

export default App;
