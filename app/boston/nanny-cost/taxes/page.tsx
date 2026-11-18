import { ClusterStub, clusterMetadata } from "@/components/cost/cluster-stub";

const path = "/boston/nanny-cost/taxes";

export const metadata = clusterMetadata(path);

export default function Page() {
  return <ClusterStub path={path} />;
}
