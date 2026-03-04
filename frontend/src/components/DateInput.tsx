import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateInputProps {
    value: string; // YYYY-MM-DD format
    onChange: (value: string) => void;
    label?: string;
    required?: boolean;
    className?: string;
    placeholder?: string;
}

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function parseDate(value: string): Date | null {
    if (!value || !value.match(/^\d{4}-\d{2}-\d{2}$/)) return null;
    const d = new Date(value + 'T00:00:00');
    return isNaN(d.getTime()) ? null : d;
}

function formatDisplay(value: string): string {
    const d = parseDate(value);
    if (!d) return '';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function toYMD(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

const DateInput: React.FC<DateInputProps> = ({ value, onChange, label, required, className, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

    const today = new Date();
    const parsed = parseDate(value);
    const [viewYear, setViewYear] = useState(parsed ? parsed.getFullYear() : today.getFullYear());
    const [viewMonth, setViewMonth] = useState(parsed ? parsed.getMonth() : today.getMonth());

    const triggerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Sync view when value changes externally
    useEffect(() => {
        const d = parseDate(value);
        if (d) { setViewYear(d.getFullYear()); setViewMonth(d.getMonth()); }
    }, [value]);

    const openDropdown = useCallback(() => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const dropH = 320;
            const spaceBelow = window.innerHeight - rect.bottom;
            const top = spaceBelow >= dropH ? rect.bottom + 6 : rect.top - dropH - 6;
            setDropdownPos({ top, left: rect.left, width: Math.max(rect.width, 280) });
        }
        setIsOpen(v => !v);
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        function handler(e: MouseEvent) {
            if (
                triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
                dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen]);

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    const handleDayClick = (day: number) => {
        const selected = new Date(viewYear, viewMonth, day);
        onChange(toYMD(selected));
        setIsOpen(false);
    };

    // Build calendar grid
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: (number | null)[] = [
        ...Array(firstDay).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
    // Pad to full rows
    while (cells.length % 7 !== 0) cells.push(null);

    const selectedDate = parseDate(value);
    const isSelected = (day: number) =>
        selectedDate &&
        selectedDate.getFullYear() === viewYear &&
        selectedDate.getMonth() === viewMonth &&
        selectedDate.getDate() === day;
    const isToday = (day: number) =>
        today.getFullYear() === viewYear &&
        today.getMonth() === viewMonth &&
        today.getDate() === day;

    const displayValue = formatDisplay(value);

    return (
        <div className={`relative ${className ?? ''}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label}{required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
            )}

            {/* Trigger */}
            <div
                ref={triggerRef}
                onClick={openDropdown}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && openDropdown()}
                className={`flex items-center justify-between w-full px-3 py-2 border rounded-md text-sm cursor-pointer select-none transition-colors shadow-sm
                    ${isOpen
                        ? 'border-primary-600 ring-2 ring-primary-500/20 bg-white dark:bg-dark-bg'
                        : 'border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg hover:border-primary-600'
                    } text-gray-900 dark:text-gray-200`}
            >
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className={`font-medium ${!displayValue ? 'text-gray-400 dark:text-gray-500' : ''}`}>
                        {displayValue || (placeholder ?? 'Select date')}
                    </span>
                </div>
                <ChevronDown
                    className="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-150"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
            </div>

            {/* Calendar Dropdown — fixed to escape Modal overflow */}
            {isOpen && (
                <div
                    ref={dropdownRef}
                    style={{
                        position: 'fixed',
                        top: dropdownPos.top,
                        left: dropdownPos.left,
                        width: dropdownPos.width,
                        zIndex: 9999,
                    }}
                    className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-2xl overflow-hidden"
                >
                    {/* Month/Year navigation */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-bg">
                        <button
                            type="button"
                            onClick={prevMonth}
                            className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-border transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                            {MONTHS[viewMonth]} {viewYear}
                        </span>
                        <button
                            type="button"
                            onClick={nextMonth}
                            className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-border transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Day-of-week headers */}
                    <div className="grid grid-cols-7 px-2 pt-2">
                        {DAYS_OF_WEEK.map(d => (
                            <div key={d} className="text-center text-[10px] font-bold text-gray-400 uppercase py-1">
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Calendar cells */}
                    <div className="grid grid-cols-7 gap-0 px-2 pb-3">
                        {cells.map((day, idx) => (
                            <div key={idx} className="flex items-center justify-center p-0.5">
                                {day === null ? (
                                    <div className="w-8 h-8" />
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => handleDayClick(day)}
                                        className={`w-8 h-8 text-sm rounded-full flex items-center justify-center font-medium transition-all
                                            ${isSelected(day)
                                                ? 'bg-primary-600 text-white font-bold shadow-sm'
                                                : isToday(day)
                                                    ? 'border-2 border-primary-500 text-primary-600 dark:text-primary-400'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400'
                                            }`}
                                    >
                                        {day}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    {displayValue && (
                        <div className="px-4 py-2.5 border-t border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-bg flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                Selected: <span className="text-primary-600 dark:text-primary-400 font-bold">{displayValue}</span>
                            </span>
                            <button
                                type="button"
                                onClick={() => { onChange(''); }}
                                className="text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            >
                                Clear
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DateInput;
