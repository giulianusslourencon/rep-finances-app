export const Button = {
  baseStyle: {
    textTransform: 'uppercase',
    borderRadius: '1rem'
  },
  variants: {
    outline: {
      border: '1px solid purple.400',
      color: 'purple.400'
    },
    solid: {
      color: 'white',
      bg: 'purple.400'
    }
  },
  defaultProps: {
    variant: 'solid'
  }
}
