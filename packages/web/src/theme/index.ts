import { extendTheme } from '@chakra-ui/react'

import { Button } from './components/button'
import { Cash } from './components/cash'
import { FormLabel } from './components/formLabel'
import { Heading } from './components/heading'
import { IdBox } from './components/idBox'
import { Text } from './components/text'
import { colors } from './foundations/colors'
import { fonts } from './foundations/fonts'
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
    Text,
    FormLabel
  }
})

export default customTheme
