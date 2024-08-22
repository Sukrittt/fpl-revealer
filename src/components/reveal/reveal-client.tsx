"use client";

import gsap from "gsap";
import Image from "next/image";
import useSound from "use-sound";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import type { PlayerStatus, RevealMatch } from "@prisma/client";

import { getCategorizedFplPlayers } from "~/lib/utils";
import type { ExtendedFplPlayer, ExtendedFplTeamForReveal } from "~/types";

const revealMusic = "/music/reveal.mp3";

type ExtendedReval = RevealMatch & {
  homeTeam: ExtendedFplTeamForReveal;
  awayTeam: ExtendedFplTeamForReveal;
};

interface RevealClientProps {
  reveal: ExtendedReval;
}

type RevealStep = "team-name" | "team-owner" | "starting-11" | "substitutes";

type RevealSide = "home" | "away";

export const RevealClient: React.FC<RevealClientProps> = ({ reveal }) => {
  const [revealStep, setRevealStep] = useState<RevealStep | null>(null);
  const [revealSide, setRevealSide] = useState<RevealSide>("home");

  const [timerStarted, setTimerStarted] = useState(false);

  const startTimer = (away?: boolean) => {
    if (timerStarted) return;

    setTimerStarted(true);

    setTimeout(
      () => {
        setRevealStep("team-name");
      },
      !away ? 4_000 : 0,
    );

    setTimeout(
      () => {
        setRevealStep("team-owner");
      },
      !away ? 7_500 : 2_000,
    );

    setTimeout(
      () => {
        setRevealStep("starting-11");
      },
      !away ? 11_000 : 5_750,
    );

    setTimerStarted(false);
  };

  const [, { sound }] = useSound(revealMusic, {
    onplay: () => {
      startTimer();
    },
    format: ["mp3"],
  });

  useEffect(() => {
    sound?.play();

    return () => sound?.unload();
  }, [sound]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-y-2 bg-[url('/images/background.png')] bg-center text-white">
      {revealSide === "home" && (
        <>
          {revealStep === "team-name" && (
            <p className="text-2xl font-bold">{reveal.homeTeam.name}</p>
          )}
          {revealStep === "team-owner" && (
            <p className="text-2xl font-bold">{reveal.homeTeam.user.name}</p>
          )}
          {revealStep === "starting-11" && (
            <HomePlayerReveal
              startAwayTime={startTimer}
              setRevealSide={setRevealSide}
              fplPlayers={reveal.homeTeam.fplPlayers}
            />
          )}
        </>
      )}

      {revealSide === "away" && (
        <>
          {revealStep === "team-name" && (
            <p className="text-2xl font-bold">{reveal.awayTeam.name}</p>
          )}
          {revealStep === "team-owner" && (
            <p className="text-2xl font-bold">{reveal.awayTeam.user.name}</p>
          )}
          {revealStep === "starting-11" && (
            <AwayPlayerReveal fplPlayers={reveal.awayTeam.fplPlayers} />
          )}
        </>
      )}
    </div>
  );
};

interface HomePlayerReveal {
  fplPlayers: ExtendedFplPlayer[];
  setRevealSide: React.Dispatch<React.SetStateAction<RevealSide>>;
  startAwayTime?: (away?: boolean) => void;
}

