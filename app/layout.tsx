import "./globals.css";
export const metadata = { title: "IDEA Workshop", description: "A workshop on authorship, AI, and possible futures." };
export default function RootLayout({children}: {children: React.ReactNode}) {return <html lang="en"><body>{children}</body></html>}
