import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/app/PageHeader";
import { AuditResultsContent } from "@/components/app/AuditResultsContent";

export default async function AuditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: repoId } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Get repo and verify ownership
  const repo = await prisma.repo.findUnique({
    where: { id: repoId },
  });

  if (!repo || repo.userId !== session.user.id) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#09090b]">
      <PageHeader title="Security Audit" backHref={`/repo/${repoId}`} />

      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Audit Results Component */}
        <AuditResultsContent repoId={repoId} />
      </main>
    </div>
  );
}
