
type WrapperProps = {
  className?: string;
  children: React.ReactNode;
};

export const PageWrapper: React.FC<WrapperProps> = ({ children, className }) => {
  return (
    <div className={`flex h-full flex-col gap-1 px-4 pt-2 ${className || ""}`}>
      {children}
    </div>
  );
};
export const PageContainer: React.FC<WrapperProps> = ({ children, className }) => {
  return (
    <div className={` flex flex-grow flex-col gap-3 ${className || ""}`}>
      {children}
    </div>
  );
};

export const PageContainerHeader: React.FC<WrapperProps> = ({ children, className }) => {
  return (
    <div className={` flex justify-between ${className || ""}`}>
      {children}
    </div>
  );
};

export const PageTableWrapper: React.FC<WrapperProps> = ({ children, className }) => {
  return (
    <div className={` flex w-full ${className || ""}`}>
      <div className="w-full h-[calc(100dvh-160px)]">
        {children}
      </div>
    </div>
  );
};



