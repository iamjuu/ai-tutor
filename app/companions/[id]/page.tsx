import {getCompanion} from "@/lib/actions/companion.actions";
import {currentUser} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import { CompanionSessionClient } from "@/components/CompanionSessionClient";

interface CompanionSessionPageProps {
    params: Promise<{ id: string}>;
}

const CompanionSession = async ({ params }: CompanionSessionPageProps) => {
    const { id } = await params;
    const companion = await getCompanion(id);
    const user = await currentUser();

    const { name } = companion;

    if(!user) redirect('/sign-in');
    if(!name) redirect('/companions')

    return (
        <CompanionSessionClient
            companion={companion}
            companionId={id}
            userName={user.firstName!}
            userImage={user.imageUrl!}
        />
    )
}

export default CompanionSession
