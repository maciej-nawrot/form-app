import React from "react";
import "./App.css";
import DishForm from "./components/DishForm";

function App() {
  return (
    <div className="wrapper">
      <h1>Add a dish</h1>
      <DishForm />
    </div>
  );
}

export default App;
