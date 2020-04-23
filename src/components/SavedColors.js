
import chroma from 'chroma-js';
import React, { useEffect, useRef } from 'react';
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

    const color2node = (c) => ({ id: c, color: c });
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

    // Reload changes in savedColors.
    useEffect(() => {

        const toRemove = data.current.nodes.getIds().filter((id) => !savedColors.includes(id));
        const toAdd = savedColors.filter((c) => data.current.nodes.get(c) == null);
        console.log(toRemove, toAdd);

        toRemove.forEach((nid) => {
            data.current.edges.forEach((e) => {
                if (e.from === nid || e.to === nid) {
                    data.current.edges.remove(e);
                }
            });
            data.current.nodes.remove(nid);
        });
        toAdd.forEach((c) => {
            const edges = data.current.nodes.map((n) => colors2edge(n.id, c))
            // .sort((a, b) => a._dist - b._dist).slice(0, 2)
            // Closest 2 per node method.

            data.current.nodes.add(color2node(c));
            data.current.edges.add(edges);
            //data.current.edges.
        });

        // All-average method.
        // eslint-disable-next-line
        if (1 === 1) {
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

    }, [savedColors]);

    return <div className="container-graph" ref={container}></div>
}

function Brick({ hex, savedColors, setSavedColors, setLightness, setACenter, setBCenter }) {

    const handleDoubleClick = (ev) => {
        setSavedColors(savedColors.filter((c) => c !== hex));
    };

    const handleClick = (ev) => {
        const lab = chroma(hex).lab();
        // setLightness(chroma(hex).get('lab.l'));
        console.log(lab);
        setLightness(lab[0]);
        setACenter(lab[1]);
        setBCenter(lab[2]);
    }

    return (<div title="doble click para eliminar este color" onClick={handleClick} onDoubleClick={handleDoubleClick} className="brick" style={{ backgroundColor: hex, color: blackOrWhite(hex) }}>{hex}</div>)
}

function SavedColors({ savedColors, setSavedColors, setLightness, setACenter, setBCenter }) {

    const bricks = savedColors.map((c) => (
        <Brick key={c} hex={c} savedColors={savedColors} setSavedColors={setSavedColors} setLightness={setLightness} setACenter={setACenter} setBCenter={setBCenter}>
        </Brick>
    ));

    const transitions = useTransition(bricks, item => item.key, {
        from: { transform: 'scale(0) rotate(-10deg)', opacity: 0.5, },
        enter: { transform: 'scale(1) rotate(5deg)', opacity: 1.0, },
        leave: { transform: 'scale(0) rotate(-10deg)', opacity: 0.5, },
    }).map(({ item, props, key }) => (
        <animated.div key={key} style={props}>
            {item}
        </animated.div>));

    return (
        <div class="saved-container">
            <SavedGraph savedColors={savedColors}></SavedGraph>
            <div className="saved-colors">
                {transitions}
            </div>
        </div>)
}

export default SavedColors;