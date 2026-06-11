import Navbar from "@/app/(components)/navbar";

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      {children}
    </div>
  );
}
