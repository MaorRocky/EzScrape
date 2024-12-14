import React, { Suspense } from "react";
import { LockKeyholeIcon, ShieldIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { GetCredentialsForUser } from "@/actions/credentials/getCredentialsForUser";
import { Card } from "@/components/ui/card";
import CreateCredentialDialog from "@/app/(dashboard)/credentials/_components/CreateCredentialDialog";
import { formatDistanceToNow } from "date-fns";
import DeleteCredentialDialog from "@/app/(dashboard)/credentials/_components/DeleteCredentialDialog";

function CredentialsPage() {
  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between">
        <div className="flex flex-col ">
          <h1 className="text-3xl font-bold">Credentials</h1>
          <p>Manage your credentials</p>
        </div>
        <CreateCredentialDialog />
      </div>
      <div className="h-full py-6 space-y-8">
        <Alert>
          <ShieldIcon className="h-4 w-4 stroke-primary" />
          <AlertTitle className="text-primary">Encryption</AlertTitle>
          <AlertDescription>Your credentials are encrypted and stored securely.</AlertDescription>
        </Alert>
        <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
          <UserCredentials />
        </Suspense>
      </div>
    </div>
  );
}

export default CredentialsPage;

async function UserCredentials() {
  const credentials = await GetCredentialsForUser();
  if (!credentials) {
    return <div>Something went wrong</div>;
  }

  if (credentials.length === 0) {
    return (
      <Card className="w-full p-4">
        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
            <ShieldIcon size="40" className="stroke-primary"></ShieldIcon>
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="text-bold">No credentials created yet</p>
            <p className="text-sm text-muted-foreground">
              Click the button below to create your first credential
            </p>
          </div>
          <CreateCredentialDialog triggerText="Create your first credential" />
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {credentials.map(function (credential) {
        const createdAt = formatDistanceToNow(credential.createdAt, { addSuffix: true });
        return (
          <Card className="w-full flex p-4 justify-between" key={credential.name}>
            <div className="flex gap-2 items-center">
              <div className="rounded-full bg-primary/10 w-8 h-8 flex items-center justify-center">
                <LockKeyholeIcon size="18" className="stroke-primary" />
              </div>
              <div>
                <p className="font-bold">{credential.name}</p>
                <p className="text-xs text-muted-foreground">{createdAt}</p>
              </div>
            </div>
            <DeleteCredentialDialog name={credential.name} />
          </Card>
        );
      })}
    </div>
  );
}
