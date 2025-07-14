import React, { FC, useRef, useState, useEffect } from 'react';
import YouTube, { YouTubePlayer } from 'react-youtube';
import Vimeo from '@u-wave/react-vimeo';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
}

const isYouTubeUrl = (url: string) => {
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(url);
};

const getYouTubeId = (url: string) => {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([\w-]{11})/);
  return match ? match[1] : '';
};

const isVimeoUrl = (url: string) => {
  return /^(https?:\/\/)?(www\.)?vimeo\.com\//.test(url);
};

const getVimeoId = (url: string) => {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : '';
};

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const VideoPlayer: FC<VideoPlayerProps> = ({
  src,
  poster,
  className = '',
  autoPlay = false,
  controls = true,
}) => {
  // State for all video types
  const [playing, setPlaying] = useState(autoPlay);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for each player type
  const videoRef = useRef<HTMLVideoElement>(null);
  const youtubeRef = useRef<YouTubePlayer | null>(null);
  const vimeoRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const youtubeIframeRef = useRef<HTMLIFrameElement>(null);
  const vimeoIframeRef = useRef<HTMLIFrameElement>(null);

  // Detect video type
  const isYouTube = isYouTubeUrl(src);
  const isVimeo = isVimeoUrl(src);
  const isDirect = !isYouTube && !isVimeo;

  // --- Handlers for all video types ---
  const handlePlayPause = () => {
    console.log('handlePlayPause', { isDirect, isYouTube, isVimeo, playing, refs: { video: videoRef.current, yt: youtubeRef.current, vimeo: vimeoRef.current } });
    if (isDirect && videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    } else if (isYouTube && youtubeRef.current) {
      if (playing) {
        youtubeRef.current.pauseVideo();
      } else {
        youtubeRef.current.playVideo();
      }
    } else if (isVimeo && vimeoRef.current) {
      if (playing) {
        vimeoRef.current.pause();
      } else {
        vimeoRef.current.play();
      }
    }
    setPlaying(!playing);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    console.log('handleSeek', { time, isDirect, isYouTube, isVimeo, refs: { video: videoRef.current, yt: youtubeRef.current, vimeo: vimeoRef.current } });
    if (isDirect && videoRef.current) {
      videoRef.current.currentTime = time;
    } else if (isYouTube && youtubeRef.current) {
      youtubeRef.current.seekTo(time, true);
    } else if (isVimeo && vimeoRef.current) {
      vimeoRef.current.setCurrentTime(time);
    }
    setCurrentTime(time);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = Number(e.target.value);
    console.log('handleVolume', { vol, isDirect, isYouTube, isVimeo, refs: { video: videoRef.current, yt: youtubeRef.current, vimeo: vimeoRef.current } });
    setVolume(vol);
    if (isDirect && videoRef.current) {
      videoRef.current.volume = vol;
    } else if (isYouTube && youtubeRef.current) {
      youtubeRef.current.setVolume(vol * 100);
    } else if (isVimeo && vimeoRef.current) {
      vimeoRef.current.setVolume(vol);
    }
  };

  const handleMute = () => {
    console.log('handleMute', { muted, isDirect, isYouTube, isVimeo, refs: { video: videoRef.current, yt: youtubeRef.current, vimeo: vimeoRef.current } });
    setMuted(!muted);
    if (isDirect && videoRef.current) {
      videoRef.current.muted = !muted;
    } else if (isYouTube && youtubeRef.current) {
      youtubeRef.current[!muted ? 'mute' : 'unMute']();
    } else if (isVimeo && vimeoRef.current) {
      vimeoRef.current.setVolume(!muted ? 0 : volume);
    }
  };

  const handleSpeed = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const rate = Number(e.target.value);
    console.log('handleSpeed', { rate, isDirect, isYouTube, isVimeo, refs: { video: videoRef.current, yt: youtubeRef.current, vimeo: vimeoRef.current } });
    setPlaybackRate(rate);
    if (isDirect && videoRef.current) {
      videoRef.current.playbackRate = rate;
    } else if (isYouTube && youtubeRef.current) {
      youtubeRef.current.setPlaybackRate(rate);
    } else if (isVimeo && vimeoRef.current) {
      vimeoRef.current.setPlaybackRate(rate);
    }
  };

  const handleFullscreen = () => {
    // Always fullscreen the container for all video types
    if (containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if ((containerRef.current as any).webkitRequestFullscreen) {
        (containerRef.current as any).webkitRequestFullscreen();
      } else if ((containerRef.current as any).msRequestFullscreen) {
        (containerRef.current as any).msRequestFullscreen();
      }
      setFullscreen(true);
    }
  };

  // --- Player-specific event handlers ---
  // Direct video events
  useEffect(() => {
    if (isDirect && videoRef.current) {
      const v = videoRef.current;
      const onLoaded = () => {
        setDuration(v.duration);
        setCurrentTime(v.currentTime);
        console.log('Direct video loaded', { duration: v.duration, currentTime: v.currentTime });
      };
      const onTimeUpdate = () => {
        setCurrentTime(v.currentTime);
        // console.log('Direct video timeupdate', { currentTime: v.currentTime });
      };
      const onEnded = () => {
        setPlaying(false);
        console.log('Direct video ended');
      };
      v.addEventListener('loadedmetadata', onLoaded);
      v.addEventListener('timeupdate', onTimeUpdate);
      v.addEventListener('ended', onEnded);
      return () => {
        v.removeEventListener('loadedmetadata', onLoaded);
        v.removeEventListener('timeupdate', onTimeUpdate);
        v.removeEventListener('ended', onEnded);
      };
    }
  }, [isDirect, src]);

  // YouTube events
  const onYouTubeReady = (event: any) => {
    youtubeRef.current = event.target;
    setDuration(event.target.getDuration());
    setVolume(event.target.getVolume() / 100);
    setMuted(event.target.isMuted());
    setPlaybackRate(event.target.getPlaybackRate());
    if (autoPlay) event.target.playVideo();
    console.log('YouTube onReady', { player: event.target });
  };
  const onYouTubeStateChange = (event: any) => {
    console.log('YouTube onStateChange', { data: event.data, player: event.target });
    if (event.data === 1) setPlaying(true); // playing
    if (event.data === 2) setPlaying(false); // paused
    if (event.data === 0) setPlaying(false); // ended
  };
  useEffect(() => {
    let interval: any;
    if (isYouTube && youtubeRef.current) {
      interval = setInterval(() => {
        setCurrentTime(youtubeRef.current!.getCurrentTime());
        setDuration(youtubeRef.current!.getDuration());
        // console.log('YouTube polling', { currentTime: youtubeRef.current!.getCurrentTime(), duration: youtubeRef.current!.getDuration() });
      }, 500);
    }
    return () => interval && clearInterval(interval);
  }, [isYouTube, src]);

  // Vimeo events
  const onVimeoReady = (player: any) => {
    vimeoRef.current = player;
    player.getDuration().then((d: number) => { setDuration(d); console.log('Vimeo getDuration', d); });
    player.getCurrentTime().then((t: number) => { setCurrentTime(t); console.log('Vimeo getCurrentTime', t); });
    player.getVolume().then((v: number) => { setVolume(v); console.log('Vimeo getVolume', v); });
    player.getPlaybackRate().then((r: number) => { setPlaybackRate(r); console.log('Vimeo getPlaybackRate', r); });
    if (autoPlay) player.play();
    console.log('Vimeo onReady', { player });
  };
  useEffect(() => {
    let interval: any;
    if (isVimeo && vimeoRef.current) {
      interval = setInterval(() => {
        vimeoRef.current.getCurrentTime().then((t: number) => setCurrentTime(t));
        vimeoRef.current.getDuration().then((d: number) => setDuration(d));
        // console.log('Vimeo polling', { currentTime: vimeoRef.current.getCurrentTime(), duration: vimeoRef.current.getDuration() });
      }, 500);
    }
    return () => interval && clearInterval(interval);
  }, [isVimeo, src]);

  // --- Render ---
  return (
    <div ref={containerRef} className={`aspect-video rounded-lg overflow-hidden bg-black flex items-center justify-center relative ${className}`}>
      {error ? (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <p className="text-[#2C3E50]/60">{error}</p>
        </div>
      ) : isYouTube ? (
        <div className="w-full h-full relative">
          <YouTube
            videoId={getYouTubeId(src)}
            opts={{
              width: '100%',
              height: '100%',
              playerVars: {
                controls: 0,
                modestbranding: 1,
                rel: 0,
                fs: 0,
                iv_load_policy: 3,
                disablekb: 0,
                autoplay: autoPlay ? 1 : 0,
              },
            }}
            onReady={onYouTubeReady}
            onStateChange={onYouTubeStateChange}
            className="w-full h-full pointer-events-none"
            iframeClassName="w-full h-full pointer-events-none"
            // @ts-ignore
            ref={(instance: any) => {
              // react-youtube doesn't forward ref to iframe, so we find it manually
              if (instance && instance.getInternalPlayer) {
                const iframe = instance.getInternalPlayer();
                if (iframe && iframe.tagName === 'IFRAME') {
                  youtubeIframeRef.current = iframe;
                } else if (iframe && iframe.iframe) {
                  youtubeIframeRef.current = iframe.iframe;
                }
              }
            }}
          />
          {/* Overlay to hide YouTube overlays at all times */}
          <div
            className="absolute inset-0 z-10"
            style={{ pointerEvents: 'none', background: 'transparent' }}
          />
        </div>
      ) : isVimeo ? (
        <div className="w-full h-full relative">
          <Vimeo
            video={getVimeoId(src)}
            autoplay={autoPlay}
            controls={false}
            responsive
            onReady={onVimeoReady}
            className="w-full h-full pointer-events-none"
            // @ts-ignore
            ref={(iframe: HTMLIFrameElement) => {
              vimeoIframeRef.current = iframe;
            }}
          />
        </div>
      ) : (
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
          controls={false}
        className="w-full h-full object-contain"
        preload="metadata"
          onError={e => {
            setError('Failed to load video file.');
            console.error('Video element error:', e);
          }}
        />
      )}
      {/* Custom Controls Overlay */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col space-y-2 z-20" style={{ pointerEvents: 'auto' }}>
        <div className="flex items-center space-x-4">
          <button onClick={handlePlayPause} className="text-white text-lg font-bold focus:outline-none">
            {playing ? '❚❚' : '►'}
          </button>
          <span className="text-white text-xs w-12 text-right">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 mx-2"
          />
          <span className="text-white text-xs w-12">{formatTime(duration)}</span>
          <button onClick={handleMute} className="text-white text-lg ml-2 focus:outline-none">
            {muted || volume === 0 ? '🔇' : '🔊'}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={handleVolume}
            className="w-20 mx-2"
            disabled={muted}
          />
          <select value={playbackRate} onChange={handleSpeed} className="ml-2 px-1 rounded">
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
              <option key={rate} value={rate}>{rate}x</option>
            ))}
          </select>
          <button onClick={handleFullscreen} className="text-white text-lg ml-2 focus:outline-none">⛶</button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;