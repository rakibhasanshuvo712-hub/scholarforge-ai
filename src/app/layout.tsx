import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ScholarForge AI — AI Presentation Maker, Lab Report & Assignment Generator',
  description:
    'All-in-one academic productivity web app for students and researchers. Generate PowerPoint (.pptx), Word (.docx) with university cover pages, and printable PDF documents with embedded Mermaid.js diagrams.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
