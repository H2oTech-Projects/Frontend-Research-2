import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";


export const ControlledInput = ({ control, name, label, rules, type = "text", placeholder, className }: any) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label htmlFor={name}>{label}</Label>}
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState: { error } }) => (
          <div className="space-y-1">
            <Input
              id={name}
              type={type}
              placeholder={placeholder}
              ref={inputRef}
              defaultValue={field.value} // Uncontrolled behavior
              onChange={(e) => {
                if (inputRef.current) {
                  const value = type === "number" ? String(Number(e.target.value) || "") : e.target.value;
                  inputRef.current.value = value; // Ensure it's always a string
                  field.onChange(type === "number" ? Number(value) : value);
                }
              }}
            />
            {error && <p className="text-sm text-red-500">{error.message}</p>}
          </div>
        )}
      />
    </div>
  );
};



const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z
    .number()
    .min(18, "You must be at least 18 years old")
    .max(100, "Age must be below 100"),
  email: z.string().email("Invalid email format"),
});

function SimpleForm() {

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", age: "", email: "" },
  });

  const onSubmit = (data:any) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <ControlledInput
        control={control}
        name="name"
        label="Name"
        placeholder="Enter your name"
      />

      <ControlledInput
        control={control}
        name="age"
        label="Age"
        type="number"
        placeholder="Enter your age"
      />

      <ControlledInput
        control={control}
        name="email"
        label="Email"
        type="email"
        placeholder="Enter your email"
      />

      <Button type="submit">Submit</Button>
    </form>
  );
}

export default SimpleForm;
