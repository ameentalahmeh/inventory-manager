import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

// Import main views
import MainPage from "./PagesViews/MainPage";
import Product from "./PagesViews/Product";
import Location from "./PagesViews/Location";

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" component={MainPage} />
        <Route exact path="/product" component={Product} />
        <Route exact path="/location" component={Location} />
      </Router>
    </div>
  );
}

export default App;
