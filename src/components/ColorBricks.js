
import chroma from 'chroma-js';
import React, { useState } from 'react';
import BricksTable from './BricksTable';
import './ColorBricks.css';
import ControlPanel from './ControlPanel';


function numRange(lower, upper, stepNum) {

    const a = Array(stepNum).fill();
    // Both lower and upper included in end array.
    return a.map((v, i) => lower + i * (upper - lower) / (stepNum - 1));
}

function ColorBricks({ lightness, setLightness, savedColors, setSavedColors, aCenter, bCenter, setACenter, setBCenter, range, setRange }) {

    // const vr = 48;
    const aValues = numRange(aCenter - range, aCenter + range, 15); // [-128, 128];
    const bValues = numRange(bCenter - range, bCenter + range, 15);
    // console.log(aValues, bValues);
    const chromaMatrix = aValues.map((a) => bValues.map((b) => chroma.lab(lightness, a, b)));
    // console.log(chromaMatrix);

    const [centerHex, setCenterHex] = useState(chroma('#000'));


    return (<div className="panel-and-table">
        <ControlPanel setCenterHex={setCenterHex} setLightness={setLightness} setACenter={setACenter} setBCenter={setBCenter} setRange={setRange} aCenter={aCenter} bCenter={bCenter} lightness={lightness} range={range}></ControlPanel>
        <div style={{ height: '6px' }}></div>
        <BricksTable chromaMatrix={chromaMatrix} savedColors={savedColors} setSavedColors={setSavedColors} centerHex={centerHex}></BricksTable>

    </div>);
}

export default ColorBricks;