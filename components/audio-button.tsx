"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";

interface AudioButtonProps {
  url: string;
  label: string;
  className?: string;
}

export function AudioButton({ url, label, className }: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Effet pour réinitialiser l'audio lorsque l'URL change
  useEffect(() => {
    // Nettoyer l'ancien audio si existant
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
    }
  }, [url]);

  const togglePlayPause = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      
      audioRef.current.addEventListener("ended", () => {
        setIsPlaying(false);
      });
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  return <Button
    variant="outline"
    onClick={togglePlayPause}
    className={className}
  >
    {isPlaying ? "Pause" : label}
  </Button>
}
