"use client";

import {
  FastForward,
  Gauge,
  Loader2,
  Pause,
  Play,
  Rewind,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2] as const;
const SKIP_SEC = 15;

type Props = {
  src: string;
  title: string;
  className?: string;
};

export function AudiobookPlayer({ src, title, className }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [buffering, setBuffering] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const [seekPercent, setSeekPercent] = useState(0);
  const [volumePct, setVolumePct] = useState(88);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1);
  const preMuteVolume = useRef(88);

  const pct = duration > 0 ? Math.min(100, (current / duration) * 100) : 0;
  const timelineValue = seeking ? seekPercent : pct;

  const applyVolume = useCallback((next: number, isMuted: boolean) => {
    const el = audioRef.current;
    if (!el) return;
    if (isMuted) {
      el.volume = 0;
    } else {
      el.volume = Math.min(1, Math.max(0, next / 100));
    }
  }, []);

  useEffect(() => {
    applyVolume(volumePct, muted);
  }, [volumePct, muted, applyVolume]);

  useEffect(() => {
    const el = audioRef.current;
    if (el) el.playbackRate = speed;
  }, [speed]);

  const seekToPercent = useCallback(
    (percent: number) => {
      const el = audioRef.current;
      if (!el || !Number.isFinite(duration) || duration <= 0) return;
      const next = (percent / 100) * duration;
      el.currentTime = Math.min(duration, Math.max(0, next));
      setCurrent(next);
    },
    [duration],
  );

  const skip = useCallback(
    (delta: number) => {
      const el = audioRef.current;
      if (!el || !Number.isFinite(duration)) return;
      const next = Math.min(duration, Math.max(0, el.currentTime + delta));
      el.currentTime = next;
      setCurrent(next);
    },
    [duration],
  );

  const toggleMute = () => {
    if (muted) {
      setMuted(false);
      setVolumePct(preMuteVolume.current || 40);
    } else {
      preMuteVolume.current = volumePct;
      setMuted(true);
    }
  };

  return (
    <div
      className={cn(
        "rounded-xl border bg-card/50 p-4 shadow-sm backdrop-blur-sm sm:p-5",
        className,
      )}
    >
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        className="hidden"
        aria-label={title}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration || 0);
          setError(null);
        }}
        onTimeUpdate={(e) => {
          if (!seeking) setCurrent(e.currentTarget.currentTime);
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onWaiting={() => setBuffering(true)}
        onCanPlay={() => setBuffering(false)}
        onPlaying={() => setBuffering(false)}
        onError={() =>
          setError(
            "Could not load audio. Check your connection or try another title.",
          )
        }
      />

      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="size-11 shrink-0 rounded-full"
            aria-label={`Rewind ${SKIP_SEC} seconds`}
            onClick={() => skip(-SKIP_SEC)}
          >
            <Rewind className="size-5" />
          </Button>
          <Button
            type="button"
            size="icon"
            className="size-14 shrink-0 rounded-full shadow-md"
            aria-label={playing ? "Pause" : "Play"}
            onClick={() => {
              const el = audioRef.current;
              if (!el) return;
              if (playing) void el.pause();
              else
                void el
                  .play()
                  .catch(() =>
                    setError("Playback was blocked. Try clicking play again."),
                  );
            }}
          >
            {buffering && playing ? (
              <Loader2 className="size-7 animate-spin" aria-hidden />
            ) : playing ? (
              <Pause className="size-7" />
            ) : (
              <Play className="ml-1 size-7" />
            )}
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="size-11 shrink-0 rounded-full"
            aria-label={`Fast forward ${SKIP_SEC} seconds`}
            onClick={() => skip(SKIP_SEC)}
          >
            <FastForward className="size-5" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3 text-xs tabular-nums text-muted-foreground">
            <span>{formatClock(current)}</span>
            <span className="hidden sm:inline">{formatClock(duration)}</span>
            <span className="sm:hidden">
              −{formatClock(Math.max(0, duration - current))}
            </span>
          </div>
          <div
            className="py-1"
            onPointerDownCapture={() => {
              setSeeking(true);
              setSeekPercent(pct);
            }}
          >
            <Slider
              value={[timelineValue]}
              max={100}
              step={0.25}
              disabled={!Number.isFinite(duration) || duration <= 0}
              onValueChange={(v) => {
                setSeekPercent(v[0] ?? 0);
              }}
              onValueCommit={(v) => {
                seekToPercent(v[0] ?? 0);
                setSeeking(false);
              }}
              aria-label="Seek position"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-border/60 pt-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-center gap-2">
              <Gauge
                className="size-3.5 shrink-0 text-muted-foreground"
                aria-hidden
              />
              <Label
                htmlFor="playback-speed"
                className="text-xs text-muted-foreground"
              >
                Speed
              </Label>
            </div>
            <select
              id="playback-speed"
              value={speed}
              onChange={(e) =>
                setSpeed(Number(e.target.value) as (typeof SPEEDS)[number])
              }
              className="h-9 w-full max-w-50 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {SPEEDS.map((s) => (
                <option key={s} value={s}>
                  {s === 1 ? "Normal (1×)" : `${s}×`}
                </option>
              ))}
            </select>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-2 sm:max-w-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">Volume</span>
              <span className="tabular-nums text-xs text-muted-foreground">
                {muted ? "Muted" : `${Math.round(volumePct)}%`}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-9 shrink-0"
                aria-label={muted ? "Unmute" : "Mute"}
                onClick={toggleMute}
              >
                {muted ? (
                  <VolumeX className="size-5 text-muted-foreground" />
                ) : (
                  <Volume2 className="size-5" />
                )}
              </Button>
              <Slider
                value={[muted ? 0 : volumePct]}
                max={100}
                step={1}
                onValueChange={(v) => {
                  const next = v[0] ?? 0;
                  setVolumePct(next);
                  if (next > 0) setMuted(false);
                }}
                className="flex-1 py-1"
                aria-label="Volume"
              />
            </div>
          </div>
        </div>
      </div>

      {error ? (
        <p className="mt-4 text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function formatClock(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}
