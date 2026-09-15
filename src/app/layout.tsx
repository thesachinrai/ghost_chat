import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "ghost- Private Self-Destructing Chat",
    template: "%s | Phantom",
  },
  description:
    "Private conversations that vanish into thin air. No sign-up, no history, no trace. Secure, anonymous, and ephemeral messaging for everyone.",
  applicationName: "Phantom",
  authors: [{ name: "Phantom Team" }],
  keywords: [
    "private chat",
    "self-destructing messages",
    "anonymous chat",
    "secure messaging",
    "ephemeral chat",
    "encrypted chat",
    "realtime chat",
  ],
  creator: "Phantom Team",
  publisher: "Phantom Team",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://phantom-chat-app.vercel.app"),
  openGraph: {
    title: "Phantom - Private Self-Destructing Chat",
    description:
      "Private conversations that vanish into thin air. No sign-up, no history, no trace. Secure, anonymous, and ephemeral messaging.",
    url: "/",
    siteName: "Phantom",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Phantom - Private Self-Destructing Chat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Phantom - Private Self-Destructing Chat",
    description:
      "Private conversations that vanish into thin air. No sign-up, no history, no trace.",
    creator: "@phantom_chat", // Placeholder
    images: ["/og.png"],
  },
}

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else if (theme === 'dark' || !theme) {
                    document.documentElement.classList.add('dark');
                  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${jetbrainsMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
