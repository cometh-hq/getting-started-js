import { cx } from "class-variance-authority";

interface AlertProps {
  state: "error" | "success" | "information";
  content: string;
  link?: {
    content: string;
    url: string;
  };
}

function Alert({ state, content, link }: AlertProps) {
  return (
    <div className="relative mx-8 mb-8 rounded-md isolate flex items-center justify-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5">
      <div
        className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
        aria-hidden="true"
      >
        <div
          className={cx(
            "aspect-[577/310] w-[36.0625rem] bg-gradient-to-r opacity-30",
            state === "success"
              ? "from-[#8fff80] to-[#33bb96]"
              : state === "error"
              ? "from-[#e77878] to-[#9e2b12]"
              : "from-[#78e0e7] to-[#12669e]"
          )}
        ></div>
      </div>
      <div className="flex flex-col justify-center items-center gap-x-4 gap-y-2">
        <p className="text-sm leading-6 text-gray-900">{content}</p>
        {link && (
          <a
            href={link.url}
            target="_blank"
            className="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          >
            {link.content} <span aria-hidden="true">&rarr;</span>
          </a>
        )}
      </div>
    </div>
  );
}
export default Alert;
