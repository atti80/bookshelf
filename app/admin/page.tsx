import AdminList from "@/components/admin/AdminList";
import Navbar from "@/components/Navbar";

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-foreground">
      <Navbar title="Admin"></Navbar>
      <AdminList></AdminList>
    </div>
  );
};

export default AdminPage;
