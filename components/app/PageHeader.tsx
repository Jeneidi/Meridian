import Link from "next/link";
import { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  backHref?: string;
  middleContent?: ReactNode;
  rightContent?: ReactNode;
}

export function PageHeader({ title, backHref, middleContent, rightContent }: PageHeaderProps) {
  return (
    <header className="border-b border-zinc-800 bg-[#09090b] sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {backHref && (
            <Link
              href={backHref}
              className="text-zinc-400 hover:text-white transition inline-flex items-center"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
          )}
          <h1 className="text-lg font-semibold text-white">{title}</h1>
        </div>
        {middleContent && <div>{middleContent}</div>}
        {rightContent && <div>{rightContent}</div>}
      </div>
    </header>
  );
}
