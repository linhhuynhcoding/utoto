import 'leaflet/dist/leaflet.css';
// import 'leaflet-draw/dist/leaflet.draw.css';
import { GpsPoint, Route } from '@utoto/shared';
import { useEffect } from 'react';
import { EditControl } from 'react-leaflet-draw';
import React from 'react';
import { useGpsStore } from '@/stores/useGpsStore';
import type { FeatureCollection } from 'geojson';
import toast from 'react-hot-toast';
import * as L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap, FeatureGroup, Polyline } from 'react-leaflet';

// Fix for default marker icon in Leaflet + React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapProps {
    points: Record<string, GpsPoint>;
    selectedCar: string | null;
}

function RecenterMap({ position }: { position: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(position);
    }, [position, map]);
    return null;
}

export function Map({ selectedCar }: MapProps) {

    const { routes, setRoute } = useGpsStore();
    // const selectedPoint = selectedCar ? points[selectedCar] : null;
    // const center: [number, number] = selectedPoint
    //     ? [selectedPoint[0], selectedPoint[1]]
    //     : [10.762622, 106.660172]; // Default to HCM city
    const center: [number, number] = [10.762622, 106.660172]; // Default to HCM city

    const selectedRoute = selectedCar ? routes[selectedCar] : [];

    const handleAddNewRoute = (new_points: Array<[number, number]>) => {
        setRoute(selectedCar as string, new_points);
        for (let i = 1; i < new_points.length; i++) {
            const d = L.latLng(new_points[i - 1]).distanceTo(new_points[i]);
            console.log(d);
        }
        toast.success('Thêm tuyến đường mới');
    }

    return (
        <div className="w-full h-full relative">
            <MapContainer
                center={center as [number, number]}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full"

            >
                {/* <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                /> */}

                <TileLayer
                    attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                {/* Draw all car markers */}
                {Object.values(routes).map((route) => (
                    <Marker
                        key={route.licenseNumber}
                        position={route.cur_pos as [number, number]}
                    >
                        <Popup>
                            <div className="font-semibold">{route.licenseNumber}</div>
                            <div className="text-xs">{route.cur_pos[0].toFixed(6)}, {route.cur_pos[1].toFixed(6)}</div>
                            <div className="text-xs">{route.next_target}</div>
                        </Popup>
                    </Marker>
                ))}

                {/* Draw route for selected car */}
                {(selectedRoute as Route)?.points?.length > 1 && (
                    <Polyline
                        positions={(selectedRoute as Route)?.points?.map(p => [p[0], p[1]] as [number, number])}
                        color="#3b82f6"
                        weight={4}
                        opacity={0.6}
                    />
                )}

                {/* {selectedPoint && <RecenterMap position={[selectedPoint[0], selectedPoint[1]] as [number, number]} />} */}
                {/* <DrawControl /> */}
                <EditControlFC handleAddNewRoute={handleAddNewRoute} selectedCar={selectedCar} />
            </MapContainer>
        </div>
    );
}

interface Props {
    geojson?: FeatureCollection;
    setGeojson?: (geojson: FeatureCollection) => void;
    selectedCar?: string | null;
    handleAddNewRoute: (new_points: Array<[number, number]>) => void;
}

export default function EditControlFC({ geojson, setGeojson, selectedCar, handleAddNewRoute }: Props) {
    const ref = React.useRef<L.FeatureGroup | null>(null);
    const editControlRef = React.useRef<EditControl | null>(null);

    React.useEffect(() => {
        if (ref.current?.getLayers().length === 0 && geojson) {
            L.geoJSON(geojson).eachLayer((layer) => {
                if (
                    layer instanceof L.Polyline ||
                    layer instanceof L.Polygon ||
                    layer instanceof L.Marker
                ) {
                    if (layer?.feature?.properties.radius && ref.current) {
                        new L.Circle(layer.feature.geometry.coordinates.slice().reverse(), {
                            radius: layer.feature?.properties.radius,
                        }).addTo(ref.current);
                    } else {
                        ref.current?.addLayer(layer);
                    }
                }
            });
        }
    }, [geojson]);

    const handleChange = () => {
        // if (!selectedCar) {
        //     toast.error('Chọn xe trước');
        //     return;
        // }
        const geo = ref.current?.toGeoJSON();
        console.log(geo);
        // if (geo?.type === 'FeatureCollection') {
        //     setGeojson(geo);
        // }
    };

    const handleCreate = (v: any) => {
        // if (!selectedCar) {
        //     toast.error('Chọn xe trước');
        //     return;
        // }
        const geo = ref.current?.toGeoJSON();
        console.log(geo);
        console.log(v.layer.toGeoJSON());
        handleAddNewRoute(v.layer.toGeoJSON().geometry.coordinates.map((coord: any) => [coord[1], coord[0]]));
        // if (geo?.type === 'FeatureCollection') {
        //     setGeojson(geo);
        // }
    };
    const handleEdit = (v: any) => {
        // if (!selectedCar) {
        //     toast.error('Chọn xe trước');
        //     return;
        // }
        const geo = ref.current?.toGeoJSON();
        console.log(geo);
        console.log(v.layers.toGeoJSON());
        const temp = geo?.type === 'FeatureCollection' ? geo.features.map((f) => {
            console.log({ id: f.id });
            return { id: Math.random().toString(36).substr(2, 9) };
        }) : null;
        // if (geo?.type === 'FeatureCollection') {
        //     setGeojson(geo);
        // }
        // ref.current.
    };


    useEffect(() => {
        console.log('EditControlFC editControlRef changed', { ref })
    }, [ref]);
    return (
        <FeatureGroup ref={ref}>
            <EditControl
                // ref={editControlRef}
                position="topright"
                onMounted={(e: any) => {
                    editControlRef.current = e
                }}
                onEdited={handleEdit}
                onCreated={handleCreate}
                // onDeleted={handleChange}
                // onDrawStart={(v: L.DrawEvents.DrawStart) => {
                //     console.log('Draw start', v);
                // }}

                draw={{
                    rectangle: false,
                    circle: true,
                    polyline: true,
                    polygon: true,
                    marker: false,
                    circlemarker: false,

                }}

            />
        </FeatureGroup>
    );
}