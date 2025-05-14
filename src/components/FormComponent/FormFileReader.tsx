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
}

export function FormFileReader({
  control,
  name,
  label,
  accept = "*/*",
  placeholder,
}: FormFileReaderProps) {
  const [fileContent, setFileContent] = useState<string | ArrayBuffer | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileRead = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      setFileContent(content!);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex items-center space-x-2">
              {/* Display selected file name */}
              <Input
                value={field.value?.name || ""}
                readOnly
                placeholder={placeholder}
                className="cursor-default"
              />
              {/* Hidden input */}
              <input
                type="file"
                accept={accept}
                ref={fileInputRef}
                onChange={(e) => {
                  handleFileRead(e);
                  field.onChange(e.target.files?.[0] || null);
                }}
                className="hidden"
              />
              {/* Trigger button */}
              <Button
                variant="outline"
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose File
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
