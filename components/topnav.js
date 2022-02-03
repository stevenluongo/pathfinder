import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useGlobalContext } from '../context/global-context';
import LoadingButton from '@mui/lab/LoadingButton';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import CodeIcon from '@mui/icons-material/Code';
export default function TopNav() {
    const [algorithm, setAlgorithm] = useState(10);
    const {isResetting, resetBoard, isAnimating} = useGlobalContext();

    const handleChange = (event) => {
        setAlgorithm(event.target.value);
    };
    return (
        <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
        <Select
          labelId="demo-customized-select-label"
          id="demo-customized-select"
          value={algorithm}
          onChange={handleChange}
          input={<BootstrapInput />}
          style={{width: 150, marginLeft: '1rem'}}
        >
          <MenuItem style={{display: 'flex', alignItems: 'center'}} value={10}><AutoAwesomeIcon style={{marginRight: '.5rem', fontSize: '1.3em'}}/>Dijkstra</MenuItem>
        </Select>
        <VisualizeButton
          onClick={resetBoard}
          className="reset_button"
          endIcon={<RestartAltIcon/> }
          loading={isResetting}
          loadingPosition="end"
          variant="contained"
          disabled={isAnimating}
        >
          {isResetting ? 'resetting ...' : 'Reset'}
        </VisualizeButton>
        <div className='app_topbar_end'>
        <Button target="_blank" href="https://github.com/binolt/pathfinder" className='a_t_e_button' variant="contained" endIcon={<CodeIcon />}>
          View Code
        </Button>
        </div>
        </div>
    );
}

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
      marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
      boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
      borderRadius: 4,
      position: 'relative',
      display: 'flex',
      height: 24,
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

  const VisualizeButton = styled(LoadingButton)({
    color: '#fff',
    backgroundColor: '#3f22c0',
    '&:hover': {
      backgroundColor: '#414141',
      borderColor: '#0062cc',
      boxShadow: 'none',
    },
    '&:disabled': {
      borderColor: '#005cbf',
      color: '#6048ca'
    },
  })