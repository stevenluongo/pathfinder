import Collapse from '@mui/material/Collapse';
import React, { useState, useRef, useEffect } from 'react';
import LayersIcon from '@mui/icons-material/Layers';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import UpcomingIcon from '@mui/icons-material/Upcoming';
import EggIcon from '@mui/icons-material/Egg';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useGlobalContext } from '../context/global-context';
import useOnClickOutside from "../lib/useOnClickOutside";
import BoltIcon from '@mui/icons-material/Bolt';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';

export default function SideNav() {
    const [isOpen, setIsOpen] = useState(true);
    const [appearance, setAppearance] = useState(true);
    const [speedToggled, setSpeedToggled] = useState(true);
    const [value, setValue] = useState(null);
    const {isProcessingMode, previousFinishNode, setPreviousFinishNode, finishNode, board, setSpeed, speed, loaded, isAnimating, setMode, mode, colors, setPreviousStartNode, previousStartNode, startNode, setStartNode} = useGlobalContext();
    const startRef = useRef(null);
    const finishRef = useRef(null);
    const wallRef = useRef(null);

    useEffect(() => {
        if(loaded) {
            setValue(-Math.abs(speed))
        }
    }, [loaded])

    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
    };

    const updateSpeed = () => {
        setSpeed(Math.abs(value));
        //update localStorage
        localStorage.setItem('speed', Math.abs(value));
    }

    const updateMode = (target) => {
        if(isAnimating || isProcessingMode) {
            return;
        }
        if(target === 'start') {
            if(previousStartNode && previousStartNode === startNode) {
                //loop through all nodes and remove them if they have the start node color
                board.forEach((tempRow) => {
                    tempRow.forEach((node) => {
                        if(node.isWall || node.isFinish) {
                            return;
                        }
                        const tempDomEl = document.getElementById(`node-${node.row}-${node.col}`);
                        if(tempDomEl.style.backgroundColor === hexToRgb(colors.start)) {
                            tempDomEl.style.background = '#181818';
                        }
                    })
                })
                
                //update old start node styles
                const domEl = document.getElementById(`node-${startNode.row}-${startNode.col}`);
                domEl.style.backgroundColor = colors.start;

            }
            setPreviousStartNode(startNode);
        }
        if(target === 'finish') {
            if(previousFinishNode && previousFinishNode === finishNode) {
                //loop through all nodes and remove them if they have the start node color
                board.forEach((tempRow) => {
                    tempRow.forEach((node) => {
                        if(node.isWall || node.isStart) {
                            return;
                        }
                        const tempDomEl = document.getElementById(`node-${node.row}-${node.col}`);
                        if(tempDomEl.style.backgroundColor === hexToRgb(colors.finish)) {
                            tempDomEl.style.background = '#181818';
                        }
                    })
                })
                
                //update old start node styles
                const domEl = document.getElementById(`node-${finishNode.row}-${finishNode.col}`);
                domEl.style.backgroundColor = colors.finish;

            }
            setPreviousFinishNode(finishNode);
        }
        setMode({start: false, finish: false, wall: false, [target] : !mode[target]});
    }

    return value !== null && (<>
        <div className='a_s_head'>
            <img src="https://res.cloudinary.com/dxqmbhsis/image/upload/v1643654043/pathfinder/logo_jk8fyj.png"/>
            <h3>pathfindr</h3>
        </div>
        <div className='a_s_body'>
            <Dropdown label="nodes" icon={<LayersIcon/>} isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
                <div className='a_s_b_d_nodes'>
                    <p style={{background: mode.start && colors.start, color: mode.start && '#fff'}} onClick={() => updateMode('start')}>Start Node</p>
                    <p style={{background: mode.finish && colors.finish, color: mode.finish && '#fff'}} onClick={() => updateMode('finish')}>Finish Node</p>
                </div>
            </Dropdown>
            <Dropdown label="speed" icon={<BoltIcon/>} isOpen={speedToggled} onClick={() => setSpeedToggled(!speedToggled)}>
                <Stack spacing={2} direction="row" sx={{m: '.5rem .5rem' }} alignItems="center">
                        <Slider disabled={isAnimating} min={-12} max={-2} onBlur={updateSpeed} aria-label="Volume" value={value} onChange={handleSliderChange} />
                </Stack>
            </Dropdown>
            <Dropdown label="appearance" icon={<UpcomingIcon/>} isOpen={appearance} onClick={() => setAppearance(!appearance)}>
                <ColorInput label="START NODE COLOR" ref={startRef} target="start"/>
                <ColorInput label="FINISH NODE COLOR" ref={finishRef} target="finish"/>
                <ColorInput margin={0} label="WALL NODE COLOR" ref={wallRef} target="wall"/>
            </Dropdown>
            <div className='a_s_b_credits'>
                <p>Made with 💜 by <a target="_blank" href="https://github.com/binolt">steven</a></p>
            </div>
        </div>
    </>);
}

const ColorInput = React.forwardRef(({margin, label, target}, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const {setColors, colors, loaded, DEFAULT_COLORS} = useGlobalContext();
    const [localColors, setLocalColors] = useState(colors);

    const listenForClose = () => {
        if(isOpen) {
            setIsOpen(false);
            //update local storage
            setColors(localColors)
            localStorage.setItem('appearance_colors', JSON.stringify(localColors));
        }
        
    }

    useOnClickOutside(ref, listenForClose);

    const handleColorChange = (e) => {
        const mutatedState = {
          ...colors,
          [target] : e.target.value
        }
        setLocalColors(mutatedState);
    }

    const handleClick = (e) => {
        if(e.target.name !== target) {
            if(e.target.id === '#restart') {
            //format updated colors
            const updatedColor = {
                name: target, value: DEFAULT_COLORS[target]
            }
            const updatedState = {
                ...colors,
                [updatedColor.name] : updatedColor.value
            }

            //update localstorage & state
            localStorage.setItem('appearance_colors', JSON.stringify(updatedState));

            const mutatedState = {
                ...colors,
                [target]: DEFAULT_COLORS[target]
            }

            setColors(mutatedState)
            return;
            }
            ref.current.click();
            setIsOpen(true);
        }
    }

    return loaded && (
        <div className='a_s_b_d_color' style={{marginBottom: margin && margin}}>
            <h6>{label}</h6>
            <div className="a_s_b_d_c_input" onClick={handleClick}>
                <span style={{display: 'flex', alignItems: 'center'}}>
                    <EggIcon style={{fill: colors[target]}}/>
                    <p>{colors[target]}</p>
                </span>
                <RestartAltIcon style={{fontSize: '1.2em'}}/>
                <div id='#restart' className='placeholder' />
                <input name={target} value={colors[target]} ref={ref} onChange={handleColorChange} type="color" style={{position: 'absolute', right: 0, zIndex: -1}}/>
            </div>
    </div>
)});


const Dropdown = ({icon, label, isOpen, onClick, children}) => {
    return (
        <div className='a_s_b_dropdown'>
            <span className='a_s_b_d_head'>
                <span>{icon}{label}</span>
                <KeyboardArrowUpIcon onClick={onClick}/>
            </span>
            <Collapse in={isOpen} timeout="auto" unmountOnExit >
                <div className='a_s_b_d_body'>
                    <div className='a_s_b_d_b_highlight'/>
                    <div className='a_s_b_d_b_list'>{children}</div>
                </div>
            </Collapse>
        </div>
    )
}
  

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : null;
  }