import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Next.js example - Boox'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' data-bs-theme='dark'>
      <head>
        <link
          href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css'
          rel='stylesheet'
          integrity='sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH'
          crossOrigin='anonymous'
        />
      </head>

      <body
        className='vstack min-vh-100 bg-body-secondary'
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  )
}
