import Collapse from '@mui/material/Collapse';
import React, { useState, useRef } from 'react';
import LayersIcon from '@mui/icons-material/Layers';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import UpcomingIcon from '@mui/icons-material/Upcoming';
import EggIcon from '@mui/icons-material/Egg';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const DEFAULT_COLORS = {start: '#55ce96', finish: '#f15b47', wall: "#003549"};

export default function SideNav() {
    const [isOpen, setIsOpen] = useState(true);
    const [appearance, setAppearance] = useState(true);
    const [colors, setColors] = useState(DEFAULT_COLORS);
    const startRef = useRef(null);
    const finishRef = useRef(null);
    const wallRef = useRef(null);

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
            <Dropdown label="appearance" icon={<UpcomingIcon/>} isOpen={appearance} onClick={() => setAppearance(!appearance)}>
                <ColorInput default_color={DEFAULT_COLORS.start} label="START NODE COLOR" colors={colors} ref={startRef} value={colors.start} updateColors={setColors} target="start"/>
                <ColorInput default_color={DEFAULT_COLORS.finish} label="FINISH NODE COLOR" colors={colors} ref={finishRef} value={colors.finish} updateColors={setColors} target="finish"/>
                <ColorInput margin={0} default_color={DEFAULT_COLORS.wall} label="WALL NODE COLOR" colors={colors} ref={wallRef} value={colors.wall} updateColors={setColors} target="wall"/>
            </Dropdown>
        </div>
    </>);
}

const ColorInput = React.forwardRef(({margin, label, value, default_color, target, updateColors, colors}, ref) => {
    const handleColorChange = (e) => {
        const mutatedState = {
          ...colors,
          [target] : e.target.value
        }
    
        updateColors(mutatedState);
    }
    return (
        <div className='a_s_b_d_color' style={{marginBottom: margin && margin}}>
            <h6>{label}</h6>
            <div className="a_s_b_d_c_input" onClick={(e) => {
                if(e.target.name !== target) {
                    if(e.target.id === '#restart') {
                    //format updated colors
                    const updatedColor = {
                        name: target, value: default_color
                    }
                    const updatedState = {
                        ...colors,
                        [updatedColor.name] : updatedColor.value
                    }

                    //update localstorage & state
                    localStorage.setItem('appearance_colors', JSON.stringify(updatedState));
                    
                    handleColorChange({target: updatedColor});
                    return;
                    }
                    ref.current.click();
                }
            }}>
                <span style={{display: 'flex', alignItems: 'center'}}>
                    <EggIcon style={{fill: value}}/>
                    <p>{value}</p>
                </span>
                <RestartAltIcon style={{fontSize: '1.2em'}}/>
                <div id='#restart' className='placeholder' />
                <input name={target} value={value} ref={ref} onChange={handleColorChange} type="color" style={{position: 'absolute', right: 0, zIndex: -1}}/>
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