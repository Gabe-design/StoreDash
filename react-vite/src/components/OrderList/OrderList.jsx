// react-vite/src/components/OrderList/OrderList.jsx 

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { thunkGetOrders } from "../../redux/orders";
import "./OrderList.css";

// This is the OrderList component
export default function OrderList() {
  const dispatch = useDispatch();

  // This will get the list of orders from Redux
  const orders = useSelector((state) => state.orders.list);

  // This will fetch orders on component mount
  useEffect(() => {
    dispatch(thunkGetOrders());
  }, [dispatch]);

  return (
    <div className="order-list-page">
      <h2 className="order-list-title">Order List</h2>

      {/* This will show empty state if no orders exist */}
      {orders.length === 0 ? (
        <div className="order-list-empty">No orders yet.</div>
      ) : (
        <table className="order-list-table">
          <thead>
            <tr>
              <th>Buyer</th>
              <th>Email</th>
              <th>Status</th>
              <th>Date</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                {/* This will display the buyer name */}
                <td>{order.buyer_name}</td>

                {/* This will display the buyer email */}
                <td>{order.buyer_email}</td>

                {/* This will display the order status */}
                <td>{order.status}</td>

                {/* This will display the formatted order date */}
                <td>{new Date(order.created_at).toLocaleString()}</td>

                {/* This will show the view link icon */}
                <td>
                  <Link
                    to={`/dashboard/orders/${order.id}`}
                    className="order-list-view"
                  >
                    👁️
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
