import Nav from '@/components/Nav'
import '@/styles/globals.css'
import {Analytics} from '@vercel/analytics/react'
import { SessionProvider } from "next-auth/react"
import { ChakraProvider } from '@chakra-ui/react'

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return(
    <>
      <SessionProvider session={session}>
        <ChakraProvider>
      <Nav></Nav>
      <Component {...pageProps} />

      <Analytics/>
      </ChakraProvider>

      </SessionProvider>
    </>


  ) 
}
