"use client";

import * as React from "react";
import { FileUp, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface XmlDropzoneProps {
  onSubmitText: (text: string) => void;
}

export function XmlDropzone({ onSubmitText }: XmlDropzoneProps) {
  const [value, setValue] = React.useState("");
  const [dragging, setDragging] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const readFiles = React.useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const texts = await Promise.all(
        Array.from(files).map((file) =>
          file.text().catch(() => {
            return "";
          }),
        ),
      );
      const joined = texts.filter(Boolean).join("\n");
      if (joined) onSubmitText(joined);
      if (fileRef.current) fileRef.current.value = "";
    },
    [onSubmitText],
  );

  function submitPasted() {
    if (!value.trim()) return;
    onSubmitText(value);
    setValue("");
  }

  return (
    <div className="grid gap-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "copy";
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void readFiles(e.dataTransfer.files);
        }}
        className={cn(
          "relative rounded-lg border border-dashed transition-colors",
          dragging ? "border-primary bg-primary/5" : "border-input",
        )}
      >
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={submitPasted}
          placeholder="Incolla qui l'XML della fattura elettronica. Puoi incollarne più di uno di seguito."
          className="min-h-40 resize-y border-0 bg-transparent font-mono text-xs shadow-none focus-visible:ring-0 dark:bg-transparent"
          spellCheck={false}
        />
        {dragging && (
          <div className="bg-background/70 pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg text-sm font-medium backdrop-blur-sm">
            <FileUp className="mr-2 size-4" />
            Rilascia i file XML
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={submitPasted} disabled={!value.trim()} size="sm">
          Analizza XML incollato
        </Button>
        <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
          <Upload className="size-4" />
          Carica file
        </Button>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept=".xml,.p7m"
          className="hidden"
          onChange={(e) => void readFiles(e.target.files)}
        />
        <p className="text-muted-foreground text-xs">
          Incolla, trascina i file oppure usa “Carica file”. Nulla esce dal browser.
        </p>
      </div>
    </div>
  );
}
