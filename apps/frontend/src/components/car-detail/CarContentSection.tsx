import { ReactNode } from "react"

interface CarContentSectionProps {
    title: string
    children: ReactNode
    className?: string
}

export function CarContentSection({ title, children, className }: CarContentSectionProps) {
    return (
        <div className={`py-8 border-b border-gray-100 ${className}`}>
            <h3 className="text-xl font-bold text-gray-900 mb-6">{title}</h3>
            {children}
        </div>
    )
}
