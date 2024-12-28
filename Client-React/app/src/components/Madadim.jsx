import React from "react"


function Madadim(props) {

    return <div className="madadim" >
        <img className='madadimPic' src={props.img} />
        <button>{props.text}</button>
    </div>
}

export default Madadim