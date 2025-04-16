import AdminList from "@/components/admin/AdminList";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AdminPage = () => {
  return (
    <div className="grid grid-cols-5">
      <div className="w-[180px] flex flex-col gap-2 p-8">
        <Button asChild variant="outline" className="hover:border-background">
          <Link href="/admin/article/new">New</Link>
        </Button>
        <Button asChild variant="outline" className="hover:border-background">
          <Link href="/">Exit</Link>
        </Button>
      </div>
      <AdminList></AdminList>
    </div>
  );
};

export default AdminPage;
