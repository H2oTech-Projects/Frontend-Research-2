import * as React from "react";
import { cn } from "../../utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  onChangeIcon?: () => void;
  startIcon?: React.ReactNode;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      icon,
      onChangeIcon,
      startIcon,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const handleClickIcon = () => {
      if (onChangeIcon) {
        onChangeIcon();
      }
    };

    const inputClassName = cn(
      "border-[1px] mt-1 border-neutral-unum-500 text-neutral-unum-700 flex h-10 w-full rounded-lg bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed",
      className
    );

    return (
      <div className={cn("relative max-w-[490px]", containerClassName)}>
        {startIcon !== null && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 align-middle">
            {startIcon}
          </div>
        )}
        <input type={type} className={inputClassName} ref={ref} {...props} />
        {icon !== null && (
          <div
            className="pointer-events-auto absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
            onClick={handleClickIcon}
          >
            {icon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
