import { useState, useRef, useEffect } from 'react';

const SoundtrackButton: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Preload audio to minimize buffering
    audioRef.current = new Audio('/music/lobby.mp3');
    audioRef.current.preload = 'auto'; // Preload the audio
    audioRef.current.loop = true; // Enable looping

    const playAudio = () => {
      if (audioRef.current) {
        // Set volume to avoid clipping
        audioRef.current.volume = 0.8;
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.warn('Autoplay blocked:', error);
            setIsPlaying(false);
            const handleInteraction = () => {
              if (audioRef.current && !isPlaying) {
                audioRef.current.volume = 0.8;
                audioRef.current.play().catch(err => console.error('Retry failed:', err));
                setIsPlaying(true);
              }
              document.removeEventListener('click', handleInteraction);
            };
            document.addEventListener('click', handleInteraction);
          });
      }
    };

    playAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleSoundtrack = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.volume = 0.8;
      audioRef.current.play().catch(error => {
        console.error('Audio playback failed:', error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button
      onClick={toggleSoundtrack}
      style={{
        padding: "10px 20px",
        margin: "5px",
        border: "2px solid black",
        borderRadius: "5px",
        backgroundColor:  "#ddd",
        color: "black",
        fontWeight: "bold",
        cursor: "pointer",
      }}
      aria-label={isPlaying ? 'Pause Soundtrack' : 'Play Soundtrack'}
    >
      {isPlaying ? (
        <>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="black"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 9v6m4-6v6m0-6v6m-4-6v6"
            />
          </svg>
          <span className='text-black'>🎵</span>
        </>
      ) : (
        <>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="black"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-6.336-3.664A1 1 0 007 8.464v7.072a1 1 0 001.416.896l6.336-3.664a1 1 0 000-1.792z"
            />
          </svg>
          <span className='text-black'>🎵</span>
        </>
      )}
    </button>
  );
};

export default SoundtrackButton;