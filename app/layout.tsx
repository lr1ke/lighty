import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { ThemeProvider } from '@/app/context/ThemeContext';
// import ThemeManager from '@/app/context/ThemeManager';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          {/* <ThemeManager /> */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}