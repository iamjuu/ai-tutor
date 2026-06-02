import {getCompanion} from "@/lib/actions/companion.actions";
import {currentUser} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import { CompanionSessionClient } from "@/components/CompanionSessionClient";

interface CompanionSessionPageProps {
    params: Promise<{ id: string}>;
}

const CompanionSession = async ({ params }: CompanionSessionPageProps) => {
    const { id } = await params;
    const user = await currentUser();

    if(!user) redirect('/sign-in');
    
    const companion = await getCompanion(id);
    const name = companion?.name;

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
