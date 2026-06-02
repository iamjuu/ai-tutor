import { Loader } from "lucide-react"

const Loading = () => {
    return (
        <main className="items-center justify-center min-h-[60vh]">
            <div className="flex items-center gap-3 text-black animate-spin font-semibold">
                <span><Loader /></span>
            </div>
        </main>
    )
}

export default Loading
