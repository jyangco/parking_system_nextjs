import './styles/globals.css'

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Your App</title>
            </head>
            <body>
                {children} 
            </body>
        </html>
    );
}