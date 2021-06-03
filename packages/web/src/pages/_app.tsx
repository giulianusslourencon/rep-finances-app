import { ChakraProvider } from '@chakra-ui/react'
import { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import React from 'react'

import theme from '@theme/index'
import 'nprogress/nprogress.css'

const TopProgressBar = dynamic(
  () => {
    return import('@modules/page/TopProgressBar')
  },
  { ssr: false }
)

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <TopProgressBar />
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
