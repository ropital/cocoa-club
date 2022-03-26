import type { AppProps } from 'next/app'
import { WalletProvider } from 'src/context/WalletProvider'
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  initialColorMode: 'dark',
  useSystemColorMode: false
})

function MatchaCreamApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <WalletProvider>
        <Component {...pageProps} />
      </WalletProvider>
    </ChakraProvider>
  )
}

export default MatchaCreamApp
