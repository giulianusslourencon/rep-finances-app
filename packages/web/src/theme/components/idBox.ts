export const IdBox = {
  baseStyle: {
    textTransform: 'uppercase',
    cursor: 'default',
    userSelect: 'none'
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
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'purple.400',
      color: 'purple.400',
      _hover: {
        borderColor: 'purple.600',
        color: 'purple.600'
      }
    },
    solid: {
      bg: 'purple.400',
      _hover: {
        bg: 'purple.600'
      }
    }
  },
  defaultProps: {
    size: 'sm',
    variant: 'solid'
  }
}
