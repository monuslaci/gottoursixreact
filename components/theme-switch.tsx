"use client";

import { VisuallyHidden } from "@react-aria/visually-hidden";
import { useIsSSR } from "@react-aria/ssr";
import { SwitchProps, useSwitch } from "@heroui/react";
import clsx from "clsx";
import { FC } from "react";
import { useTheme } from "next-themes";

import { MoonFilledIcon, SunFilledIcon } from "@/components/icons";

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
          "cursor-pointer rounded-xl bg-secondary/10 p-2 text-primary transition-colors hover:bg-secondary/16",
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
              "flex h-auto w-auto items-center justify-center",
              "bg-transparent",
              "rounded-lg",
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
        {!isSelected || isSSR ? <SunFilledIcon size={22} /> : <MoonFilledIcon size={22} />}
      </div>
    </Component>
  );
};
