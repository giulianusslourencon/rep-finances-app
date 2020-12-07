import Link from 'next/link'
import React from 'react'

type Props = {
  button: { title: string; href: string }
}

const Button: React.FC<Props> = ({ button }) => {
  return (
    <div className="headerButton">
      <Link href={button.href}>
        <a>{button.title}</a>
      </Link>
    </div>
  )
}

export default Button
