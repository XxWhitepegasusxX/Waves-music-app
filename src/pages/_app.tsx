import Head from 'next/head';
import { useState, useRef } from 'react';
import Library from '../components/Library/Library';
import Player from '../components/Player/Player'
import Song from '../components/Song/Song'
import '../styles/globals.scss'
import data from './data'
import Nav from '../components/Nav/Nav';

function MyApp({ Component, pageProps }) {
  const audioRef = useRef(null);

  const [songs, setSongs] = useState(data());
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false)
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: null,
  });
  const [libraryStatus, setLibraryStatus] = useState(false);
  const timeUpdateHandler = (e) =>{
    const current = e.target.currentTime;
    const duration = e.target.duration
    setSongInfo({...songInfo, currentTime: current, duration})
  }
  const songEndHandler = async () => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id)
    await setCurrentSong(songs[(currentIndex + 1) % songs.length])
    if(isPlaying) audioRef.current.play();
  }

  return (
  <div className={`App ${libraryStatus ? 'library-active' : ""}`}>
    <Head>
      <title>Waves Music App</title>
    </Head>
    <Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus}/>
    <Song currentSong={currentSong}/>
    <Player setSongs={setSongs} setCurrentSong={setCurrentSong} songs={songs} setSongInfo={setSongInfo} songInfo={songInfo} audioRef={audioRef} setIsPlaying={setIsPlaying} isPlaying={isPlaying} currentSong={currentSong}/>
    <Library libraryStatus={libraryStatus} setSongs={setSongs} isPlaying={isPlaying} audioRef={audioRef} songs={songs} setCurrentSong={setCurrentSong}/>
    <audio
    onEnded={songEndHandler}
    onLoadedMetadata={timeUpdateHandler}
    onTimeUpdate={timeUpdateHandler} 
    ref={audioRef} 
    src={currentSong.audio}>
    </audio>
  </div>
  
  )
}

export default MyApp
