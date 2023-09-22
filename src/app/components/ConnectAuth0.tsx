import { Icons } from "@/app/lib/ui/components";
import { ExitIcon, PersonIcon } from "@radix-ui/react-icons";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

interface ConnectAuth0Props {
  session: Session | null;
  status: "authenticated" | "loading" | "unauthenticated";
}

function ConnectAuth0({ session, status }: ConnectAuth0Props): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [status]);

  if (session) {
    return (
      <button
        className="flex items-center justify-center gap-x-2.5 p-3 font-semibol text-gray-900 hover:bg-gray-100"
        onClick={() => signOut()}
      >
        <ExitIcon width={16} height={16} /> {session.user?.email}
      </button>
    );
  } else {
    return (
      <button
        disabled={isLoading}
        className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100 disabled:bg-white"
        onClick={() => signIn("auth0", { callbackUrl: "/login" })}
      >
        {isLoading ? (
          <Icons.spinner className="h-4 w-4 animate-spin" />
        ) : (
          <PersonIcon />
        )}
        {"Login"}
      </button>
    );
  }
}

export default ConnectAuth0;
