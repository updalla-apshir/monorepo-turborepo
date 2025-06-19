import { getProfile } from "@/lib/actions";

const ProfilePage = async () => {
  const user = await getProfile();
  return <div className="">{JSON.stringify(user)}</div>;
};

export default ProfilePage;
