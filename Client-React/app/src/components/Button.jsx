import React from "react"

function Button({title , onClick}) {
    return <button onClick={onClick}>
        {title || 'text'}
    </button>
}

export default Button