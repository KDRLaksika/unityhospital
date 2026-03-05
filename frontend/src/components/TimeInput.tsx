import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Clock, ChevronDown, Check } from 'lucide-react';

interface TimeInputProps {
    value: string; // HH:mm (24h) format stored in state
    onChange: (value: string) => void;
    label?: string;
    required?: boolean;
    className?: string;
}

function to12h(value: string): { hour: string; minute: string; period: string } {
    if (!value || !value.includes(':')) return { hour: '09', minute: '00', period: 'AM' };
    const [h, m] = value.split(':');
    let hNum = parseInt(h, 10);
    const p = hNum >= 12 ? 'PM' : 'AM';
    const display = hNum % 12 === 0 ? 12 : hNum % 12;
    return { hour: display.toString().padStart(2, '0'), minute: m.padStart(2, '0'), period: p };
}

function to24h(hour: string, minute: string, period: string): string {
    let h = parseInt(hour, 10);
    if (period === 'PM' && h < 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${minute}`;
}

const HOURS = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

const TimeInput: React.FC<TimeInputProps> = ({ value, onChange, label, required, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const hourRef = useRef<HTMLDivElement>(null);

    const parsed = to12h(value);
    const [hour, setHour] = useState(parsed.hour);
    const [minute, setMinute] = useState(parsed.minute);
    const [period, setPeriod] = useState(parsed.period);

    // Sync display when external value changes (e.g. on edit open)
    useEffect(() => {
        const p = to12h(value);
        setHour(p.hour);
        setMinute(p.minute);
        setPeriod(p.period);
    }, [value]);

    // Scroll selected hour into view when popover opens
    useEffect(() => {
        if (isOpen && hourRef.current) {
            const selected = hourRef.current.querySelector('[data-selected="true"]');
            if (selected) {
                (selected as HTMLElement).scrollIntoView({ block: 'center', behavior: 'instant' });
            }
        }
    }, [isOpen]);

    // Position dropdown using fixed so it escapes overflow:hidden in Modal
    const openDropdown = useCallback(() => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const dropH = 280;
            const top = spaceBelow >= dropH ? rect.bottom + 6 : rect.top - dropH - 6;
            setDropdownPos({ top, left: rect.left, width: Math.max(rect.width, 240) });
        }
        setIsOpen(v => !v);
    }, []);

    // Close on outside click
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

    const pick = (h: string, m: string, p: string) => {
        setHour(h); setMinute(m); setPeriod(p);
        onChange(to24h(h, m, p));
    };

    const displayTime = `${hour}:${minute} ${period}`;

    return (
        <div className={`relative ${className ?? ''}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label}{required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
            )}

            {/* Trigger Button */}
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
                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="font-medium tabular-nums">{displayTime}</span>
                </div>
                <ChevronDown
                    className="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-150"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
            </div>

            {/* Dropdown — rendered via fixed position to escape Modal overflow:hidden */}
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
                    {/* Header */}
                    <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-bg">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Select Time</span>
                        <div className="flex items-center bg-gray-200 dark:bg-dark-border rounded-lg p-0.5 gap-0.5">
                            {['AM', 'PM'].map(p => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => pick(hour, minute, p)}
                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all
                                        ${period === p
                                            ? 'bg-white dark:bg-primary-600 text-primary-600 dark:text-white shadow-sm'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Column labels */}
                    <div className="flex border-b border-gray-100 dark:border-dark-border">
                        <div className="flex-1 px-3 py-1.5 text-center">
                            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Hour</span>
                        </div>
                        <div className="flex-1 px-3 py-1.5 text-center border-l border-gray-100 dark:border-dark-border">
                            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Minute</span>
                        </div>
                    </div>

                    {/* Picker columns */}
                    <div className="flex" style={{ height: '180px' }}>
                        {/* Hours — scrollable */}
                        <div
                            ref={hourRef}
                            className="flex-1 overflow-y-auto no-scrollbar p-1"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
                        >
                            {HOURS.map(h => (
                                <button
                                    key={h}
                                    type="button"
                                    data-selected={hour === h}
                                    onClick={() => pick(h, minute, period)}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors
                                        ${hour === h
                                            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-border/40'
                                        }`}
                                >
                                    {h}
                                    {hour === h && <Check className="w-3 h-3" />}
                                </button>
                            ))}
                        </div>

                        {/* Minutes */}
                        <div className="flex-1 p-1 border-l border-gray-100 dark:border-dark-border flex flex-col gap-1 justify-start">
                            {MINUTES.map(m => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => pick(hour, m, period)}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors
                                        ${minute === m
                                            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-border/40'
                                        }`}
                                >
                                    {m}
                                    {minute === m && <Check className="w-3 h-3" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-2 border-t border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-bg">
                        <div className="flex items-center justify-between px-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium tabular-nums">
                                Selected: <span className="text-primary-600 dark:text-primary-400 font-bold">{displayTime}</span>
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-1 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimeInput;
