import Image from "next/image";
import Link from "next/link";
import LearnImage from "../public/images/subject/leanwith ai.png"
import { PlusIcon } from "lucide-react";
const Cta = () => {
    return (
        <section className="cta-section">
            <div className="cta-badge">Start learning your way.</div>
            <h2 className="text-3xl  text-black font-bold">
                Build and Personalize Learning Companion
            </h2>
            <p className="text-black">Pick a name, subject, voice, & personality — and start learning through voice conversations that feel natural and fun.</p>
            <Image src={LearnImage} alt="cta" width={362} height={232} />
            <button className="text-black items-center py-1 px-5 bg-gray-300  rounded-full flex border ">
            <PlusIcon size={16}/>

                <Link href="/companions/new">
                    <p>Build a New Companion</p>
                </Link>
            </button>
        </section>
    )
}
export default Cta
