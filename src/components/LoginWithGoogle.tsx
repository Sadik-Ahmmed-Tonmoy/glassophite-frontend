"use client";

import React, { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const LoginWithGoogle = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    toast.loading("Connecting to Google authentication...", { id: "google-login" });
    try {
      await signIn("google");
    } catch {
      toast.error("Failed to connect to Google", { id: "google-login" });
      setIsLoading(false);
    }
  };

  return (
    <div>
      {session ? (
        <div>
          <p>Name: {session?.user?.name}</p>
          <p>Email: {session?.user?.email}</p>
          <p>Image:</p>{" "}
          <Image
            src={
              session?.user?.image ||
              "https://static1.srcdn.com/wordpress/wp-content/uploads/2024/10/untitled-design-2024-10-01t123706-515-1.jpg"
            }
            alt="image"
            height={200}
            width={200}
          />
        </div>
      ) : (
        <button
          disabled={isLoading}
          onClick={handleGoogleLogin}
          className="relative w-full bg-blue-primary text-white py-2 px-4 rounded-md hover:bg-[#4285F4]/90 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute top-[3px] left-[3px] bg-white rounded-sm p-1">
            {isLoading ? <Loader2 size={24} className="animate-spin text-[#4285F4]" /> : <FcGoogle size={24} />}
          </div>
          {isLoading ? "Connecting..." : "Sign up with Google"}
        </button>
      )}

      <div>
        {session && <button onClick={() => signOut()}>Logout</button>}
        {!session && <p>You are not logged in</p>}
      </div>
    </div>
  );
};

export default LoginWithGoogle;
