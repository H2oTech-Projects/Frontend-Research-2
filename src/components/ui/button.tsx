import { cn } from "../../utils/cn";
interface ButtonProps {
  text: any;
  onclick?: () => void;
  type?: "submit" | "button";
  className: string;
  disabled?: boolean;
  form?: string;
}

interface PageButtonProps {
  children: React.ReactNode;
  className: string;
  onClick: () => void;
  disabled?: boolean;
}

interface IconButtonProps {
  text?: string | React.ReactNode;
  className: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: string;
}

const PrimaryButton = ({
  text,
  onclick,
  type,
  className,
  disabled,
  form,
}: ButtonProps) => {
  return (
    <button
      onClick={onclick}
      type={type}
      disabled={disabled}
      className={cn(
        "bg-primary-600 hover:bg-primary-700 rounded-lg bg-primary-btn-blue px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-unum-500 disabled:opacity-50",
        className
      )}
      form={form}
    >
      {text}
    </button>
  );
};

const SecondaryButton = ({
  text,
  onclick,
  type,
  className,
  disabled,
}: ButtonProps) => {
  return (
    <button
      onClick={onclick}
      type={type}
      disabled={disabled}
      className={cn(
        "rounded-lg border border-primary-btn-blue bg-white px-5 py-2.5 text-center text-sm text-primary-btn-blue disabled:cursor-not-allowed disabled:border-neutral-unum-500 disabled:text-neutral-unum-500",
        className
      )}
    >
      {text}
    </button>
  );
};

const PageButton = ({ children, className, ...rest }: PageButtonProps) => {
  return (
    <button
      type="button"
      className={cn(
        "relative inline-flex items-center bg-white text-sm font-medium hover:bg-gray-50",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

const IconButton = ({
  text,
  className,
  icon,
  iconPosition = "before",
  ...rest
}: IconButtonProps) => {
  return (
    <button
      type="button"
      className={cn(
        "flex items-center disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...rest}
    >
      {icon && iconPosition === "before" && (
        <span className="inset-y-0 left-0 float-left flex items-center pl-3">
          {icon}
        </span>
      )}
      {text && <span className={typeof text === "string" ? "pr-4" : undefined}>{text}</span>}
      {icon && iconPosition === "after" && (
        <span className="flex items-center pl-2">{icon}</span>
      )}
    </button>
  );
};

export { PrimaryButton, SecondaryButton, PageButton, IconButton };
