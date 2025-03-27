
import chroma from 'chroma-js';
import React, { useEffect, useRef } from 'react';
import './ControlPanel.css';


function ControlPanel({ setCenterHex, setLightness, setACenter, setBCenter, setRange, aCenter, bCenter, lightness, range }) {

    const hexInput = useRef(null);

    useEffect(() => {
        const chex = chroma.lab(lightness, aCenter, bCenter);
        setCenterHex(chex);
        hexInput.current.value = chex;
    }, [lightness, aCenter, bCenter, setCenterHex]);

    const handleLightnessChange = (ev) => {
        setLightness(parseFloat(ev.target.value));
    };
    const handleAChange = (ev) => {
        setACenter(parseFloat(ev.target.value));
    };
    const handleBChange = (ev) => {
        setBCenter(parseFloat(ev.target.value));
    };
    const handleRangeChange = (ev) => {
        setRange(parseFloat(ev.target.value));
    };

    const handleCenterChange = (ev) => {
        if (ev.key === 'Enter') {
            if (chroma.valid(ev.target.value)) {
                const [L, a, b] = chroma(ev.target.value).lab();
                setLightness(L);
                setACenter(a);
                setBCenter(b);
                hexInput.current.classList.remove('wrong-value');
            } else {
                hexInput.current.classList.add('wrong-value');
            }
        }
    };

    return (
        <div className="row">
            <div className="hexInputContainer">
                <input ref={hexInput} size="8" maxLength="16" type="text" onKeyDown={handleCenterChange}></input>
            </div>
            <div className="column" style={{ flex: 1 }}>
                <div className="row slider-div">
                    <span>a</span>
                    <input className="slider" type="range" min="-128" max="128" step="0.2" value={aCenter} onChange={handleAChange}></input>
                </div>
                <div className="row slider-div">
                    <span>b</span>
                    <input className="slider" type="range" min="-128" max="128" step="0.2" value={bCenter} onChange={handleBChange}></input>
                </div>
                <div className="row slider-div">
                    <span>Lightness</span>
                    <input className="slider" type="range" min="0" max="105" step="0.2" value={lightness} onChange={handleLightnessChange}></input>
                </div>
                <div className="row slider-div">
                    <span>Zoom</span>
                    <input className="slider" type="range" min="4" max="128" step="2" value={range} onChange={handleRangeChange}></input>
                </div>
            </div>
        </div>
    );
}

export default ControlPanel;