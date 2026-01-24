import { useState, useRef, useEffect, useMemo } from "react"
import { ChevronDown, Clock, ChevronLeft, ChevronRight, X, Calendar as CalendarIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { createPortal } from "react-dom"

interface RentalTimePickerProps {
    onChange?: (value: { startDate: string; endDate: string }) => void
    disabledDates?: { from: Date; to: Date }[]
    initialStart?: Date
    initialEnd?: Date
}

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
const MINUTES = ["00", "30"]

export default function RentalTimePicker({ onChange, disabledDates, initialStart, initialEnd }: RentalTimePickerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const pickerRef = useRef<HTMLDivElement>(null)

    // Default: Start tomorrow 7:00 AM, End tomorrow+1 7:00 PM
    const getDefaultStart = () => {
        const d = new Date()
        d.setDate(d.getDate() + 1)
        d.setHours(7, 0, 0, 0)
        return d
    }

    const getDefaultEnd = () => {
        const d = new Date()
        d.setDate(d.getDate() + 2)
        d.setHours(19, 0, 0, 0)
        return d
    }

    const [startDate, setStartDate] = useState(initialStart || getDefaultStart())
    const [endDate, setEndDate] = useState(initialEnd || getDefaultEnd())
    const [viewDate, setViewDate] = useState(new Date()) // Month being viewed in calendar
    const [pickingFor, setPickingFor] = useState<'start' | 'end'>('start')

    // Notify parent on change
    useEffect(() => {
        onChange?.({
            startDate: startDate.toISOString().slice(0, 16),
            endDate: endDate.toISOString().slice(0, 16)
        })
    }, [startDate, endDate, onChange])

    const formatDisplayDate = (d: Date) => {
        return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }

    const formatDisplayTime = (d: Date) => {
        return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })
    }

    // Calendar logic
    const daysInMonth = useMemo(() => {
        const year = viewDate.getFullYear()
        const month = viewDate.getMonth()
        const firstDay = new Date(year, month, 1).getDay()
        const totalDays = new Date(year, month + 1, 0).getDate()

        const days = []
        // Padding for previous month
        for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
            days.push(null)
        }
        // Current month days
        for (let i = 1; i <= totalDays; i++) {
            days.push(new Date(year, month, i))
        }
        return days
    }, [viewDate])

    const handleDateSelect = (date: Date) => {
        if (pickingFor === 'start') {
            const newStart = new Date(date)
            newStart.setHours(startDate.getHours(), startDate.getMinutes())
            setStartDate(newStart)
            // If start is after end, move end forward
            if (newStart >= endDate) {
                const newEnd = new Date(newStart)
                newEnd.setDate(newEnd.getDate() + 1)
                setEndDate(newEnd)
            }
            setPickingFor('end') // Auto switch to end
        } else {
            const newEnd = new Date(date)
            newEnd.setHours(endDate.getHours(), endDate.getMinutes())
            if (newEnd > startDate) {
                setEndDate(newEnd)
            }
        }
    }

    const handleTimeSelect = (hour: number, minute: number) => {
        if (pickingFor === 'start') {
            const newStart = new Date(startDate)
            newStart.setHours(hour, minute)
            setStartDate(newStart)
            if (newStart >= endDate) {
                const newEnd = new Date(newStart)
                newEnd.setHours(newEnd.getHours() + 1)
                setEndDate(newEnd)
            }
        } else {
            const newEnd = new Date(endDate)
            newEnd.setHours(hour, minute)
            if (newEnd > startDate) {
                setEndDate(newEnd)
            }
        }
    }

    const isInRange = (date: Date) => {
        const d = new Date(date)
        d.setHours(0, 0, 0, 0)
        const start = new Date(startDate)
        start.setHours(0, 0, 0, 0)
        const end = new Date(endDate)
        end.setHours(0, 0, 0, 0)
        return d > start && d < end
    }

    const isStart = (date: Date) => date.toDateString() === startDate.toDateString()
    const isEnd = (date: Date) => date.toDateString() === endDate.toDateString()

    const isToday = (date: Date) => {
        return date.toDateString() === new Date().toDateString()
    }

    const isPast = (date: Date) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return date < today
    }

    const isDisabled = (date: Date) => {
        if (isPast(date)) return true
        if (!disabledDates) return false
        return disabledDates.some(range => {
            const d = new Date(date)
            d.setHours(0, 0, 0, 0)
            const from = new Date(range.from)
            from.setHours(0, 0, 0, 0)
            const to = new Date(range.to)
            to.setHours(0, 0, 0, 0)
            return d >= from && d <= to
        })
    }

    const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
    const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))

    return (
        <div className="relative" ref={pickerRef}>
            {/* Trigger Button - Match LocationPicker Style */}
            <div
                className={cn(
                    "flex items-center bg-white border rounded-2xl p-0.5 transition-all hover:border-primary/50 cursor-pointer shadow-sm hover:shadow-md h-[52px]",
                    isOpen && "ring-2 ring-primary/20 border-primary"
                )}
                onClick={() => setIsOpen(true)}
            >
                <div className="flex-1 flex items-center px-5 gap-3 h-full overflow-hidden">
                    <CalendarIcon className="w-5 h-5 text-primary shrink-0" />
                    <div className="flex flex-col truncate">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-tight">Thời gian thuê</span>
                        <div className="flex items-center gap-2 font-bold text-[14px] truncate leading-tight mt-0.5">
                            <span>{formatDisplayTime(startDate)}, {formatDisplayDate(startDate)}</span>
                            <span className="text-muted-foreground font-medium">đến</span>
                            <span>{formatDisplayTime(endDate)}, {formatDisplayDate(endDate)}</span>
                        </div>
                    </div>
                </div>
                <div className="px-4 text-primary shrink-0 border-l h-full flex items-center">
                    <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isOpen && "rotate-180")} />
                </div>
            </div>

            {/* Modal - Centered with backdrop (Rendered via Portal) */}
            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 pointer-events-none">
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/60 backdrop-blur-[4px] pointer-events-auto"
                                onClick={() => setIsOpen(false)}
                            />

                            {/* Modal Content */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full max-w-[750px] bg-background border rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] p-6 md:p-10 pointer-events-auto max-h-[90vh] overflow-y-auto custom-scrollbar"
                            >
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-tight">Đang chọn thời gian</span>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <button
                                                className={cn(
                                                    "px-4 py-1.5 rounded-lg text-sm font-bold transition-all border-2",
                                                    pickingFor === 'start' ? "border-primary bg-primary/5 text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                                                )}
                                                onClick={() => setPickingFor('start')}
                                            >
                                                {formatDisplayTime(startDate)}, {formatDisplayDate(startDate)}
                                            </button>
                                            <span className="text-muted-foreground text-xs font-bold">đến</span>
                                            <button
                                                className={cn(
                                                    "px-4 py-1.5 rounded-lg text-sm font-bold transition-all border-2",
                                                    pickingFor === 'end' ? "border-primary bg-primary/5 text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                                                )}
                                                onClick={() => setPickingFor('end')}
                                            >
                                                {formatDisplayTime(endDate)}, {formatDisplayDate(endDate)}
                                            </button>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsOpen(false)} className="p-3 hover:bg-muted rounded-full transition-colors">
                                        <X className="w-6 h-6 text-muted-foreground" />
                                    </button>
                                </div>

                                <div className="flex flex-col lg:flex-row gap-12">
                                    {/* Calendar Section */}
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-8">
                                            <span className="font-black text-2xl tracking-tight capitalize">
                                                {viewDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
                                            </span>
                                            <div className="flex gap-2">
                                                <button onClick={prevMonth} className="p-2.5 hover:bg-muted rounded-xl transition-colors border border-border/50"><ChevronLeft className="w-5 h-5" /></button>
                                                <button onClick={nextMonth} className="p-2.5 hover:bg-muted rounded-xl transition-colors border border-border/50"><ChevronRight className="w-5 h-5" /></button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-7 gap-1 mb-4">
                                            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
                                                <div key={d} className="text-center text-[10px] font-black text-muted-foreground py-2 uppercase tracking-widest">{d}</div>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-7 gap-1">
                                            {daysInMonth.map((date, i) => (
                                                <div key={i} className="aspect-square flex items-center justify-center">
                                                    {date ? (
                                                        <button
                                                            disabled={isDisabled(date)}
                                                            onClick={() => handleDateSelect(date)}
                                                            className={cn(
                                                                "w-full h-full flex flex-col items-center justify-center text-sm transition-all relative",
                                                                isDisabled(date) && "opacity-20 cursor-not-allowed",
                                                                !isDisabled(date) && (isStart(date) || isEnd(date)) ? "bg-primary text-white font-black shadow-lg z-10" : "text-foreground font-medium",
                                                                !isDisabled(date) && isStart(date) && "rounded-l-2xl",
                                                                !isDisabled(date) && isEnd(date) && "rounded-r-2xl",
                                                                !isDisabled(date) && isStart(date) && !isEnd(date) && "rounded-r-none",
                                                                !isDisabled(date) && isEnd(date) && !isStart(date) && "rounded-l-none",
                                                                !isDisabled(date) && isInRange(date) && "bg-primary/20 text-primary rounded-none",
                                                                !isDisabled(date) && !isStart(date) && !isEnd(date) && !isInRange(date) && "hover:bg-primary/10 rounded-2xl",
                                                                isToday(date) && !isStart(date) && !isEnd(date) && !isInRange(date) && "border-2 border-primary/20 text-primary font-bold rounded-2xl"
                                                            )}
                                                        >
                                                            {date.getDate()}
                                                            {isToday(date) && !isStart(date) && !isEnd(date) && !isInRange(date) && <span className="absolute bottom-1.5 w-1 h-1 bg-primary rounded-full"></span>}
                                                        </button>
                                                    ) : <div className="w-full h-full" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Time Section */}
                                    <div className="w-full lg:w-[180px] lg:border-l lg:pl-12">
                                        <div className="flex items-center gap-2 mb-6 font-black text-muted-foreground text-xs uppercase tracking-widest">
                                            <Clock className="w-4 h-4" />
                                            <span>Chọn giờ</span>
                                        </div>
                                        <div className="h-[320px] overflow-y-auto pr-3 custom-scrollbar grid grid-cols-2 lg:grid-cols-1 gap-2.5">
                                            {HOURS.map(h => (
                                                MINUTES.map(m => {
                                                    const hour = parseInt(h)
                                                    const minute = parseInt(m)
                                                    const isActive = (pickingFor === 'start' ? startDate : endDate).getHours() === hour &&
                                                        (pickingFor === 'start' ? startDate : endDate).getMinutes() === minute

                                                    return (
                                                        <button
                                                            key={`${h}:${m}`}
                                                            onClick={() => handleTimeSelect(hour, minute)}
                                                            className={cn(
                                                                "py-3 px-4 rounded-xl text-sm font-bold transition-all text-center border-2",
                                                                isActive ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-transparent border-transparent hover:border-primary/20 text-muted-foreground hover:text-primary"
                                                            )}
                                                        >
                                                            {h}:{m}
                                                        </button>
                                                    )
                                                })
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Tổng thời gian</span>
                                            <span className="font-black text-2xl text-primary mt-1">
                                                {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} ngày
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        className="w-full md:w-auto bg-primary text-white px-12 py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Xác nhận thời gian
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: hsl(var(--muted-foreground) / 0.15);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: hsl(var(--primary) / 0.4);
                }
            `}} />
        </div>
    )
}
