import { ClusterStub, clusterMetadata } from "@/components/cost/cluster-stub";

const path = "/boston/nanny-cost/wages";

export const metadata = clusterMetadata(path);

export default function Page() {
  return <ClusterStub path={path} />;
}
