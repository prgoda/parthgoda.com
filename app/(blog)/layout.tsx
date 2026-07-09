import Masthead from "@/components/layout/Masthead";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Masthead />
      <Nav />
      <main className="max-w-6xl mx-auto px-4 py-10">{children}</main>
      <Footer />
    </>
  );
}
