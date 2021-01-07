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
        borderColor: 'purple.600'
      }
    },
    solid: {
      color: 'white',
      bg: 'purple.400',
      _hover: {
        bg: 'purple.600'
      }
    }
  },
  defaultProps: {
    variant: 'solid'
  }
}
