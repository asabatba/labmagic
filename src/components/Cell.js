
import React from 'react';
import chroma from 'chroma-js';
import { blackOrWhite } from './SavedColors';


function Cell({ color, savedColors, setSavedColors, borderColor }) {

    // const textColor = blackOrWhite(color);
    const textColor = chroma(blackOrWhite(color)).alpha(0.7).hex();

    const thisHex = color.hex();

    const alreadySaved = savedColors.includes(thisHex);

    const handleClick = (ev) => {
        ev.preventDefault();
        if (alreadySaved) {
            setSavedColors(savedColors.filter((c) => c !== thisHex));
        } else {
            setSavedColors(savedColors.concat(thisHex));
        }
    }
    // className={alreadySaved ? "saved" : "not-saved"}
    return (<td onClick={handleClick} style={{ borderRadius: '2px', textAlign: 'center', color: textColor, backgroundColor: color.hex(), borderColor: alreadySaved ? (borderColor) : 'transparent' }}>
        {color.hex()}
    </td>)
}

export default Cell;