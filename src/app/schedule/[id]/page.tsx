import { Suspense } from "react";
import { ScheduleDetail } from "./schedule-detail";

export default function Page({ params }: PageProps<"/schedule/[id]">) {
  return (
    <Suspense fallback={<p className="text-sm text-muted">일정을 불러오는 중입니다.</p>}>
      <ScheduleGate params={params} />
    </Suspense>
  );
}

async function ScheduleGate({ params }: Pick<PageProps<"/schedule/[id]">, "params">) {
  const { id } = await params;
  return <ScheduleDetail id={id} />;
}
