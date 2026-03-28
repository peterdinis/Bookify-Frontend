"use client";

import type { ProcessServerConfigFunction } from "filepond";
import { useRouter } from "next/navigation";
import type { TransitionStartFunction } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FilePond } from "react-filepond";
import { toast } from "sonner";
import { uploadAudiobookAction } from "@/app/actions/audiobooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createOptimisticAudiobook } from "@/lib/optimistic-audiobook";
import type { Audiobook } from "@/lib/types";
import { cn } from "@/lib/utils";

import "filepond/dist/filepond.min.css";

type FieldErrors = Record<string, string[] | undefined>;

type UploadProps = {
  className?: string;
  startUploadTransition?: TransitionStartFunction;
  addOptimisticBook?: (book: Audiobook) => void;
};

export function AudiobookUpload({
  className,
  startUploadTransition,
  addOptimisticBook,
}: UploadProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pondKey, setPondKey] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const metaRef = useRef({ title, author });
  useEffect(() => {
    metaRef.current = { title, author };
  }, [title, author]);

  const process = useCallback<ProcessServerConfigFunction>(
    (
      _fieldName,
      file,
      _metadata,
      load,
      error,
      progress,
      abort,
      transfer,
      options,
    ) => {
      void abort;
      void transfer;
      void options;
      const runUpload = async () => {
        const { title: t, author: a } = metaRef.current;
        setFormError(null);
        setFieldErrors({});

        if (!t.trim() || !a.trim()) {
          error("Add title and author before uploading.");
          return;
        }

        const optimistic = createOptimisticAudiobook({
          title: t.trim(),
          author: a.trim(),
          originalFileName: file.name,
          sizeBytes: file.size,
        });
        addOptimisticBook?.(optimistic);

        const steps = 8;
        for (let i = 1; i <= steps; i++) {
          progress(true, i, steps);
          await new Promise((r) => setTimeout(r, 120));
        }

        const mime =
          file.type ||
          (file.name.toLowerCase().endsWith(".m4b")
            ? "audio/mp4"
            : "application/octet-stream");

        const result = await uploadAudiobookAction({
          title: t.trim(),
          author: a.trim(),
          originalFileName: file.name,
          sizeBytes: file.size,
          mimeType: mime,
        });

        if (result?.serverError) {
          error(result.serverError);
          return;
        }

        if (result?.validationErrors) {
          const ve = result.validationErrors as Record<string, unknown>;
          const flat: FieldErrors = {};
          for (const [key, val] of Object.entries(ve)) {
            if (
              val &&
              typeof val === "object" &&
              "_errors" in val &&
              Array.isArray((val as { _errors: string[] })._errors)
            ) {
              flat[key] = (val as { _errors: string[] })._errors;
            }
          }
          setFieldErrors(flat);
          const globalMsg =
            (ve as { _errors?: string[] })._errors?.[0] ??
            Object.values(flat).flat()[0];
          error(globalMsg ?? "Validation failed");
          return;
        }

        load(result?.data?.id ?? "ok");
        router.refresh();
      };

      if (startUploadTransition) {
        startUploadTransition(runUpload);
      } else {
        void runUpload();
      }
    },
    [router, startUploadTransition, addOptimisticBook],
  );

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Upload</CardTitle>
        <CardDescription>
          Drop an audio file (mock pipeline: metadata is validated on the server
          with next-safe-action; binary is not stored yet).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ab-title">Title</Label>
            <Input
              id="ab-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="The name of the audiobook"
              aria-invalid={Boolean(fieldErrors.title)}
            />
            {fieldErrors.title?.[0] ? (
              <p className="text-xs text-destructive">{fieldErrors.title[0]}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ab-author">Author</Label>
            <Input
              id="ab-author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author or primary voice"
              aria-invalid={Boolean(fieldErrors.author)}
            />
            {fieldErrors.author?.[0] ? (
              <p className="text-xs text-destructive">
                {fieldErrors.author[0]}
              </p>
            ) : null}
          </div>
        </div>

        {formError ? (
          <p className="text-sm text-destructive" role="alert">
            {formError}
          </p>
        ) : null}

        <div className="filepond-bookify">
          <FilePond
            key={pondKey}
            name="audiobook"
            allowMultiple={false}
            maxFiles={1}
            acceptedFileTypes={[
              "audio/mpeg",
              "audio/mp4",
              "audio/x-m4a",
              "audio/wav",
              "audio/aac",
              "audio/ogg",
              "audio/flac",
              "application/octet-stream",
            ]}
            labelIdle='Drag & drop your audiobook or <span class="filepond--label-action">Browse</span>'
            server={{ process }}
            credits={false}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setPondKey((k) => k + 1);
              setFormError(null);
              setFieldErrors({});
            }}
          >
            Clear queue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
