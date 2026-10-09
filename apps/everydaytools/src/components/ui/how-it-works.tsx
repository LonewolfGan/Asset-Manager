"use client";

import React from "react";
import { LazyMotion, domAnimation, m } from "motion/react";

export interface CardProps {
  number: string;
  title: string;
  description: string;
  colorTheme?: "orange" | "blue" | "purple";
  className?: string;
  rotate?: string;
  colors?: {
    bg: string;
    text: string;
    border: string;
  };
}

const Pin = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M16 3a1 1 0 0 1 .117 1.993l-.117 .007v4.764l1.894 3.789a1 1 0 0 1 .1 .331l.006 .116v2a1 1 0 0 1 -.883 .993l-.117 .007h-4v4a1 1 0 0 1 -1.993 .117l-.007 -.117v-4h-4a1 1 0 0 1 -.993 -.883l-.007 -.117v-2a1 1 0 0 1 .06 -.34l.046 -.107l1.894 -3.791v-4.762a1 1 0 0 1 -.117 -1.993l.117 -.007h8z" />
  </svg>
);

const Card = ({
  number,
  title,
  description,
  colorTheme = "blue",
  className = "",
  rotate = "",
  colors: customColors,
}: CardProps) => {
  const defaultBgColors = {
    orange: "bg-orange-50 dark:bg-orange-500/10",
    blue: "bg-blue-50 dark:bg-blue-500/10",
    purple: "bg-purple-50 dark:bg-purple-500/10",
  };
  const defaultTextColors = {
    orange: "text-orange-500 dark:text-orange-400",
    blue: "text-blue-600 dark:text-blue-400",
    purple: "text-purple-600 dark:text-purple-400",
  };
  const defaultBorderColors = {
    orange: "border-orange-100 dark:border-orange-500/20",
    blue: "border-blue-100 dark:border-blue-500/20",
    purple: "border-purple-100 dark:border-purple-500/20",
  };

  const bgColor = customColors?.bg || defaultBgColors[colorTheme];
  const textColor = customColors?.text || defaultTextColors[colorTheme];
  const borderColor = customColors?.border || defaultBorderColors[colorTheme];

  return (
    <div
      className={`relative w-full max-w-[340px] lg:max-w-[360px] shrink-0 transition-all duration-300 hover:z-30 hover:scale-[1.03] hover:rotate-0 ${rotate} ${className}`}
    >
      <div className="bg-white dark:bg-zinc-900 p-2.5 sm:p-3 rounded-[26px] shadow-[0px_12px_28px_-6px_rgba(0,0,0,0.08)] dark:shadow-none border border-neutral-200/80 dark:border-zinc-800 h-full flex flex-col">
        <Pin className={`w-8 h-8 ${textColor} z-20 mb-4 sm:mb-5 mx-auto drop-shadow-sm shrink-0`} />
        <div
          className={`${bgColor} border ${borderColor} rounded-[18px] p-5 sm:p-6 flex-1 flex flex-col relative overflow-hidden`}
        >
          <span
            className={`${textColor} text-4xl sm:text-5xl font-handwriting mb-3 sm:mb-4 select-none leading-none`}
            style={{
              fontFamily: '"Chalkboard SE", "Comic Sans MS", "Comic Sans", cursive, sans-serif',
            }}
          >
            {number}
          </span>
          <h3 className="text-lg sm:text-xl font-semibold text-neutral-800 dark:text-neutral-100 leading-snug mb-2 sm:mb-2.5">
            {title}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-[15px] leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

const ThreadConnector = ({ index }: { index: number }) => {
  return (
    <>
      {/* Desktop Horizontal Thread */}
      <div className="hidden md:flex flex-1 items-center justify-center min-w-[60px] max-w-[140px] lg:max-w-[180px] pt-10 lg:pt-12 px-1 select-none pointer-events-none">
        <svg
          viewBox="0 0 140 40"
          className="w-full h-10 overflow-visible"
          fill="none"
          aria-hidden="true"
        >
          <m.path
            d={
              index % 2 === 0
                ? "M 5 16 C 45 44, 95 -8, 135 20"
                : "M 5 22 C 45 -6, 95 44, 135 14"
            }
            stroke="currentColor"
            className="text-zinc-400 dark:text-zinc-500"
            strokeWidth="2.5"
            strokeDasharray="7 5"
            strokeLinecap="round"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -120 }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </div>

      {/* Mobile Vertical Thread */}
      <div className="flex md:hidden items-center justify-center h-12 w-full my-1 select-none pointer-events-none">
        <svg
          viewBox="0 0 32 48"
          className="h-full w-8 overflow-visible"
          fill="none"
          aria-hidden="true"
        >
          <m.path
            d="M 16 2 C 4 17, 28 31, 16 46"
            stroke="currentColor"
            className="text-zinc-400 dark:text-zinc-500"
            strokeWidth="2.5"
            strokeDasharray="6 5"
            strokeLinecap="round"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -110 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </div>
    </>
  );
};

export interface Step {
  title: string;
  description: string;
  colorTheme?: "orange" | "blue" | "purple";
  colors?: {
    bg: string;
    text: string;
    border: string;
  };
}

export interface HowItWorksProps {
  features?: Step[];
  className?: string;
  title?: string;
  subtitle?: string;
}

const DEFAULT_ROTATIONS = [
  "-rotate-2",
  "rotate-2",
  "-rotate-1",
  "rotate-1",
  "-rotate-2",
];

export default function HowItWorks({
  features,
  className = "",
  title,
  subtitle,
}: HowItWorksProps) {
  const defaultFeatures: Step[] = [
    {
      title: "Sélectionnez votre fichier",
      description:
        "Importez ou déposez votre document directement dans l'atelier local.",
      colorTheme: "orange",
    },
    {
      title: "Traitez en temps réel",
      description:
        "Votre navigateur opère les calculs et transformations instantanément.",
      colorTheme: "blue",
    },
    {
      title: "Téléchargez le résultat",
      description:
        "Récupérez votre fichier final propre et prêt à l'emploi.",
      colorTheme: "purple",
    },
  ];

  const data = features && features.length > 0 ? features : defaultFeatures;

  return (
    <LazyMotion features={domAnimation}>
      <div
        className={`w-full bg-transparent py-10 md:py-16 px-4 sm:px-6 lg:px-10 xl:px-12 relative ${className}`}
      >
        {/* Section Header: Grand Heroic Section Title */}
        {title && (
          <div className="text-center mb-14 md:mb-20 lg:mb-24 relative z-10 max-w-5xl mx-auto px-4">
            <h2
              className="text-4xl sm:text-6xl md:text-7xl lg:text-[80px] xl:text-[88px] font-normal md:font-medium tracking-[-0.03em] text-neutral-950 dark:text-neutral-50 leading-[0.98] select-none"
              style={{
                fontFamily: '"Bricolage Grotesque", "Outfit", "Space Grotesk", system-ui, sans-serif',
              }}
            >
              {title}
            </h2>
          </div>
        )}

        {/* Outer Container on PC: Expanded max-w-7xl with spacious thread connectors */}
        <div className="w-full max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-stretch justify-center w-full">
            {data.map((step, index) => {
              const rotation = DEFAULT_ROTATIONS[index % DEFAULT_ROTATIONS.length];

              return (
                <React.Fragment key={step.title}>
                  <Card
                    number={`0${index + 1}`}
                    title={step.title}
                    description={step.description}
                    colorTheme={
                      step.colorTheme ||
                      (index % 3 === 0
                        ? "orange"
                        : index % 3 === 1
                        ? "blue"
                        : "purple")
                    }
                    colors={step.colors}
                    rotate={rotation}
                  />

                  {/* Connecting thread between cards (not rendered after last card) */}
                  {index < data.length - 1 && (
                    <ThreadConnector index={index} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
