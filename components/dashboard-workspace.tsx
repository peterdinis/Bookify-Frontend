"use client";

import type { TransitionStartFunction } from "react";
import { Headphones, Upload } from "lucide-react";
import { AudiobookLibrary } from "@/components/audiobook-library";
import { AudiobookUpload } from "@/components/audiobook-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Audiobook } from "@/lib/types";

type Props = {
  books: Audiobook[];
  startUploadTransition: TransitionStartFunction;
  addOptimisticBook: (book: Audiobook) => void;
};

export function DashboardWorkspace({
  books,
  startUploadTransition,
  addOptimisticBook,
}: Props) {
  return (
    <Tabs defaultValue="listen" className="flex flex-1 flex-col gap-6">
      <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-xl bg-muted/60 p-1.5 sm:inline-flex sm:w-auto sm:min-w-[320px]">
        <TabsTrigger
          value="listen"
          className="gap-2 rounded-lg py-2.5 data-[state=active]:shadow-sm sm:px-6"
        >
          <Headphones className="size-4 shrink-0 opacity-70" aria-hidden />
          Listen
        </TabsTrigger>
        <TabsTrigger
          value="upload"
          className="gap-2 rounded-lg py-2.5 data-[state=active]:shadow-sm sm:px-6"
        >
          <Upload className="size-4 shrink-0 opacity-70" aria-hidden />
          Upload
        </TabsTrigger>
      </TabsList>
      <TabsContent value="listen" className="mt-0 flex-1 focus-visible:outline-none">
        <AudiobookLibrary books={books} />
      </TabsContent>
      <TabsContent value="upload" className="mt-0 flex-1 focus-visible:outline-none">
        <div className="mx-auto max-w-2xl">
          <AudiobookUpload
            startUploadTransition={startUploadTransition}
            addOptimisticBook={addOptimisticBook}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
