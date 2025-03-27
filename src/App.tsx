import chroma from 'chroma-js';
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import ColorBricks from "./components/ColorBricks";
import SavedColors from "./components/SavedColors";

function App() {

  const [savedColors, setSavedColors] = useState(['#8dbcd1', '#8fcca6', '#c29ceb', '#f5a748', '#9a9687', '#e38292', '#a4b339']);
  const [lightness, setLightness] = useState(80);
  const [aCenter, setACenter] = useState(0);
  const [bCenter, setBCenter] = useState(0);
  const [range, setRange] = useState(48);

  const bg = useMemo(() => chroma.lab(lightness, aCenter, bCenter), [lightness, aCenter, bCenter]);
  const fg = useMemo(() => bg.get('hsl.l') > 0.5 ? 'black' : 'white', [bg]);
  const appDiv = useRef(null);
  useLayoutEffect(() => {
    appDiv.current.style.backgroundColor = bg;
    appDiv.current.style.color = fg;
    //  style={{ backgroundColor: bg, color: fg }}
  }, [bg, fg]);

  return (
    <div ref={appDiv} className="App">
      <div className="App-body">
        {/* <div className="body-left"> */}
        <ColorBricks lightness={lightness} setLightness={setLightness} aCenter={aCenter} setACenter={setACenter} bCenter={bCenter} setBCenter={setBCenter} savedColors={savedColors} setSavedColors={setSavedColors} range={range} setRange={setRange}></ColorBricks>
        {/* </div> */}
        {/* <div className="body-right"> */}
        <SavedColors savedColors={savedColors} setSavedColors={setSavedColors} setLightness={setLightness} setACenter={setACenter} setBCenter={setBCenter}></SavedColors>
        {/* </div> */}
      </div>
    </div>
  );
}

export default App;
