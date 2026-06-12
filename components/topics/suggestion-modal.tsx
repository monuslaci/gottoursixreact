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

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" size="lg">
        <ModalContent>
          {(close) => (
            <>
              <ModalHeader className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Chip color="secondary" variant="flat">
                    Suggestion
                  </Chip>
                  <Chip color="primary" variant="flat">
                    {kind}
                  </Chip>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
                  <p className="text-sm text-default-500">{description}</p>
                  {topicTitle ? (
                    <p className="text-xs uppercase tracking-[0.14em] text-secondary">
                      {topicTitle}
                    </p>
                  ) : null}
                </div>
              </ModalHeader>

              <ModalBody className="gap-4">
                <Input
                  isRequired
                  label={kind === "TOPIC" ? "Topic idea" : "Subtopic idea"}
                  placeholder=" "
                  value={suggestionTitle}
                  onValueChange={setSuggestionTitle}
                />
                <Textarea
                  label="Details"
                  placeholder=" "
                  minRows={4}
                  value={suggestionDescription}
                  onValueChange={setSuggestionDescription}
                />
                {error ? <p className="text-sm text-danger-500">{error}</p> : null}
              </ModalBody>

              <ModalFooter>
                <Button variant="flat" onPress={close}>
                  Cancel
                </Button>
                <Button color="primary" isLoading={isSubmitting} onPress={() => void handleSubmit()}>
                  Send suggestion
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
