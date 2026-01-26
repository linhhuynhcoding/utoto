import { useEffect, useState, useCallback, useRef } from 'react';
import { Map } from '@/components/Map';
import { SearchBox } from '@/components/SearchBox';
import { GpsPoint } from '@/types';
import { config } from '@/config';
import { Activity, Radio, AlertCircle } from 'lucide-react';

function App() {
    const [points, setPoints] = useState<Record<string, GpsPoint>>({});
    const [selectedCar, setSelectedCar] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const wsRef = useRef<WebSocket | null>(null);

    const connectWebSocket = useCallback(() => {
        try {
            const ws = new WebSocket(config.WS_URL);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('Connected to GPS WebSocket');
                setIsConnected(true);
                setError(null);
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.licenseNumber) {
                        setPoints(prev => ({
                            ...prev,
                            [data.licenseNumber]: {
                                ...data,
                                timestamp: Date.now()
                            }
                        }));
                    }
                } catch (err) {
                    console.error('Failed to parse WS message:', err);
                }
            };

            ws.onclose = () => {
                console.log('Disconnected from GPS WebSocket');
                setIsConnected(false);
                // Attempt to reconnect after 3 seconds
                setTimeout(connectWebSocket, 3000);
            };

            ws.onerror = (err) => {
                console.error('WebSocket error:', err);
                setError('Failed to connect to GPS service');
                setIsConnected(false);
            };
        } catch (err) {
            console.error('WS Connection error:', err);
            setError('Connection setup failed');
        }
    }, []);

    useEffect(() => {
        connectWebSocket();
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [connectWebSocket]);

    const handleSearch = (licenseNumber: string) => {
        setSelectedCar(licenseNumber);
    };

    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden font-sans">
            <header className="h-16 bg-white border-b flex items-center justify-between px-6 z-10 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="bg-primary p-2 rounded-lg">
                        <Activity className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-800 tracking-tight">Utoto GPS Tracker</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                        <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className="text-sm font-medium text-gray-600">
                            {isConnected ? 'Service Online' : 'Service Offline'}
                        </span>
                    </div>
                    <Radio className={`w-5 h-5 ${isConnected ? 'text-primary' : 'text-gray-300'}`} />
                </div>
            </header>

            <main className="flex-1 relative">
                <SearchBox onSearch={handleSearch} />

                {error && (
                    <div className="absolute top-20 left-4 z-[1000] bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 shadow-md animate-in fade-in slide-in-from-top-4">
                        <AlertCircle className="w-5 h-5" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                <div className="absolute bottom-6 right-6 z-[1000] bg-white bg-opacity-90 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-white/50 w-64">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Live Fleet Status</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {Object.keys(points).length === 0 ? (
                            <p className="text-sm text-gray-400 italic py-2">No active trackers detected...</p>
                        ) : (
                            Object.values(points).map(point => (
                                <div
                                    key={point.licenseNumber}
                                    onClick={() => setSelectedCar(point.licenseNumber)}
                                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${selectedCar === point.licenseNumber ? 'bg-primary/10 border border-primary/20' : 'hover:bg-gray-100 border border-transparent'}`}
                                >
                                    <span className="text-sm font-bold text-gray-700">{point.licenseNumber}</span>
                                    <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">Live</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <Map points={points} selectedCar={selectedCar} />
            </main>
        </div>
    );
}

export default App;
