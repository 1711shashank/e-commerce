"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, Plus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ProductImageFieldProps {
  images: string[];
  activeIndex: number;
  name: string;
  newImageUrl: string;
  uploading: boolean;
  error?: string;
  colorLabel?: string;
  onActiveChange: (index: number) => void;
  onNewUrlChange: (value: string) => void;
  onAddUrl: () => void;
  onRemove: (index: number) => void;
  onMove: (index: number, dir: -1 | 1) => void;
  onUploadFiles: (files: File[]) => void;
}

export function ProductImageField({
  images,
  activeIndex,
  name,
  newImageUrl,
  uploading,
  error,
  colorLabel,
  onActiveChange,
  onNewUrlChange,
  onAddUrl,
  onRemove,
  onMove,
  onUploadFiles,
}: ProductImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const safeActive = images.length
    ? Math.min(activeIndex, images.length - 1)
    : 0;

  const pickFiles = () => inputRef.current?.click();

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList?.length) return;
    onUploadFiles(Array.from(fileList));
  };

  return (
    <div className="space-y-3">
      {colorLabel && (
        <p className="text-xs uppercase tracking-[0.15em] text-muted">
          {colorLabel} — {images.length} image{images.length === 1 ? "" : "s"}
        </p>
      )}
      <div className="flex flex-col gap-3 lg:flex-row-reverse lg:gap-4">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-border/30 lg:flex-1">
          {images[safeActive] ? (
            <Image
              src={images[safeActive]}
              alt={name || "Product image"}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-sm text-muted">
              <p>No images yet</p>
              <p className="text-xs">Upload or paste a URL below</p>
            </div>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 lg:w-20 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0">
          {images.map((src, i) => (
            <div key={`${src}-${i}`} className="relative shrink-0">
              <button
                type="button"
                onClick={() => onActiveChange(i)}
                className={cn(
                  "relative h-20 w-16 overflow-hidden border-2 lg:h-24 lg:w-full",
                  safeActive === i ? "border-foreground" : "border-transparent",
                )}
                aria-label={`View image ${i + 1}`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                  unoptimized
                />
              </button>
              <div className="absolute -right-1 -top-1">
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  className="flex h-5 w-5 items-center justify-center bg-foreground text-background"
                  aria-label="Remove image"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <div className="mt-1 flex justify-center gap-0.5 lg:flex-col">
                <button
                  type="button"
                  onClick={() => onMove(i, -1)}
                  disabled={i === 0}
                  className="flex h-6 w-6 items-center justify-center border border-border disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ChevronUp className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => onMove(i, 1)}
                  disabled={i === images.length - 1}
                  className="flex h-6 w-6 items-center justify-center border border-border disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-2 border border-dashed px-4 py-8 text-center transition-colors",
          dragOver
            ? "border-accent bg-accent/5"
            : "border-border bg-surface/40",
          uploading && "pointer-events-none opacity-60",
        )}
      >
        <Upload className="h-5 w-5 text-muted" />
        <p className="text-sm text-muted">
          Drag images here, or{" "}
          <button
            type="button"
            onClick={pickFiles}
            className="text-foreground underline underline-offset-2 hover:text-accent"
          >
            choose from your device
          </button>
        </p>
        <p className="text-xs text-muted">JPEG, PNG, WebP, GIF · max 8 MB</p>
        {uploading && (
          <p className="text-xs text-accent">Uploading…</p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <div className="flex gap-2">
        <input
          value={newImageUrl}
          onChange={(e) => onNewUrlChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAddUrl();
            }
          }}
          className="min-h-11 flex-1 border border-border bg-background px-3 text-sm outline-none focus:border-accent"
          placeholder="Or paste image URL…"
        />
        <Button type="button" variant="outline" onClick={onAddUrl}>
          <Plus className="h-4 w-4" />
          Add URL
        </Button>
      </div>
      {error && <p className="text-xs text-sale">{error}</p>}
    </div>
  );
}
