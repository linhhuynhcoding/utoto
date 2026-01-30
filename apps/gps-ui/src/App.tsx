import { useEffect, useState, useCallback, useRef } from 'react';
import { Map } from '@/components/Map';
import { SearchBox } from '@/components/SearchBox';
import { config } from '@/config';
import { Activity, Radio, AlertCircle, Play, Square } from 'lucide-react';
import { useGpsStore } from '@/stores/useGpsStore';
import { GpsEvent } from '@utoto/shared';

function App() {
    const { points, selectedCar, setSelectedCar, addCar, cars, movements, toggleMovement, routes, movePosition } = useGpsStore();
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
                        // addPoint({
                        //     ...data,
                        //     timestamp: Date.now()
                        // });
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
    // }, [addPoint]);

    useEffect(() => {
        connectWebSocket();
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [connectWebSocket]);

    useEffect(() => {
        const interval = setInterval(() => {
            Object.keys(movements).forEach(licenseNumber => {
                // if (movements[licenseNumber] && routes[licenseNumber]?.next_target === routes[licenseNumber]?.points.length - 1) {
                //     console.log(`Car ${licenseNumber} reached final target, stopping movement.`);
                //     toggleMovement(licenseNumber);
                //     return;
                // }
                if (movements[licenseNumber]) {
                    movePosition(licenseNumber);
                }
            });
        }, 200);

        return () => clearInterval(interval);
    }, [movements, movePosition]);



    useEffect(() => {
        for (const licenseNumber of Object.keys(points)) {
            wsRef.current?.send(JSON.stringify({
                type: 'update_position',
                data: {
                    id: Date.now().toString(),
                    licenseNumber: licenseNumber,
                    timestamp: Date.now(),
                    last_position: points[licenseNumber],
                    speed: 0,
                    last_time_running: movements[licenseNumber] ? Date.now() : 0,
                    last_time_stopped: movements[licenseNumber] ? 0 : Date.now(),
                    state: movements[licenseNumber] ? "running" : "stopped",
                } as GpsEvent
            }));
        }
    }, [points])

    const handleSearch = async (licenseNumber: string) => {
        try {
            // Check if already in points
            if (points[licenseNumber]) {
                setSelectedCar(licenseNumber);
                return;
            }

            const response = await fetch(`${config.API_URL}/car/search?license_number=${licenseNumber}`);
            const data = await response.json();

            if (data.success && data.items && data.items.length > 0) {
                const car = data.items[0];
                if (car.location) {
                    addCar(car);
                    setSelectedCar(car.license_number);
                } else {
                    setError(`Car ${licenseNumber} found but has no location data`);
                    setTimeout(() => setError(null), 3000);
                }
            } else {
                setError(`Car with license plate ${licenseNumber} not found`);
                setTimeout(() => setError(null), 3000);
            }
        } catch (err) {
            console.error('Search error:', err);
            setError('Failed to search for car');
            setTimeout(() => setError(null), 3000);
        }
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
                <div className="absolute top-4 left-4 z-[1000] space-y-2">
                    <SearchBox onSearch={handleSearch} />

                    {Object.keys(cars).length > 0 && (
                        <div className="w-72 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-3 max-h-64 overflow-y-auto">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tracked Cars</h3>
                            <div className="space-y-1">
                                {Object.values(cars).map((car: any) => (
                                    <div
                                        key={car.license_number}
                                        onClick={() => setSelectedCar(car.license_number)}
                                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-all ${selectedCar === car.license_number ? 'bg-primary/10 border border-primary/20' : 'hover:bg-gray-50 border border-transparent'}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-800">{car.license_number}</span>
                                                <span className="text-[10px] text-gray-500">{car.name}</span>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleMovement(car.license_number);
                                                }}
                                                className={`p-1.5 rounded-md transition-colors ${movements[car.license_number] ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
                                            >
                                                {movements[car.license_number] ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {points[car.license_number] ? (
                                                <span className="text-[10px] text-green-500 bg-green-50 px-1.5 py-0.5 rounded border border-green-100 font-medium">Live</span>
                                            ) : (
                                                <span className="text-[10px] text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">Found</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="absolute top-4 left-80 z-[1000] bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 shadow-md animate-in fade-in slide-in-from-top-4">
                        <AlertCircle className="w-5 h-5" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* <div className="absolute bottom-6 right-6 z-[1000] bg-white bg-opacity-90 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-white/50 w-64">
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
                </div> */}

                <Map points={points} selectedCar={selectedCar} />
            </main>
        </div>
    );
}

export default App;