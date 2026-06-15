"use client";

import { VisuallyHidden } from "@react-aria/visually-hidden";
import { useIsSSR } from "@react-aria/ssr";
import { SwitchProps, useSwitch } from "@heroui/react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { MoonStar, SunMedium } from "lucide-react";
import { FC } from "react";
import { useTheme } from "next-themes";

export interface ThemeSwitchProps {
  className?: string;
  classNames?: SwitchProps["classNames"];
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({
  className,
  classNames,
}) => {
  const { resolvedTheme, setTheme } = useTheme();
  const isSSR = useIsSSR();

  const isDark = !isSSR && resolvedTheme === "dark";

  const onChange = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch({
    isSelected: isDark,
    "aria-label": `Switch to ${isDark ? "light" : "dark"} mode`,
    onChange,
  });

  return (
    <Component
      {...getBaseProps({
        className: clsx(
          "group cursor-pointer rounded-full border border-primary/12 bg-[linear-gradient(135deg,rgba(var(--content1),0.94),rgba(var(--content2),0.9))] p-1.5 text-primary shadow-[0_12px_28px_rgba(27,54,93,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:border-brotherhood-bronze/35 hover:bg-[linear-gradient(135deg,rgba(var(--content1),1),rgba(var(--heroui-colors-primary-50),0.95))] dark:border-white/12 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(var(--content2),0.86))] dark:text-white dark:hover:border-white/20 dark:hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(var(--content2),0.92))]",
          className,
          classNames?.base
        ),
      })}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div
        {...getWrapperProps()}
        className={slots.wrapper({
          class: clsx(
            [
              "relative flex h-auto w-auto items-center justify-center overflow-hidden",
              "bg-transparent",
              "rounded-full",
              "px-0",
              "pt-px",
              "mx-0",
              "!text-primary",
              "group-data-[selected=true]:bg-transparent",
            ],
            classNames?.wrapper
          ),
        })}
      >
        <motion.span
          key={isSelected && !isSSR ? "moon" : "sun"}
          initial={{ opacity: 0, rotate: -24, scale: 0.75 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className={clsx(
            "relative flex h-8 w-8 items-center justify-center rounded-full",
            isSelected && !isSSR
              ? "bg-[linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0.06))] text-white"
              : "bg-[linear-gradient(135deg,rgba(var(--heroui-colors-warning),0.22),rgba(255,255,255,0.8))] text-[rgb(var(--heroui-colors-primary-700))]"
          )}
        >
          <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.4),transparent_58%)]" />
          {!isSelected || isSSR ? (
            <SunMedium className="relative z-10 h-[18px] w-[18px]" />
          ) : (
            <MoonStar className="relative z-10 h-[18px] w-[18px]" />
          )}
        </motion.span>
      </div>
    </Component>
  );
};
