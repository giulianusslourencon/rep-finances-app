import { Button, ButtonProps, useStyleConfig } from '@chakra-ui/react'
import React from 'react'

const StyledButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  const styles = useStyleConfig('Button')

  return (
    <Button sx={styles} {...props}>
      {children}
    </Button>
  )
}

export default StyledButton
