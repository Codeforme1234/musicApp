// Player.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { songState } from "../state/SongAtom";
import { playbackState } from "../state/PlayAndPause";
import {
  shuffle,
  previous,
  next,
  loop,
  playIcon,
  device,
  share,
  mainpause,
  mainplay,
  repeat,
  heart,
  pauseIcon,
  muteIcon,
  volumeIcon,
  likeIcon,
  heartIcon,
  upwardArrow,
  backward,
  forward,
  desktop,
  mic,
  add,
} from "@/public";
import Image from "next/image";
import { truncateText } from "../Utils/TruncateText";
import { motion } from "framer-motion";
import { CollapsedSongDetails } from "../state/Collapse";
import { playPauseAudio, changeVolume } from "./AudioControl";

interface Song {
  url: string;
  title: string;
  artist: string;
}

const Player = () => {
  const [isPlaying, setIsPlaying] = useRecoilState(playbackState);
  const [volume, setVolume] = useState(0.2);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const songData = useRecoilValue(songState);
  const currentSong: Song = songData.currentSong || {
    url: "",
    title: "",
    artist: "",
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      const updateDuration = () => setDuration(audioRef.current?.duration || 0);
      const updateCurrentTime = () =>
        setCurrentTime(audioRef.current?.currentTime || 0);

      audioRef.current.addEventListener("loadedmetadata", updateDuration);
      audioRef.current.addEventListener("timeupdate", updateCurrentTime);

      if (isPlaying) {
        audioRef.current
          .play()
          .catch((error) => console.error("Error playing audio:", error));
      } else {
        audioRef.current.pause();
      }

      return () => {
        audioRef.current?.removeEventListener("loadedmetadata", updateDuration);
        audioRef.current?.removeEventListener("timeupdate", updateCurrentTime);
      };
    }
  }, [currentSong.url, isPlaying, volume]);

  const handlePlayPause = () => {
    playPauseAudio(audioRef, isPlaying, setIsPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volumeValue = parseFloat(e.target.value);
    changeVolume(audioRef, volumeValue, setVolume);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      audioRef.current.currentTime =
        ((e.clientX - rect.left) / rect.width) * duration;
    }
  };

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleProgressChange(e);
  };

  const handleProgressMouseUp = () => {
    setIsDragging(false);
  };

  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      handleProgressChange(e);
    }
  };

  const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const newTime = ((e.clientX - rect.left) / rect.width) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) =>
    `${Math.floor(time / 60)}:${Math.floor(time % 60)
      .toString()
      .padStart(2, "0")}`;

  return (
    <div className="text-white ps-5  w-screen h-full flex opacity-85 items-center pb-3 pt-2 bg-black">
      <audio ref={audioRef} src={currentSong?.url || ""} />
      <div className="md:flex w-full">
        <div className="hidden md:flex md:flex-row flex-col md:w-[20%] w-[5%] items-center gap-4">
          <div className="lg:block hidden">
            <div className="text-md uppercase">{truncateText(currentSong.title, 10)}</div>
            <div className="text-xs opacity-75">{truncateText(currentSong.artist, 15)}</div>
          </div>
          <button onClick={() => setLiked(!liked)}>
            <Image
              src={liked ? likeIcon : heartIcon}
              alt={liked ? "Liked" : "Like"}
              height={23}
              width={23}
            />
          </button>
          <Image src={add} alt="add" height={23} width={23} />
        </div>
        <div className="lg:w-[60%] w-full flex flex-col">
          <div className="flex justify-center gap-4 pb-2">
            <Image
              src={shuffle}
              alt="Shuffle"
              height={20}
              width={20}
              className="me-3"
            />
            <Image src={backward} alt="Shuffle" height={20} width={20} />
            <button onClick={handlePlayPause}>
              <Image
                src={isPlaying ? pauseIcon : playIcon}
                alt="Play/Pause"
                height={40}
                width={40}
              />
            </button>
            <Image src={forward} alt="Shuffle" height={20} width={20} />
            <Image
              src={repeat}
              alt="Shuffle"
              height={20}
              width={20}
              className="ms-3"
            />
          </div>
          <div className="md:mx-16 mx-4">
            <div
              className="h-1 w-full bg-neutral-600 cursor-pointer relative"
              onClick={handleProgressClick}
              onMouseDown={handleProgressMouseDown}
              onMouseMove={handleProgressMouseMove}
              onMouseUp={handleProgressMouseUp}
              onMouseLeave={handleProgressMouseUp}
              ref={progressRef}
            >
              <div
                className="h-1 bg-blue-500"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              ></div>
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"
                style={{ left: `${(currentTime / duration) * 100}%` }}
              ></div>
              <div className="flex justify-between text-sm mt-1">
                <p>{formatTime(currentTime)}</p>
                <p>{formatTime(duration)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between m-3 p-3 text-lg items-center ">
          <div className="items-center flex">
            <button onClick={() => setIsMuted(!isMuted)}>
              <Image
                src={isMuted ? muteIcon : volumeIcon}
                alt="Volume/Mute"
                height={30}
                width={30}
              />
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-1"
            />
          </div>
          <div className="hidden lg:block">
          <div className="flex ms-3 space-x-3">
            <Image src={mic} alt="mic" height={25} width={25} />
            <Image src={desktop} alt="desktop" height={25} width={25} />
            <Image src={share} alt="share" height={21} width={21} />
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
