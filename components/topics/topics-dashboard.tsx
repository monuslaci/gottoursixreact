"use client";

import { Button, Card, CardBody, Chip } from "@heroui/react";
import { Plus, Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";

type FloatingFieldProps = {
  isRequired?: boolean;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
};

function FloatingInput({
  isRequired,
  label,
  value,
  onValueChange,
}: FloatingFieldProps) {
  return (
    <label className="group relative block w-full">
      <input
        required={isRequired}
        className="peer h-14 w-full rounded-xl border border-divider/70 bg-content1/90 px-4 pb-2 pt-6 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-transparent focus:border-primary/40 focus:shadow-[0_0_0_4px_rgb(var(--heroui-colors-primary-500)/0.08)]"
        placeholder=" "
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
      />
      <span className="pointer-events-none absolute left-4 top-2 text-xs font-medium text-default-600 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-default-500 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:font-medium peer-focus:text-default-700">
        {label}
      </span>
    </label>
  );
}

function FloatingTextarea({ label, value, onValueChange }: FloatingFieldProps) {
  return (
    <label className="group relative block w-full">
      <textarea
        className="peer min-h-28 w-full resize-y rounded-xl border border-divider/70 bg-content1/90 px-4 pb-3 pt-7 text-sm leading-6 text-foreground shadow-sm outline-none transition-colors placeholder:text-transparent focus:border-primary/40 focus:shadow-[0_0_0_4px_rgb(var(--heroui-colors-primary-500)/0.08)]"
        placeholder=" "
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
      />
      <span className="pointer-events-none absolute left-4 top-2 text-xs font-medium text-default-600 transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-default-500 peer-focus:top-2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-default-700">
        {label}
      </span>
    </label>
  );
}

export function TopicsDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/topics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          tags,
        }),
      });

      const payload = (await response.json()) as { error: string };

      if (!response.ok) {
        throw new Error("error" in payload ? payload.error : "Unable to create topic.");
      }

      setTitle("");
      setDescription("");
      setTags("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create topic.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="border border-primary/12 bg-content1 shadow-[0_18px_48px_rgb(var(--heroui-colors-primary-500)/0.08)]">
      <CardBody className="gap-4 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <Plus className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <Chip color="primary" variant="flat">
              Create topic
            </Chip>
            <p className="text-sm text-default-600">
              Add a new topic with optional tags.
            </p>
          </div>
        </div>

        <form className="grid gap-3" onSubmit={handleSubmit}>
          <FloatingInput
            isRequired
            label="Title"
            value={title}
            onValueChange={setTitle}
          />
          <FloatingTextarea
            label="Description"
            value={description}
            onValueChange={setDescription}
          />
          <FloatingInput
            label="Tags"
            value={tags}
            onValueChange={setTags}
          />

          {error ? <p className="text-sm text-danger-500">{error}</p> : null}

          <Button
            color="primary"
            isLoading={isSubmitting}
            startContent={<Sparkles size={16} />}
            type="submit"
          >
            Create topic
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
