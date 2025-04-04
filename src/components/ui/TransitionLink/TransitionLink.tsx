import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";

interface TPropsType extends LinkProps {
  children: ReactNode;
  href: string;
}
const TransitionLink = ({ children, href, ...props }: TPropsType) => {
  const router = useRouter();

  const handleTransition = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();

// run some Animation,
// sleep for some time

    router.push(href);

    // run some enter animation
  };
  return (
    <Link onClick={handleTransition} href={href} {...props}>
      {children}
    </Link>
  );
};

export default TransitionLink;
