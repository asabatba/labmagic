
import React from 'react';
import { blackOrWhite } from './SavedColors';


function Cell({ color, savedColors, setSavedColors, borderColor }) {

    const text = blackOrWhite(color);
    // chroma.distance(color, '#000') < chroma.distance(color, '#fff') ? 'white' : 'black';

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
    return (<td onClick={handleClick} style={{ color: text, backgroundColor: color.hex(), borderColor: alreadySaved ? (borderColor) : 'transparent' }}>
        {color.hex()}
    </td>)
}

export default Cell;