import React, { useState } from "react";
import Button from "./Button";

function Header(props) {

    const [isPopUpVisible, setPopUpVisible] = useState(false)

    function popUp() {
        console.log('button clicked!')
        setPopUpVisible(!isPopUpVisible)
    }

    return <> <header>{
        props.text || 'Default'}
        <div className="headerDiv">
            <Button title="sign in" />
            <Button onClick={popUp} title="login" />
            
        </div>
        {isPopUpVisible && (<div className='loginDiv'>

                <input className='inputLogin' value="username"></input>
                <input className='inputLogin' value="password"></input>

            </div>
        )}
    </header>
    </>
}

export default Header