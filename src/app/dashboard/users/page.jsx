import { getAllUsers } from "@/actions/server/admin";
import RoleSelect from "@/components/dashboard/RoleSelect";
import { formatDate } from "@/lib/format";

export const metadata = {
  title: "Manage Users",
};

const DashboardUsersPage = async () => {
  const users = await getAllUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">User Management</h1>
        <p className="mt-2 text-base-content/60">View registered users and control admin access.</p>
      </div>

      <div className="overflow-x-auto rounded-[2rem] border border-base-300 bg-base-100 shadow-sm">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Provider</th>
              <th>Created</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name || "—"}</td>
                <td>{user.email}</td>
                <td>{user.provider || "credentials"}</td>
                <td>{formatDate(user.createdAt)}</td>
                <td><RoleSelect userId={user._id} currentRole={user.role || "user"} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardUsersPage;
