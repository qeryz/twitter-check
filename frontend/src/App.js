import logo from './twitter.svg';
import './App.css';
import { Typography, TextField, Stack, Button, Paper, Box, Avatar } from '@mui/material';

import { useEffect, useState } from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import TwitterIcon from '@mui/icons-material/Twitter';
import axios from 'axios';

import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import SendIcon from '@mui/icons-material/PeopleAlt';


const CssTextField = styled(TextField)({
  // focused color for input with variant='outlined'
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: '#1DA1F2',
      borderWidth: "0.1px"
    },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: '#1976d2',
      borderWidth: "0.2px"
    },
    "&:hover .MuiFormLabel-root" : {
      color: '#1976d2'
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderWidth: "1.3px"
    },
});

const CButton = styled(Button)({
  // focused color for input with variant='outlined'
    "&:disabled": {
      opacity: '30%',
    },
});

const darkTheme = createTheme({ palette: { mode: 'dark' } });
const lightTheme = createTheme({ palette: { mode: 'light' } });

function App() {
  const [followInfo, setFollowInfo] = useState([]);
  const [user1, setUser1] = useState('');
  const [user2, setUser2] = useState('');
  const [user1Pic, setUser1Pic] = useState('');
  const [user2Pic, setUser2Pic] = useState('');

  const [sourceName, setSourceName] = useState('null');
  const [targetName, setTargetName] = useState('null');

  const [isSubmit, setIsSubmit] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const getInfo = async () => {
    await getPicture();

    try {
      const response = await axios.get('http://localhost:4000/api/friendships', {
        params: {
          user1: user1,
          user2: user2,
        }
      })
      setSourceName(user1);
      setTargetName(user2);
      
      // console.log(response.data['relationship'].source);
      setFollowInfo(response.data['relationship'].source);

    } catch (error) {
      console.log("Undefined user");
      setIsFollowed(false);
      setIsFollowing(false);
    }

  };

  const getPicture = async () => {
    try {
      const response1 = await axios.get('http://localhost:4000/api/users', {
        params: {
          user: user1,
        }
      })
      const response2 = await axios.get('http://localhost:4000/api/users', {
        params: {
          user: user2,
        }
      })
      setUser1Pic(response1.data.profile_image_url);
      setUser2Pic(response2.data.profile_image_url);


    } catch (error) {
      console.log("Undefined user");
    }

  };

  const handleCheck = async (event) => {
    event.preventDefault(); // Prevent page refresh on form submit
    await getInfo();   
    setIsSubmit(true);
  };

  useEffect(()=>{
    // if (sourceName === user1 && targetName === user2)
    //   setIsSubmit(true);
    // else
    //   setIsSubmit(false);

    const followedBy = followInfo.followed_by;
    const following = followInfo.following;

    setIsFollowed(followedBy);
    setIsFollowing(following);
    
  },[followInfo, sourceName, targetName, user1, user2]);

  return (
    <div className="App">
      <header className="App-header">
        <a className='hoverTitle' href='https://twitter.com' target="_blank" rel="noreferrer">
          <img src={logo} className="logo" alt="Twitter" />
        </a>
        <div>
          <Typography color='#8cb8d1' variant='h4'>Friendship Check</Typography>
        </div>
      </header>
      <div style={{ display: 'block',}}>
        <Typography color='#6ea3c1' style={{ marginBottom: '4rem' }} variant='subtitle1'>Check to see if two people follow each other on Twitter.</Typography>
        <form autoComplete='off' noValidate onSubmit={handleCheck}>
        <Stack direction='row' justifyContent="center" alignItems="center" spacing={1}>
          <Typography color='#1DA1F2'>Does</Typography>
          <CssTextField sx={{ input: { color: '#1DA1F2' }, label: { color: '#1DA1F2'} }} id="outlined-basic" 
          label="@" variant="outlined" value={user1 ? user1 : ''} onChange={(e) => setUser1(e.target.value.toLowerCase())}/>
          <Typography color='#1DA1F2'>Follow</Typography>
          <CssTextField sx={{ input: { color: '#1DA1F2' }, label: { color: '#1DA1F2'} }} id="outlined-basic" 
          label="@" variant="outlined" value={user2 ? user2 : ''} onChange={(e) => setUser2(e.target.value.toLowerCase())}/>
          <Typography variant='h6' color='#1DA1F2'>?</Typography>
        </Stack>
        <CButton type="submit" disabled={!user1 || !user2 || user1.length < 4 || user2.length < 4} style={{ marginTop: '2rem', marginBottom: '3rem', color: '#1DA1F2' }} 
        endIcon={<SendIcon />} variant="outlined" onClick={handleCheck}>Check</CButton>
        </form>
      </div>      
      {(isSubmit && targetName === user2 && sourceName === user1) && (
      <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          '& > :not(style)': {
            m: 1,
            padding: {xs: '0.7rem', md: '2rem'},
            width: {xs: '85vw', md: 'auto'},
            height: 'auto',
          },
        }}
      >
        <Paper style={{ borderRadius: '15px' }} elevation={0}>
          <div className='resultFollow'> 
            <Typography display = 'inline' variant = 'h5' color = '#8c8c8c' >{`${sourceName} and ${targetName} are `}</Typography>
            <Typography display = 'inline' variant = 'h5' color = '#66bb6a' >{(isFollowed && isFollowing) && 'friends'}</Typography>
            <Typography display = 'inline' variant = 'h5' color = 'error' >{(!isFollowed || !isFollowing) && 'not friends'}</Typography>
            <Stack justifyContent="center" alignItems="center" display='flex' direction='row' spacing={1}>
              <Typography variant = 'subtitle1' color = '#1DA1F2' >{isFollowing ? `${sourceName} is following ${targetName}` : `${sourceName} is not following ${targetName}`}</Typography>
              {isFollowing ? <CheckCircleOutlineIcon color='success' /> : <HighlightOffIcon color='error' />}
            </Stack>
            <Stack justifyContent="center" alignItems="center" display='flex' direction='row' spacing={1}>
              <Typography variant = 'subtitle1' color = '#1DA1F2' >{isFollowed ? `${targetName} is following ${sourceName}` : `${targetName} is not following ${sourceName}`}</Typography>
              {isFollowed ? <CheckCircleOutlineIcon color='success' /> : <HighlightOffIcon color='error' />}
            </Stack>
            <Stack style= {{ marginTop: '1rem'}} direction='column' spacing={0.5}>
              <Stack justifyContent="center" alignItems="center" display='flex' direction='row' spacing={1}>
              <a className='hoverTitle' href={`https://twitter.com/${sourceName}`} target="_blank" rel="noreferrer">
                <Avatar sx={{ width: 32, height: 32, marginRight: '5.5px' }} alt = {user1} src={user1Pic} />
                <Typography display='flex' variant = 'subtitle1' color = '#1DA1F2'>@{sourceName}</Typography>
                <TwitterIcon style={{ color: '#1DA1F2', fontSize: '17px', margin: '5.5px' }} />
              </a>
              </Stack>
              <Stack justifyContent="center" alignItems="center" display='flex' direction='row' spacing={1}>
              <a className='hoverTitle' href={`https://twitter.com/${targetName}`} target="_blank" rel="noreferrer">
                <Avatar sx={{ width: 32, height: 32, marginRight: '5.5px' }} src={user2Pic} alt={user2} />
                <Typography display='flex' variant = 'subtitle1' color = '#1DA1F2'>@{targetName}</Typography>
                <TwitterIcon style={{ color: '#1DA1F2', fontSize: '17px', margin: '5.5px' }} />
              </a>
              </Stack>
            </Stack>
          </div>
        </Paper>
      </Box>
      </ThemeProvider>
      )}
    </div>
  );
}

export default App;
