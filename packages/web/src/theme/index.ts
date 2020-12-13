import { extendTheme } from '@chakra-ui/react'

import { colors } from './colors'
import { Button } from './components/button'
import { Cash } from './components/cash'
import { IdBox } from './components/idBox'
import { fonts } from './fonts'
import { styles } from './styles'

const customTheme = extendTheme({
  colors,
  fonts,
  styles,
  components: {
    IdBox,
    Cash,
    Button
  }
})

export default customTheme
