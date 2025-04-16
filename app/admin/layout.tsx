import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-foreground">
      <Navbar title="Admin" linkUrl="/admin"></Navbar>
      {children}
      <Toaster></Toaster>
    </div>
  );
}
