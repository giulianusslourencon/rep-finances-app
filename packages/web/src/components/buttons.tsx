import React from 'react'

import Button from './button'

type Props = {
  buttons: { title: string; href: string }[]
}

const Buttons: React.FC<Props> = ({ buttons }) => {
  return (
    <>
      {buttons.length > 0 && (
        <div id="buttons">
          {buttons.map((button, index) => (
            <>
              <Button button={button} key={button.title} />
              {index !== buttons.length - 1 && (
                <hr className="lineAmongButtons" key={button.title} />
              )}
            </>
          ))}
        </div>
      )}
    </>
  )
}

export default Buttons
