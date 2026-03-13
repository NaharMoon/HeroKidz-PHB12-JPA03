"use client";

import Swal from "sweetalert2";
import { updateUserRole } from "@/actions/server/admin";

const RoleSelect = ({ userId, currentRole }) => {
  const handleChange = async (e) => {
    const role = e.target.value;
    const result = await updateUserRole(userId, role);
    if (!result.success) {
      Swal.fire("Unable to update", result.message || "Something went wrong.", "error");
      e.target.value = currentRole;
      return;
    }
    Swal.fire("Updated", `Role changed to ${role}.`, "success");
  };

  return (
    <select defaultValue={currentRole} className="select select-bordered select-sm" onChange={handleChange}>
      <option value="user">user</option>
      <option value="admin">admin</option>
    </select>
  );
};

export default RoleSelect;
