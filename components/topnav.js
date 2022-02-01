import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import AlignVerticalCenterIcon from '@mui/icons-material/AlignVerticalCenter';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
      marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
      borderRadius: 4,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#292929',
      border: '1px solid #292929',
      fontSize: 16,
      color: '#fff',
      padding: '8px 26px 8px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:focus': {
        borderRadius: 4,
        borderColor: '#956edd',
        boxShadow: '0 0 0 0.2rem rgba(149, 110, 221, 0.1)',
      },
    },
  }));

export default function TopNav() {
    const [age, setAge] = useState(10);
    const handleChange = (event) => {
        setAge(event.target.value);
    };
    return (
        <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
        <Select
          labelId="demo-customized-select-label"
          id="demo-customized-select"
          value={age}
          onChange={handleChange}
          input={<BootstrapInput />}
          style={{width: 150, marginLeft: 'calc(1.5rem - 5px)'}}
        >
          <MenuItem style={{display: 'flex', alignItems: 'center'}} value={10}><AutoAwesomeIcon style={{marginRight: '.5rem', fontSize: '1.3em'}}/>Dijkstra</MenuItem>
        </Select>
        </div>
    );
}