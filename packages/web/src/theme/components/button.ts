export const Button = {
  baseStyle: {
    textTransform: 'uppercase',
    borderRadius: '1rem'
  },
  variants: {
    outline: {
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'purple.400',
      color: 'purple.400',
      _hover: {
        color: 'purple.600',
        borderColor: 'purple.600',
        _disabled: { color: 'red.500', borderColor: 'red.500' }
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
