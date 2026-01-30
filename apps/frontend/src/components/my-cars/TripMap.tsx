import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import { Card, CardContent } from "@/components/ui/card"
import "leaflet/dist/leaflet.css"
import carIconUrl from "@/assets/car_topview.png"
import { useEffect } from "react"

interface TripMapProps {
    licenseNumber: string
    carName: string
    locations?: { lat: number; lng: number }[]
}

// Mock GPS coordinates (simulating a route in Ho Chi Minh City)
const mockRoute = [
    { lat: 10.7769, lng: 106.7009 },
    { lat: 10.7779, lng: 106.7019 },
    { lat: 10.7789, lng: 106.7029 },
    { lat: 10.7799, lng: 106.7039 },
    { lat: 10.7809, lng: 106.7049 },
]

// Create custom car icon with license plate
const createCarIcon = (licenseNumber: string) => {
    return L.divIcon({
        className: 'custom-car-marker',
        html: `
            <div style="position: relative; width: 60px; height: 60px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <div style="
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 2px 4px;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: bold;
                    white-space: nowrap;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    font-family: monospace;
                    position: absolute;
                    bottom: 45px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 10;
                ">${licenseNumber}</div>
                <img 
                    src="${carIconUrl}" 
                    style="
                        width: 20px;
                        height: 30px;
                        object-fit: contain;
                        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    "
                    alt="car"
                />
            </div>
        `,
        iconSize: [60, 60],
        iconAnchor: [30, 30],
    })
}


export default function TripMap({ licenseNumber, carName, locations }: TripMapProps) {
    console.log("TripMap locations: ", locations);
    const currentPosition = locations?.[locations.length - 1] ?? mockRoute[mockRoute.length - 1]
    const center: [number, number] = [currentPosition.lat, currentPosition.lng] as [number, number]

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-0 relative">
                <div className="h-[400px] relative">
                    <MapContainer
                        center={center}
                        zoom={14}
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={true}
                    >
                        {/* <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        /> */}

                        <TileLayer
                            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        />


                        {/* Route path */}
                        <Polyline
                            positions={(locations ?? mockRoute).map(p => [p.lat, p.lng] as [number, number])}
                            color="#3b82f6"
                            weight={3}
                            opacity={0.7}
                            // stroke={false}
                            dashArray="10, 10"
                        />


                        {/* Current position marker (last point) */}
                        <Marker
                            position={[currentPosition.lat, currentPosition.lng] as [number, number]}
                            icon={createCarIcon(licenseNumber)}
                        >
                            <Popup>
                                <div className="text-center">
                                    <p className="font-bold">{carName}</p>
                                    <p className="text-xs text-gray-600 font-mono">{licenseNumber}</p>
                                    <p className="text-xs text-green-600 mt-1">Vị trí hiện tại</p>
                                </div>
                            </Popup>
                        </Marker>
                        <RecenterMap center={center} />
                    </MapContainer>

                    {/* Overlay indicators */}
                    <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md border z-[1000]">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-semibold text-gray-700">Đang theo dõi GPS</span>
                        </div>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md border z-[1000]">
                        <p className="text-xs text-gray-500">Vị trí hiện tại</p>
                        <p className="text-sm font-bold">{carName}</p>
                        <p className="text-xs text-gray-600 font-mono">{licenseNumber}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function RecenterMap({ center }: { center: [number, number] }) {
    const map = useMap();

    useEffect(() => {
        map.panTo(center);
    }, [center, map]);

    return null;
}