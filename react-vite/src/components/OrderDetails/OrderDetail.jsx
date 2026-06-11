import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetOrderById, thunkUpdateOrder, thunkDeleteOrder } from "../../redux/orders";
import "./OrderDetail.css";

export default function OrderDetail() {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const order = useSelector((state) => state.orders.current);
  const [status, setStatus] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    dispatch(thunkGetOrderById(orderId));
  }, [dispatch, orderId]);

  useEffect(() => {
    if (order?.status) setStatus(order.status);
  }, [order]);

  const handleSave = async () => {
    await dispatch(thunkUpdateOrder(orderId, status));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this order? This cannot be undone.")) {
      await dispatch(thunkDeleteOrder(orderId));
      navigate("/dashboard/orders");
    }
  };

  if (!order?.id) return <p className="order-details-loading">Loading order...</p>;

  return (
    <div className="order-details-page">
      <Link to="/dashboard/orders" className="order-details-back">← Back to Orders</Link>
      <h2 className="order-details-title">Order #{order.id}</h2>

      <table className="order-details-table">
        <tbody>
          <tr>
            <td>Buyer Name</td>
            <td>{order.buyer_name}</td>
          </tr>
          <tr>
            <td>Buyer Email</td>
            <td>{order.buyer_email}</td>
          </tr>
          <tr>
            <td>Total</td>
            <td>${order.total_price?.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Date</td>
            <td>{new Date(order.created_at).toLocaleString()}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>
              <select
                className="order-details-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="fulfilled">Fulfilled</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>

      <h3 className="order-details-products-title">Products Ordered</h3>
      {order.products?.length > 0 ? (
        <table className="order-details-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {order.products.map((product) => (
              <tr key={product.id}>
                <td>{product.title}</td>
                <td>${product.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No products listed for this order.</p>
      )}

      <div className="order-details-actions">
        <button className="order-details-save" onClick={handleSave}>
          {saved ? "Saved!" : "Save Status"}
        </button>
        <button className="order-details-delete" onClick={handleDelete}>
          Delete Order
        </button>
      </div>
    </div>
  );
}
