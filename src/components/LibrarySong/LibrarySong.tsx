import React from "react"

export default function LibrarySong({setSongs, isPlaying, audioRef, song, songs, setCurrentSong}){
    const songSelectHandler = async () => {
        await setCurrentSong(song);
        const id = song.id;
        const newSongs = songs.map((song) => {
            if(song.id === id){
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
    return(
        <div onClick={songSelectHandler} className={`library-song ${song.active ? 'selected' : ""}`}>
            <img src={song.cover} alt="Cover"/>
            <div className="song-description">
                <h3>{song.name}</h3>
                <h4>{song.artist}</h4>
            </div>
        </div>
    )
}