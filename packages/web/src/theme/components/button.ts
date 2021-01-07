export const Button = {
  baseStyle: {
    textTransform: 'uppercase',
    borderRadius: '1rem'
  },
  variants: {
    outline: {
      border: '1px solid purple.400',
      color: 'purple.400',
      _hover: {
        color: 'purple.600',
        border: '1px solid purple.600',
        _disabled: { color: 'red.500', border: '1px solid red.500' }
      }
    },
    solid: {
      color: 'white',
      bg: 'purple.400',
      _hover: {
        bg: 'purple.600',
        _disabled: { bg: 'red.500' }
      }
    }
  },
  defaultProps: {
    variant: 'solid'
  }
}
