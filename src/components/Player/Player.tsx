import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlay, faAngleLeft, faAngleRight, faPause } from "@fortawesome/free-solid-svg-icons"


export default function Player({setSongs, setCurrentSong, songs, setSongInfo, songInfo, audioRef, setIsPlaying, isPlaying, currentSong}){
    const activeLibraryHandler= (nextPrev) =>{
        const newSongs = songs.map((song) => {
            if(song.id === nextPrev.id){
                return{
                    ...song,
                    active: true,
                }
            }else{
                return{
                    ...song,
                    active: false,
                }
            }
        })
        setSongs(newSongs);
        if(isPlaying){
            const playPromise = audioRef.current.play();
            if(playPromise !== undefined){
                playPromise.then((audio) => {
                    audioRef.current.play();
                })
            }
        }
    }
    const playSongHandler = () => {
        if(isPlaying){
            audioRef.current.pause()
            setIsPlaying(!isPlaying)
        }else{
            audioRef.current.play()
            setIsPlaying(!isPlaying)
        }
    }
    
    const getTime = (time) => {
        return(
            Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
        )
    }
    const dragHandler = (e) => {
        audioRef.current.currentTime = e.target.value;
        setSongInfo({...songInfo, currentTime: e.target.value})
    }
    const skipTrackHandler = async (direction) => {
        let currentIndex = songs.findIndex((song) => song.id === currentSong.id)
        if(direction === 'skip-forward'){
            await setCurrentSong(songs[(currentIndex + 1) % songs.length])
            await activeLibraryHandler(songs[(currentIndex + 1) % songs.length])
        }
        if(direction === 'skip-back'){
            if((currentIndex - 1) % songs.length === -1){
                await setCurrentSong(songs[songs.length - 1])
                await activeLibraryHandler(songs[songs.length - 1])
                return;
            }
            await setCurrentSong(songs[(currentIndex - 1) % songs.length])
            await activeLibraryHandler(songs[(currentIndex - 1) % songs.length])
            
        }
    }
    return(
        <div className="player">
            <div className="time-control">
                <p>{getTime(songInfo.currentTime)}</p>
                <input onChange={dragHandler} min={0} max={songInfo.duration} value={songInfo.currentTime} type="range"/>
                <p>{getTime(songInfo.duration || 0)}</p>
            </div>
            <div className="play-control">
                <FontAwesomeIcon onClick={()=> skipTrackHandler('skip-back')} className="skip-back" size="2x" icon={faAngleLeft}/>
                <FontAwesomeIcon onClick={playSongHandler} className="play" size="2x" icon={isPlaying? faPause : faPlay}/>
                <FontAwesomeIcon onClick={()=> skipTrackHandler('skip-forward')} className="skip-forward" size="2x" icon={faAngleRight}/>
            </div>
        </div>
    )
}