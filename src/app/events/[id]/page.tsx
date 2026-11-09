import { Suspense } from "react";
import { LadderDetail } from "./ladder-detail";

export default function Page({ params }: PageProps<"/events/[id]">) {
  return (
    <Suspense fallback={<p className="text-sm text-muted">추첨을 불러오는 중입니다.</p>}>
      <LadderGate params={params} />
    </Suspense>
  );
}

async function LadderGate({ params }: Pick<PageProps<"/events/[id]">, "params">) {
  const { id } = await params;
  return <LadderDetail id={id} />;
}
