import { Search } from 'lucide-react';
import { useState } from 'react';

interface SearchBoxProps {
    onSearch: (licenseNumber: string) => void;
}

export function SearchBox({ onSearch }: SearchBoxProps) {
    const [value, setValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            onSearch(value.trim());
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="absolute top-4 left-4 z-[1000] w-72 bg-white rounded-lg shadow-lg overflow-hidden flex items-center p-2 border border-gray-200"
        >
            <Search className="w-5 h-5 text-gray-400 ml-1" />
            <input
                type="text"
                placeholder="Enter license plate (e.g. 29A-12345)"
                className="flex-1 px-3 py-2 outline-none text-sm"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-opacity-90 transition-all font-semibold"
            >
                Track
            </button>
        </form>
    );
}
