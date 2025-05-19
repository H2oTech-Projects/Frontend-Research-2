import { useRef, useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Control, useWatch } from "react-hook-form";

interface FormFileReaderProps {
  control: Control<any>;
  name: string;
  label: string;
  accept?: string;
  placeholder: string;
  multiple?: boolean;
}

export function FormFileReader({
  control,
  name,
  label,
  accept = "*/*",
  placeholder,
  multiple = false,
}: FormFileReaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const watchedFiles = useWatch({
    control: control,
    name: name,
  });

  // Normalize watchedFiles into a consistent array
  const normalizedFiles: File[] = (() => {
    if (!watchedFiles) return [];
    if (watchedFiles instanceof FileList) return Array.from(watchedFiles);
    if (Array.isArray(watchedFiles)) return watchedFiles; // already an array
    return [watchedFiles]; // single file
  })();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex flex-col  w-full">
              <input
                type="file"
                multiple={multiple}
                accept={accept}
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    field.onChange(e.target.files);
                  }
                }}
                className="hidden"
              />
              <Button
                className="w-full"
                variant="outline"
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                {placeholder}
              </Button>
              {/* Display selected file names */}
              {normalizedFiles.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold">Selected Files:</h3>
                  <ul className="list-disc ml-6">
                    {normalizedFiles.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
