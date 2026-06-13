"use client";

import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { Lightbulb } from "lucide-react";
import { useState } from "react";

import { useUserProfile } from "@/lib/hooks/useUserProfile";

type SuggestionModalProps = {
  kind: "TOPIC" | "SUBTOPIC";
  topicId?: string;
  topicTitle?: string;
  buttonLabel: string;
  title: string;
  description: string;
};

export function SuggestionModal({
  kind,
  topicId,
  topicTitle,
  buttonLabel,
  title,
  description,
}: SuggestionModalProps) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const { user } = useUserProfile();
  const [suggestionTitle, setSuggestionTitle] = useState("");
  const [suggestionDescription, setSuggestionDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    const email = user?.email;

    if (!email) {
      setError("A member profile is required to submit suggestions.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kind,
          topicId,
          title: suggestionTitle,
          description: suggestionDescription,
          suggestedByEmail: email,
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to submit suggestion.");
      }

      setSuggestionTitle("");
      setSuggestionDescription("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit suggestion.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Button
        color="secondary"
        startContent={<Lightbulb className="h-4 w-4" />}
        variant="flat"
        onPress={onOpen}
      >
        {buttonLabel}
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        size="md"
      >
        <ModalContent className="overflow-hidden border border-primary/15 bg-content1 shadow-[0_24px_64px_rgb(var(--heroui-colors-primary-500)/0.16)]">
          {(close) => (
            <div className="flex max-h-[80vh] flex-col">
              <ModalHeader className="flex flex-col gap-3 border-b border-divider/70 bg-gradient-to-br from-primary/8 via-content1 to-content1 px-5 pb-4 pt-5 sm:px-6">
                <div className="flex items-center gap-2">
                  <Chip color="secondary" variant="flat">
                    Suggestion
                  </Chip>
                  <Chip color="primary" variant="flat">
                    {kind}
                  </Chip>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
                    {title}
                  </h3>
                  <p className="max-w-md text-sm leading-6 text-default-600">
                    {description}
                  </p>
                  {topicTitle ? (
                    <p className="text-xs uppercase tracking-[0.14em] text-secondary">
                      {topicTitle}
                    </p>
                  ) : null}
                </div>
              </ModalHeader>

              <ModalBody className="flex-1 gap-4 overflow-y-auto px-5 py-4 sm:px-6">
                <Input
                  isRequired
                  label={kind === "TOPIC" ? "Topic idea" : "Subtopic idea"}
                  placeholder={kind === "TOPIC" ? "Improve men's sleep" : "Weekly check-ins"}
                  value={suggestionTitle}
                  classNames={{
                    base: "w-full",
                    inputWrapper:
                      "bg-background/90 border border-divider/70 shadow-sm hover:border-primary/30 focus-within:border-primary/40",
                    input: "text-foreground placeholder:text-default-400",
                    label: "text-default-600",
                  }}
                  onValueChange={setSuggestionTitle}
                />
                <Textarea
                  label="Details"
                  placeholder="Add a few lines about what the topic should cover."
                  minRows={3}
                  value={suggestionDescription}
                  classNames={{
                    base: "w-full",
                    inputWrapper:
                      "bg-background/90 border border-divider/70 shadow-sm hover:border-primary/30 focus-within:border-primary/40",
                    input: "text-foreground placeholder:text-default-400",
                    label: "text-default-600",
                  }}
                  onValueChange={setSuggestionDescription}
                />
                {error ? <p className="text-sm text-danger-500">{error}</p> : null}
              </ModalBody>

              <ModalFooter className="gap-3 border-t border-divider/70 bg-content1 px-5 pb-5 pt-4 sm:px-6">
                <Button variant="flat" onPress={close}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={isSubmitting}
                  onPress={() => void handleSubmit()}
                >
                  Send suggestion
                </Button>
              </ModalFooter>
            </div>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
