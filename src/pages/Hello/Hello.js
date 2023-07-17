import React from 'react'
import { useScreenSizeContext } from 'hooks'
import { screenTypes } from 'scripts/generalVariables'

const Hello = () => {
    const screenSize = useScreenSizeContext()

    return (
        <div>
            <h1>Hello world page</h1>
            <p>Screen: {screenTypes[screenSize]}</p>
        </div>
    )
}

export default Hello
