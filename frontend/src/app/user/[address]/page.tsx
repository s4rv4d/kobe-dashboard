import { UserDetailContent } from "@/components/user/user-detail-content";

interface UserPageProps {
  params: Promise<{ address: string }>;
}

export default async function UserPage({ params }: UserPageProps) {
  const { address } = await params;
  return <UserDetailContent address={address} />;
}
