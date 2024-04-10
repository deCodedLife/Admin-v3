import React, { SyntheticEvent, useCallback, useEffect, useRef, useState } from "react"
import ComponentButton from "../ComponentButton"
import { TComponentAudio } from "./_types";

const formatTime = (time: number | undefined) => {
    if (time && !isNaN(time)) {
        const minutes = Math.floor(time / 60);
        const formatMinutes =
            minutes < 10 ? `0${minutes}` : `${minutes}`;
        const seconds = Math.floor(time % 60);
        const formatSeconds =
            seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${formatMinutes}:${formatSeconds}`;
    }
    return '00:00';
};

const ComponentAudio: React.FC<TComponentAudio> = ({ src }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const progressBarRef = useRef<HTMLInputElement | null>(null)
    const volumeRef = useRef<HTMLInputElement | null>(null)
    const playAnimationRef = useRef<number | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLooped, setIsLooped] = useState(false)

    const [timeProgress, setTimeProgress] = useState<number>(0)
    const [timeDuration, setTimeDuration] = useState<number>(0)
    const isPlayable = Boolean(timeDuration)
    const repeat = useCallback(() => {
        if (progressBarRef.current && audioRef.current) {
            const currentTime = audioRef.current.currentTime
            setTimeProgress(currentTime);
            progressBarRef.current.value = String(currentTime);
        }

        playAnimationRef.current = requestAnimationFrame(repeat);
    }, []);

    const handlePlayButtonClick = () => setIsPlaying(prev => !prev)

    const handleLoopButtonClick = () => setIsLooped(prev => !prev)


    const handleLoadMetadata = useCallback((event: SyntheticEvent<HTMLAudioElement>) => {
        if (progressBarRef.current && audioRef.current) {
            const seconds = audioRef.current.duration;
            setTimeDuration(seconds);
            progressBarRef.current.max = String(seconds);
        }

    }, [])

    const handleTrackEnd = useCallback((event: SyntheticEvent<HTMLAudioElement>) => setIsPlaying(false), [])

    const handleProgressChange = useCallback(() => {
        if (progressBarRef.current && audioRef.current) {
            audioRef.current.currentTime = Number(progressBarRef.current.value);
        }
    }, [])

    const handleProgressbarVolumeChange = useCallback(() => {
        if (volumeRef.current && audioRef.current) {
            audioRef.current.volume = Number(volumeRef.current.value);
        }
    }, [])

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play()
                playAnimationRef.current = requestAnimationFrame(repeat);
            } else {
                audioRef.current.pause()
                cancelAnimationFrame(playAnimationRef.current as number);
            }
        }
    }, [isPlaying, audioRef])

    useEffect(() => {
        if (audioRef.current) {
            if (isLooped) {
                audioRef.current.setAttribute("loop", "true")
            } else {
                audioRef.current.removeAttribute("loop")
            }

        }
    }, [isLooped, audioRef])

    return <>
        <audio ref={audioRef} controls src={src} className="componentAudio" onLoadedMetadata={handleLoadMetadata} onEnded={handleTrackEnd} />
        <div className="componentAudio_container">
            <div className="componentAudio_mainProperties">
                <div className="componentAudio_title">{/* Какой-то трек */}</div>
                <div className="componentAudio_time">{`${formatTime(timeProgress)}/${formatTime(timeDuration)}`}</div>
            </div>
            <input className="componentAudio_range"
                ref={progressBarRef}
                type="range"
                defaultValue="0"
                onChange={handleProgressChange}
                disabled={!isPlayable} />
            <div className="componentAudio_toolbar">
                <ComponentButton
                    className={`componentAudio_button ${isLooped ? " active" : ""}`}
                    type="custom"
                    settings={{ title: "Повтор", icon: "repeat", background: "light" }}
                    defaultLabel="icon"
                    customHandler={handleLoopButtonClick}
                    disabled={!isPlayable} />
                <ComponentButton
                    className="componentAudio_button"
                    type="custom"
                    settings={{ title: "Назад", icon: "previous", background: "light" }}
                    defaultLabel="icon"
                    customHandler={() => { }}
                    disabled />
                <ComponentButton
                    className="componentAudio_button componentAudio_mainButton"
                    type="custom"
                    settings={{ title: isPlaying ? "Пауза" : "Слушать", icon: isPlaying ? "pause" : "play", background: "light" }}
                    defaultLabel="icon"
                    customHandler={handlePlayButtonClick}
                    disabled={!isPlayable} />
                <ComponentButton
                    className="componentAudio_button"
                    type="custom"
                    settings={{ title: "Далее", icon: "next", background: "light" }}
                    defaultLabel="icon"
                    customHandler={() => { }}
                    disabled />
                <input
                    className="componentAudio_range"
                    ref={volumeRef}
                    type="range"
                    defaultValue="1"
                    max="1"
                    step="0.01"
                    onChange={handleProgressbarVolumeChange}
                    disabled={!isPlayable} />
            </div>
        </div>
    </>
}

export default ComponentAudio