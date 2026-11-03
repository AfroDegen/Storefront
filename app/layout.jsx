import "./globals.css";

export const metadata = {
  title: "Storefront Drawing Board",
  description: "A visual storefront prototyping workspace."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}