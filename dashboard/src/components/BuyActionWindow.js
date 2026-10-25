import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import { API_URL } from "../config";

import GeneralContext from "./GeneralContext";

import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid, mode }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [message, setMessage] = useState("");

  const generalContext = useContext(GeneralContext);

  const isSell = mode === "SELL";
  const marginRequired = (Number(stockQuantity) * Number(stockPrice)).toFixed(2);

  const handleOrderClick = async () => {
    try {
      await axios.post(`${API_URL}/newOrder`, {
        name: uid,
        qty: stockQuantity,
        price: stockPrice,
        mode: mode,
      });
      generalContext.closeBuyWindow();
    } catch (err) {
      const errMsg = err.response?.data?.message || "Something went wrong";
      setMessage(errMsg);
    }
  };

  const handleCancelClick = () => {
    generalContext.closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div
        className="header"
        style={{ background: isSell ? "#ff5722" : "#4184f3" }}
      >
        <h3>
          {isSell ? "Sell" : "Buy"} {uid} <span>NSE</span>
        </h3>
      </div>

      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
        {message && <p style={{ color: "#ff5722", fontSize: "0.8rem" }}>{message}</p>}
      </div>

      <div className="buttons">
        <span>
          {isSell ? "Amount" : "Margin required"} ₹{marginRequired}
        </span>
        <div>
          <Link
            to=""
            className="btn btn-blue"
            style={isSell ? { background: "#ff5722" } : {}}
            onClick={handleOrderClick}
          >
            {isSell ? "Sell" : "Buy"}
          </Link>
          <Link to="" className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
