import AdminList from "@/components/admin/AdminList";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AdminPage = () => {
  return (
    <div className="flex max-sm:flex-col lg:grid lg:grid-cols-5">
      <div className="w-full max-sm:justify-between max-sm:px-4 sm:max-w-[180px] flex sm:flex-col gap-2 py-8 lg:p-8">
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
