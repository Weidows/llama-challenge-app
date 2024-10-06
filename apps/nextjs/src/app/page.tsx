import { HydrateClient } from "~/trpc/server";
import ClientComponent from "./_components/ClientComponent";

export default function HomePage() {
  return (
    <HydrateClient>
      <ClientComponent />
    </HydrateClient>
  );
}
