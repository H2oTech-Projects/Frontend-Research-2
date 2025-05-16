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
import { Control } from "react-hook-form";

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
              {field.value && (
                <div className="mt-2">
                  <span className="font-medium">List of selected files:</span>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {Array.from(field.value instanceof FileList ? field.value : [field.value]).map(
                      (file: File, idx: number) => (
                        <li key={idx}>{file.name}</li>
                      )
                    )}
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
