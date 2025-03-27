
import chroma from 'chroma-js';
import React from 'react';
import './BricksTable.css';
import Cell from './Cell';

function BricksTable({ chromaMatrix, savedColors, setSavedColors, centerHex }) {

    return (
        <div className="table-container">
            <table className="color-bricks-table">
                <tbody>
                    {chromaMatrix.map((row, i) =>
                        (<tr key={i + ''}>
                            {row.map((cell, j) =>
                                (<Cell key={i + ',' + j} color={cell} savedColors={savedColors} setSavedColors={setSavedColors} borderColor={chroma.distance(centerHex, 'red') < 80 ? 'green' : 'red'}></Cell>)
                                // chroma.rgb(centerHex.rgb().map(comp => 255 - comp)).css()
                            )}
                        </tr>)
                    )}
                </tbody>
            </table>
        </div>);
}

export default BricksTable;