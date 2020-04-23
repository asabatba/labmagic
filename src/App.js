import React, { useState } from 'react';
import './App.css';
import ColorBricks from "./components/ColorBricks";
import SavedColors from "./components/SavedColors";


function App() {

  const [savedColors, setSavedColors] = useState(['#8dbcd1', '#8fcca6', '#c29ceb', '#f5a748', '#9a9687', '#e38292', '#a4b339']);
  const [lightness, setLightness] = useState(80);
  const [aCenter, setACenter] = useState(0);
  const [bCenter, setBCenter] = useState(0);
  const [range, setRange] = useState(48);



  return (
    <div className="App">
      <header className="App-header">
      </header>
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
