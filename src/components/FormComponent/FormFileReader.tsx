import { useState } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface FormFileReaderProps {
  control: Control<any>;
  name: string;
  label: string;
  accept?: string; // Optional: Specify accepted file types (e.g., ".zip,.shp")
}

export function FormFileReader({ control, name, label, accept = "*/*" }: FormFileReaderProps) {
  const [fileContent, setFileContent] = useState<string | ArrayBuffer | null>(null);

  // Handle file upload and read
  const handleFileRead = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      setFileContent(content!);
    };
    // Read as ArrayBuffer for binary files (e.g., shapefiles)
    reader.readAsArrayBuffer(file); // Use readAsText() for text files if needed
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex flex-col gap-2 items-center space-x-2">
              <Input
                type="file"
                accept={accept}
                onChange={(e) => {
                  handleFileRead(e);
                  field.onChange(e.target.files?.[0]); // Store the file object in RHF
                }}
                className="cursor-pointer"
                id={`${name}-file-input`}
              />
              {fileContent && (
                <span className="text-sm text-gray-500">
                  File selected: {field.value?.name || "Unknown"}
                </span>
              )}
            
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}