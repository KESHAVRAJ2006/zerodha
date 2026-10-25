import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

const Orders = () => {
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/allOrders`).then((res) => {
      setAllOrders(res.data);
    });
  }, []);

  if (allOrders.length === 0) {
    return (
      <div className="orders">
        <div className="no-orders">
          <p>You haven't placed any orders today</p>

          <Link to={"/"} className="btn">
            Get started
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <h3 className="title">Orders ({allOrders.length})</h3>

      <div className="order-table">
        <table>
          <tr>
            <th>Time</th>
            <th>Type</th>
            <th>Instrument</th>
            <th>Qty.</th>
            <th>Price</th>
          </tr>

          {allOrders.map((order, index) => {
            const time = order.createdAt
              ? new Date(order.createdAt).toLocaleTimeString()
              : "-";
            const typeClass = order.mode === "SELL" ? "loss" : "profit";

            return (
              <tr key={index}>
                <td>{time}</td>
                <td className={typeClass}>{order.mode}</td>
                <td>{order.name}</td>
                <td>{order.qty}</td>
                <td>{Number(order.price).toFixed(2)}</td>
              </tr>
            );
          })}
        </table>
      </div>
    </>
  );
};

export default Orders;
