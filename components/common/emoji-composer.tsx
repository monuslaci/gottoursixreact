"use client";

import type { ReactNode } from "react";

import { Button, Textarea } from "@heroui/react";

const BASIC_EMOJIS = ["🙂", "🙏", "💪", "❤️", "🔥", "👏", "🤝", "🌱"] as const;

type EmojiComposerProps = {
  actionLabel: string;
  value: string;
  onValueChange: (value: string) => void;
  onAction: () => void | Promise<void>;
  actionIcon?: ReactNode;
  footerNote?: string;
  helperText?: string;
  isActionLoading?: boolean;
  isDisabled?: boolean;
  label?: string;
  minRows?: number;
  placeholder?: string;
  topSlot?: ReactNode;
};

export function EmojiComposer({
  actionLabel,
  value,
  onValueChange,
  onAction,
  actionIcon,
  footerNote,
  helperText,
  isActionLoading = false,
  isDisabled = false,
  label = "Write something",
  minRows = 5,
  placeholder = " ",
  topSlot,
}: EmojiComposerProps) {
  const minEditorHeightClass = minRows <= 4 ? "min-h-[120px]" : "min-h-[180px]";

  function appendEmoji(emoji: string) {
    onValueChange(`${value}${value ? " " : ""}${emoji}`);
  }

  return (
    <div className="space-y-4">
      {topSlot}

      <div className="overflow-hidden rounded-2xl border border-divider/70 bg-content1/90 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 border-b border-divider/70 px-3 py-3">
          {BASIC_EMOJIS.map((emoji) => (
            <Button
              key={emoji}
              isIconOnly
              aria-label={`Add ${emoji}`}
              className="h-9 w-9 min-w-9 rounded-full bg-content2 text-base"
              isDisabled={isDisabled}
              variant="flat"
              onPress={() => appendEmoji(emoji)}
            >
              <span aria-hidden="true">{emoji}</span>
            </Button>
          ))}
        </div>

        <div className="px-4 pt-3">
          <p className="text-sm font-medium text-foreground">{label}</p>
        </div>

        <Textarea
          minRows={minRows}
          placeholder={placeholder}
          value={value}
          onValueChange={onValueChange}
          isDisabled={isDisabled}
          classNames={{
            base: "w-full",
            inputWrapper:
              `${minEditorHeightClass} rounded-none border-0 bg-transparent px-4 pb-3 pt-2 shadow-none`,
            input: "pt-0 text-sm leading-6",
          }}
        />

        <div className="flex flex-col gap-3 border-t border-divider/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            {helperText ? <p className="text-xs text-default-500">{helperText}</p> : null}
            {footerNote ? <p className="text-xs text-default-500">{footerNote}</p> : null}
          </div>
          <Button
            color="primary"
            isLoading={isActionLoading}
            isDisabled={isDisabled}
            startContent={actionIcon}
            className="h-auto whitespace-normal px-4 py-3 text-center leading-5"
            onPress={() => void onAction()}
          >
            {actionLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
