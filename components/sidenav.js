import Collapse from '@mui/material/Collapse';
import React, { useState, useRef } from 'react';
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
    const startRef = useRef(null);
    const finishRef = useRef(null);
    const wallRef = useRef(null);
    const {setSpeed} = useGlobalContext();
    const [value, setValue] = useState(-6);

    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
        console.log(newValue)
    };

    return (<>
        <div className='a_s_head'>
            <img src="https://res.cloudinary.com/dxqmbhsis/image/upload/v1643654043/pathfinder/logo_jk8fyj.png"/>
            <h3>pathfindr</h3>
        </div>
        <div className='a_s_body'>
            <Dropdown label="nodes" icon={<LayersIcon/>} isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
                <div className='a_s_b_d_nodes'>
                    <p>Start Node</p>
                    <p>Finish Node</p>
                    <p style={{marginBottom: 0}}>Wall Node</p>
                </div>
            </Dropdown>
            <Dropdown label="speed" icon={<BoltIcon/>} isOpen={speedToggled} onClick={() => setSpeedToggled(!speedToggled)}>
                <Stack spacing={2} direction="row" sx={{m: '.5rem .5rem' }} alignItems="center">
                        <Slider min={-12} max={-2} onBlur={() => setSpeed(Math.abs(value))} aria-label="Volume" value={value} onChange={handleSliderChange} />
                </Stack>
            </Dropdown>
            <Dropdown label="appearance" icon={<UpcomingIcon/>} isOpen={appearance} onClick={() => setAppearance(!appearance)}>
                <ColorInput label="START NODE COLOR" ref={startRef} target="start"/>
                <ColorInput label="FINISH NODE COLOR" ref={finishRef} target="finish"/>
                <ColorInput margin={0} label="WALL NODE COLOR" ref={wallRef} target="wall"/>
            </Dropdown>
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
  