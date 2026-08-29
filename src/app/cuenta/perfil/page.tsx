import { ChangePasswordForm } from "@/components/cuenta/ChangePasswordForm";
import { ProfileForm } from "@/components/cuenta/ProfileForm";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const { user, customer } = await getSession();

  return (
    <div className="space-y-6">
      <h2 className="text-xl">Mi perfil</h2>
      <ProfileForm customer={customer} email={user?.email ?? ""} />
      <ChangePasswordForm />
    </div>
  );
}
