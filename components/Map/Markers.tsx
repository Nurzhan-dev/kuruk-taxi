"use client";
import React, { useContext } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Контексты
import { UserLocationContext } from "@/context/UserLocationContext";
import { SourceCordiContext } from "@/context/SourceCordiContext";
import { DestinationCordiContext } from "@/context/DestinationCordiContext";

// Создаем иконки для Leaflet на основе ваших картинок
const userIcon = L.icon({
  iconUrl: "./pin.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const locationIcon = L.icon({
  iconUrl: "./location.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

function Markers() {
  const { userLocation } = useContext(UserLocationContext);
  const { soruceCordinates } = useContext(SourceCordiContext);
  const { destinationCordinates } = useContext(DestinationCordiContext);

  return (
    <>
      {/* Маркер пользователя */}
      {userLocation?.lat && userLocation?.lng && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>Вы здесь</Popup>
        </Marker>
      )}

      {/* Маркер А (Откуда) */}
      {soruceCordinates?.lat && soruceCordinates?.lng && (
        <Marker position={[soruceCordinates.lat, soruceCordinates.lng]} icon={locationIcon} />
      )}

      {/* Маркер Б (Куда) */}
      {destinationCordinates?.lat && destinationCordinates?.lng && (
        <Marker position={[destinationCordinates.lat, destinationCordinates.lng]} icon={locationIcon} />
      )}
    </>
  );
}

export default Markers;