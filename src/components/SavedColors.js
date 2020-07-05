
import chroma from 'chroma-js';
import React, { useEffect, useRef, useState } from 'react';
import { IoIosCloseCircleOutline, IoIosSearch } from 'react-icons/io';
import { animated, useTransition } from 'react-spring';
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network';
import './SavedColors.css';

export const blackOrWhite = (hex) =>
    chroma(hex).get('lab.l') > 50 ? '#000' : '#fff';

function SavedGraph({ savedColors }) {

    // const [network, setNetwork] = useState();
    // const [container, setContainer] = useState();

    // const container = (<div></div>);
    const container = useRef(null);
    const network = useRef(Network);
    const data = useRef(null);

    // const [distances, setDistances] = useState([]);

    const color2node = (c) => ({ id: c, color: c, label: c });
    const colors2edge = (c1, c2) => {
        const dist = chroma.distance(c1, c2);
        // const contrast = chroma.contrast(c1,c2);
        // if (dist > 100)
        //     return {};

        return {
            from: c1,
            to: c2,
            width: 1 + 20 / Math.sqrt(dist + 1),
            length: (dist) * 2 + 80,
            label: dist.toFixed(0),// + '🥰',
            _dist: dist,
        }
    }

    // Initialize network.
    useEffect(() => {

        data.current = {
            nodes: new DataSet([]),
            edges: new DataSet([]),
        };

        network.current = (
            new Network(
                container.current,
                data.current, {
                edges: {
                    // scaling: { min: 1, max: 5 },
                    color: { inherit: 'both' }
                }
            }
            ));
    }, []);

    const [savedNetwork, setSavedNetwork] = useState({ nodesToRemove: [], nodesToAdd: [], edgesToRemove: [], edgesToAdd: [], nodesTable: [], edgesTable: [] });

    useEffect(() => {
        setSavedNetwork((old) => {
            console.log('computing network...')
            // const nodesToRemove = data.current.nodes.getIds().filter((id) => !savedColors.includes(id));
            const nodesTable = [...old.nodesTable];
            const edgesTable = [...old.edgesTable];

            const edgesToAdd = [], edgesToRemove = [];

            const nodesToRemove = old.nodesTable
                .filter((n) => !savedColors.includes(n.id));

            const nodesToAdd = savedColors
                .filter((c) => !old.nodesTable.find((n) => n.id === c))
                .map(c => {
                    const n = color2node(c);
                    nodesTable.push(n);
                    return n;
                });


            nodesToRemove.forEach((n) => {
                old.edgesTable.forEach((e) => {
                    if (e.from === n.id || e.to === n.id) {
                        edgesToRemove.push(e);
                        edgesTable.splice(edgesTable.findIndex(edge => edge === e), 1);
                    }
                });
                nodesTable.splice(nodesTable.findIndex(node => n === node), 1);
            });

            for (let i = 0; i < nodesTable.length; i++) {
                const ni = nodesTable[i];
                for (let j = 0; j < i; j++) {
                    const nj = nodesTable[j];
                    // const edges =
                    // nodesTable
                    //     .filter(n2 => n !== n2)
                    //     .map((oldNode) => colors2edge(oldNode.id, n.id))
                    //     .slice(0, 3);
                    const edge = colors2edge(ni.id, nj.id);
                    if (edge._dist > 50) { continue; }
                    if (edgesTable.find(e =>
                        (e.from === ni.id && e.to === nj.id) ||
                        (e.to === ni.id && e.from === nj.id)
                    )) { continue; }

                    edgesToAdd.push(edge);
                    edgesTable.push(edge);
                }
            }

            return {
                nodesToRemove, nodesToAdd,
                edgesToRemove, edgesToAdd,
                nodesTable, edgesTable
            };
        });
    }, [savedColors]);

    console.log(savedNetwork);

    // Reload changes in savedColors.
    useEffect(() => {

        const { nodesToAdd, nodesToRemove, edgesToAdd, edgesToRemove } = savedNetwork;

        nodesToAdd.forEach((n) => {
            console.log('node', n);
            data.current.nodes.add(n);
        });

        nodesToRemove.forEach((n) => {
            data.current.nodes.remove(n.id);
        });

        edgesToAdd.forEach((e) => {
            data.current.edges.add(e);
        });

        edgesToRemove.forEach((e) => {
            data.current.edges.remove(e.id);
        });

        // All-average method. Costly somehow.
        // eslint-disable-next-line
        if (1 === 0) {
            const edges = data.current.edges.get();
            const avg = edges.reduce((acc, e) => acc + e._dist, 0) / edges.length;
            // console.log(dists, avg);

            data.current.edges.forEach((e) => {
                if (e._dist > avg) {
                    data.current.edges.update({ ...e, hidden: true, physics: false });
                } else {
                    data.current.edges.update({ ...e, hidden: false, physics: true });
                }
            });
        }

        // data.current.edges.remove()
        // setDistances(ndist);

        // data.current.nodes.update(savedColors.map((c) => ({ id: c, color: c })));

    }, [savedNetwork]);

    return <div className="container-graph" ref={container}></div>
}

function Brick({ hex, savedColors, setSavedColors, setLightness, setACenter, setBCenter }) {

    const handleDelete = () => {
        setSavedColors(savedColors.filter((c) => c !== hex));
    };

    const handleSearch = () => {
        const chr = chroma(hex);
        const lab = chr.lab();
        setLightness(lab[0]);
        setACenter(lab[1]);
        setBCenter(lab[2]);
    }

    const borw = blackOrWhite(hex);

    return (<div>
        <div className="brick flex-col items-center" style={{ backgroundColor: hex, color: borw }}>
            <div>{hex}</div>
            <div style={{ marginTop: '0.5rem' }} className="flex-row">
                <button onClick={handleSearch}><IoIosSearch /></button>
                <div style={{ width: '0.1rem' }}></div>
                <button onClick={handleDelete}><IoIosCloseCircleOutline /></button>
            </div>
        </div>
    </div>)
}

function SavedColors({ savedColors, setSavedColors, setLightness, setACenter, setBCenter }) {

    const bricks = savedColors.map((c) => (
        <Brick key={c} hex={c} savedColors={savedColors} setSavedColors={setSavedColors} setLightness={setLightness} setACenter={setACenter} setBCenter={setBCenter}>
        </Brick>
    ));

    const transitions = useTransition(bricks, item => item.key, {
        from: { transform: 'scale(0) rotate(-10deg)', opacity: 0.5, },
        enter: { transform: 'scale(1) rotate(0deg)', opacity: 1.0, },
        leave: { transform: 'scale(0) rotate(-10deg)', opacity: 0.5, },
    }).map(({ item, props, key }) => (
        <animated.div key={key} style={props}>
            {item}
        </animated.div>));

    return (
        <div className="saved-container">
            <SavedGraph savedColors={savedColors}></SavedGraph>
            <div className="saved-colors">
                {transitions}
            </div>
        </div>)
}

export default SavedColors;