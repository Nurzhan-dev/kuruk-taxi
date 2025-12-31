"use client";
import React, { useContext, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

const LAny = L as any;

import { UserLocationContext } from "@/context/UserLocationContext";
import { SourceCordiContext } from "@/context/SourceCordiContext";
import { DestinationCordiContext } from "@/context/DestinationCordiContext";
import { DirectionDataContext } from "@/context/DirectionDataContext";
import DistanceTime from "../Booking/DistanceTime";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Дополнительный компонент для исправления размера карты
function ResizeMap() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 500);
  }, [map]);
  return null;
}

function RoutingAndFly({ source, destination, setDirectionData }: any) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (source && !destination) {
      map.flyTo([source.lat, source.lng], 15, { animate: true });
    }

    if (source && destination) {
      const routingControl = LAny.Routing.control({
        waypoints: [
          L.latLng(source.lat, source.lng),
          L.latLng(destination.lat, destination.lng)
        ],
        lineOptions: {
          styles: [{ color: "#facc15", weight: 6 }],
          extendToWaypoints: true,
          missingRouteTolerance: 1
        },
        addWaypoints: false,
        draggableWaypoints: false,
        show: false,
      }).on('routesfound', function(e: any) {
        if (e.routes && e.routes[0]) {
          setDirectionData(e.routes[0]);
        }
      }).addTo(map);

      return () => { 
        if (map && routingControl) {
          map.removeControl(routingControl); 
        }
      };
    }
  }, [map, source, destination, setDirectionData]);

  return null;
}

const kurykBounds = L.latLngBounds(
  L.latLng(43.1500, 51.6000),
  L.latLng(43.2100, 51.7200)
);

function LeafletMap() {
  const { userLocation } = useContext(UserLocationContext);
  const { soruceCordinates } = useContext(SourceCordiContext);
  const { destinationCordinates } = useContext(DestinationCordiContext);
  const { setDirectionData } = useContext(DirectionDataContext);

  // Центр Курыка, если координаты пользователя еще не загружены
  const defaultCenter: [number, number] = [43.175, 51.650];

 return (
    <div className="p-5 relative">
      <h2 className="text-[20px] font-semibold mb-2">Карта Курык</h2>
      <div className="rounded-lg overflow-hidden h-[450px] w-full border shadow-md">
        {userLocation && (
          <MapContainer
            center={[43.175, 51.650]} // Центр Курыка
            zoom={14}
            minZoom={13} // Не даем слишком сильно отдалять
            maxBounds={kurykBounds} // Указываем границы
            maxBoundsViscosity={1.0} // Насколько жестко "отбрасывать" назад при выходе за границы
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {/* Остальной ваш код с маркерами и RoutingAndFly */}
          </MapContainer>
        )}
      </div>
    </div>
  );
}

export default LeafletMap;