const HomePlayerReveal: React.FC<HomePlayerReveal> = ({
  fplPlayers,
  setRevealSide,
  startAwayTime,
}) => {
  const [playerRevealCount, setPlayerRevealCount] = useState(1);

  const startTimer = () => {
    setTimeout(() => {
      setPlayerRevealCount(2);
    }, 2_000);

    setTimeout(() => {
      setPlayerRevealCount(3);
    }, 3_750);

    setTimeout(() => {
      setPlayerRevealCount(4);
    }, 5_500);

    setTimeout(() => {
      setPlayerRevealCount(5);
    }, 7_500);

    setTimeout(() => {
      setPlayerRevealCount(6);
    }, 9_000);

    setTimeout(() => {
      setPlayerRevealCount(7);
    }, 11_000);

    setTimeout(() => {
      setPlayerRevealCount(8);
    }, 13_000);

    setTimeout(() => {
      setPlayerRevealCount(9);
    }, 15_000);

    setTimeout(() => {
      setPlayerRevealCount(10);
    }, 16_500);

    setTimeout(() => {
      setPlayerRevealCount(11);
    }, 18_500);

    setTimeout(() => {
      setPlayerRevealCount(12);
    }, 20_000);

    setTimeout(() => {
      setRevealSide("away");
      startAwayTime?.(true);
    }, 24_000);
  };

  useEffect(() => {
    startTimer();
  }, []);

  const players = getCategorizedFplPlayers(fplPlayers);

  const getSeperatedPlayers = (
    fplPlayers: ExtendedFplPlayer[],
    status: PlayerStatus,
  ) => {
    return fplPlayers.filter((player) => player.status === status);
  };

  const startingElevenPlayers = [
    ...getSeperatedPlayers(players.GOALKEEPER, "STARTER"),
    ...getSeperatedPlayers(players.DEFENDER, "STARTER"),
    ...getSeperatedPlayers(players.MIDFIELDER, "STARTER"),
    ...getSeperatedPlayers(players.FORWARD, "STARTER"),
  ];

  const benchPlayers = [
    ...getSeperatedPlayers(players.GOALKEEPER, "BENCH"),
    ...getSeperatedPlayers(players.DEFENDER, "BENCH"),
    ...getSeperatedPlayers(players.MIDFIELDER, "BENCH"),
    ...getSeperatedPlayers(players.FORWARD, "BENCH"),
  ];

  const activePlayer = startingElevenPlayers[playerRevealCount - 1];

  const container = useRef<HTMLDivElement | null>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      tl.current = gsap
        .timeline()
        .from(`.jersey-reveal`, {
          scale: 0.7,
          duration: 0.75,
          stagger: 0.1,
        })
        .from(
          `.text-reveal`,
          {
            opacity: 0,
            scale: 0.7,
            duration: 0.75,
            stagger: 0.1,
          },
          "-=0.7",
        );
    },
    {
      scope: container,
      dependencies: [activePlayer],
    },
  );

  return (
    <div ref={container}>
      {activePlayer && playerRevealCount < 12 ? (
        <div className="relative flex w-full flex-col items-center gap-y-2">
          <Image
            src={
              activePlayer.player.position === "GOALKEEPER"
                ? (activePlayer.player.club.goalkeeperJerseyUrl ??
                  activePlayer.player.club.jerseyUrl)
                : activePlayer.player.club.jerseyUrl
            }
            className="jersey-reveal object-contain opacity-70"
            alt={`${activePlayer.player.name} Jersey`}
            width={300}
            height={300}
            quality={100}
          />

          <div className="absolute top-1/2 w-full">
            <div className="flex w-full flex-col items-center gap-y-0.5 uppercase">
              <p className="text-reveal text-5xl font-bold">
                {activePlayer.player.displayName ?? activePlayer.player.name}
              </p>
              <p className="text-reveal text-lg">
                {activePlayer.player.position.charAt(0) +
                  activePlayer.player.position.slice(1).toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-x-14">
          {benchPlayers.map((fplPlayer) => (
            <div key={fplPlayer.id} className="relative flex flex-col gap-y-2">
              <Image
                src={
                  fplPlayer.player.position === "GOALKEEPER"
                    ? (fplPlayer.player.club.goalkeeperJerseyUrl ??
                      fplPlayer.player.club.jerseyUrl)
                    : fplPlayer.player.club.jerseyUrl
                }
                className="jersey-reveal object-contain opacity-70"
                alt={`${fplPlayer.player.name} Jersey`}
                width={300}
                height={300}
                quality={100}
              />

              <div className="absolute top-1/2">
                <p className="text-reveal text-5xl font-bold">
                  {fplPlayer.player.displayName ?? fplPlayer.player.name}
                </p>
                <p className="text-reveal text-lg">
                  {fplPlayer.player.position.charAt(0) +
                    fplPlayer.player.position.slice(1).toLowerCase()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface AwayPlayerReveal {
  fplPlayers: ExtendedFplPlayer[];
}

const AwayPlayerReveal: React.FC<AwayPlayerReveal> = ({ fplPlayers }) => {
  const [playerRevealCount, setPlayerRevealCount] = useState(1);

  const startTimer = () => {
    setTimeout(() => {
      setPlayerRevealCount(2);
    }, 1_750);

    setTimeout(() => {
      setPlayerRevealCount(3);
    }, 3_500);

    setTimeout(() => {
      setPlayerRevealCount(4);
    }, 5_500);

    setTimeout(() => {
      setPlayerRevealCount(5);
    }, 7_000);

    setTimeout(() => {
      setPlayerRevealCount(6);
    }, 9_000);

    setTimeout(() => {
      setPlayerRevealCount(7);
    }, 11_000);

    setTimeout(() => {
      setPlayerRevealCount(8);
    }, 12_500);

    setTimeout(() => {
      setPlayerRevealCount(9);
    }, 14_500);

    setTimeout(() => {
      setPlayerRevealCount(10);
    }, 16_500);

    setTimeout(() => {
      setPlayerRevealCount(11);
    }, 18_000);

    setTimeout(() => {
      setPlayerRevealCount(12);
    }, 20_500);
  };

  useEffect(() => {
    startTimer();
  }, []);

  const players = getCategorizedFplPlayers(fplPlayers);

  const getSeperatedPlayers = (
    fplPlayers: ExtendedFplPlayer[],
    status: PlayerStatus,
  ) => {
    return fplPlayers.filter((player) => player.status === status);
  };

  const startingElevenPlayers = [
    ...getSeperatedPlayers(players.GOALKEEPER, "STARTER"),
    ...getSeperatedPlayers(players.DEFENDER, "STARTER"),
    ...getSeperatedPlayers(players.MIDFIELDER, "STARTER"),
    ...getSeperatedPlayers(players.FORWARD, "STARTER"),
  ];

  const benchPlayers = [
    ...getSeperatedPlayers(players.GOALKEEPER, "BENCH"),
    ...getSeperatedPlayers(players.DEFENDER, "BENCH"),
    ...getSeperatedPlayers(players.MIDFIELDER, "BENCH"),
    ...getSeperatedPlayers(players.FORWARD, "BENCH"),
  ];
  const activePlayer = startingElevenPlayers[playerRevealCount - 1];

  const container = useRef<HTMLDivElement | null>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      tl.current = gsap
        .timeline()
        .from(`.jersey-reveal`, {
          scale: 0.7,
          duration: 0.75,
          stagger: 0.1,
        })
        .from(
          `.text-reveal`,
          {
            opacity: 0,
            scale: 0.7,
            duration: 0.75,
            stagger: 0.1,
          },
          "-=0.7",
        );
    },
    {
      scope: container,
      dependencies: [activePlayer],
    },
  );

  return (
    <div ref={container}>
      {activePlayer && playerRevealCount < 12 ? (
        <div className="relative flex w-full flex-col items-center gap-y-2">
          <Image
            src={
              activePlayer.player.position === "GOALKEEPER"
                ? (activePlayer.player.club.goalkeeperJerseyUrl ??
                  activePlayer.player.club.jerseyUrl)
                : activePlayer.player.club.jerseyUrl
            }
            className="jersey-reveal object-contain opacity-70"
            alt={`${activePlayer.player.name} Jersey`}
            width={300}
            height={300}
            quality={100}
          />

          <div className="absolute top-1/2 w-full">
            <div className="flex w-full flex-col items-center gap-y-0.5 uppercase">
              <p className="text-reveal text-5xl font-bold">
                {activePlayer.player.displayName ?? activePlayer.player.name}
              </p>
              <p className="text-reveal text-lg">
                {activePlayer.player.position.charAt(0) +
                  activePlayer.player.position.slice(1).toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-x-14">
          {benchPlayers.map((fplPlayer) => (
            <div key={fplPlayer.id} className="relative flex flex-col gap-y-2">
              <Image
                src={
                  fplPlayer.player.position === "GOALKEEPER"
                    ? (fplPlayer.player.club.goalkeeperJerseyUrl ??
                      fplPlayer.player.club.jerseyUrl)
                    : fplPlayer.player.club.jerseyUrl
                }
                className="jersey-reveal object-contain opacity-70"
                alt={`${fplPlayer.player.name} Jersey`}
                width={300}
                height={300}
                quality={100}
              />

              <div className="absolute top-1/2">
                <p className="text-reveal text-5xl font-bold">
                  {fplPlayer.player.displayName ?? fplPlayer.player.name}
                </p>
                <p className="text-reveal text-lg">
                  {fplPlayer.player.position.charAt(0) +
                    fplPlayer.player.position.slice(1).toLowerCase()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
