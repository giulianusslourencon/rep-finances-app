export const IdBox = {
  baseStyle: {
    textTransform: 'uppercase'
  },
  sizes: {
    sm: {
      borderRadius: '0.125rem',
      width: '1.5rem',
      height: '1.5rem',
      fontSize: '1rem'
    },
    lg: {
      borderRadius: '0.5rem',
      width: '4.5rem',
      height: '4.5rem',
      fontSize: '3.25rem'
    }
  },
  variants: {
    outline: {
      border: '1px solid purple.400',
      color: 'purple.400'
    },
    solid: {
      bg: 'purple.400'
    }
  },
  defaultProps: {
    size: 'sm',
    variant: 'solid'
  }
}
