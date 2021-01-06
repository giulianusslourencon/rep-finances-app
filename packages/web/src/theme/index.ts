import { extendTheme } from '@chakra-ui/react'

import { colors } from './colors'
import { Button } from './components/button'
import { Cash } from './components/cash'
import { Heading } from './components/heading'
import { IdBox } from './components/idBox'
import { Text } from './components/text'
import { fonts } from './fonts'
import { styles } from './styles'

const customTheme = extendTheme({
  colors,
  fonts,
  styles,
  components: {
    IdBox,
    Cash,
    Button,
    Heading,
    Text
  }
})

export default customTheme
