export interface IContainerProps {
  children?: React.ReactNode;
}

export function Container({ children }: IContainerProps) {
  return (
    <div className="w-full px-6 2xl:w-[1280px] 2xl:px-0 2xl:mx-auto">
      {children}
    </div>
  );
}
