import React from 'react';

const Popup = (props)=>{
    return(
        <div class="Popup-wrapper" id="Popup-modal">
            <div class="Popup-modelContent">
                <a href="#" class="Popup-modelClose">&times;</a>
                <div className="Popup-image">book image</div>
                <div className="Popup-infos">book infos</div>
            </div>
        </div>
    )
}
export default Popup;