import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NoFilterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex flex-col">
      <Navbar></Navbar>
      <main className="bg-[url(/images/bookshelf.jpg)] bg-gray-500 bg-blend-multiply py-8 min-w-full grow">
        {children}
      </main>
      <Footer></Footer>
    </div>
  );
}
