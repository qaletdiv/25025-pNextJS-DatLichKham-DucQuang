import type { Metadata } from "next";
import "./globals.css";
import Header from "./Components/Common/Header/Header";
import Footer from "./Components/Common/Footer/Footer";
import { GetMe } from "./(Auth)/login/action";

export const metadata: Metadata = {
  title: "Booking App",
  description: "Hệ thống đặt lịch khám bệnh",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await GetMe();

  return (
    <html lang="vi">  
      <body className="flex min-h-screen flex-col bg-gray-50">
        <header className="shrink-0">
          <Header user={user} />
        </header>
        <main className="flex-grow">
          {children}
        </main>
        <footer className="shrink-0">
          <Footer />
        </footer>

      </body>
    </html>
  );
}