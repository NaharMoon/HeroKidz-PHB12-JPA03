"use client";

import Swal from "sweetalert2";
import { updateOrderStatus } from "@/actions/server/Order";

const OrderStatusSelect = ({ orderId, currentStatus }) => {
  const handleChange = async (e) => {
    const status = e.target.value;
    const result = await updateOrderStatus(orderId, status);
    if (!result.success) {
      Swal.fire("Unable to update", result.message || "Something went wrong.", "error");
      e.target.value = currentStatus;
      return;
    }
    Swal.fire("Updated", `Order status changed to ${status}.`, "success");
  };

  return (
    <select defaultValue={currentStatus} className="select select-bordered select-sm" onChange={handleChange}>
      <option value="pending">pending</option>
      <option value="processing">processing</option>
      <option value="shipped">shipped</option>
      <option value="delivered">delivered</option>
      <option value="cancelled">cancelled</option>
    </select>
  );
};

export default OrderStatusSelect;
