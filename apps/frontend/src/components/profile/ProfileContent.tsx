import { AccountInfo } from "./AccountInfo"

export function ProfileContent() {
    return (
        <div className="flex-1 min-w-0">
            {/* Currently only showing AccountInfo as per the main mock view */}
            {/* In a real app, this would switch based on the route or tab state */}
            <AccountInfo />
        </div>
    )
}
