export const IdBox = {
  baseStyle: {
    display: 'table-cell',
    textAlign: 'center',
    verticalAlign: 'middle',
    textTransform: 'uppercase'
  },
  sizes: {
    sm: {
      borderRadius: '2px',
      width: '24px',
      height: '24px',
      fontSize: '16px'
    },
    lg: {
      borderRadius: '8px',
      width: '72px',
      height: '72px',
      fontSize: '52px'
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
