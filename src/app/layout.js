import './globals.css';

export const metadata = {
  title: 'Dedsec by Samux',
  description: 'Sistema pessoal de gerenciamento',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#050a0f] text-white min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}