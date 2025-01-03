import React from "react";
import { useState } from "react";
import { MapContainer, Marker, Polygon, Popup, TileLayer, useMapEvents } from "react-leaflet";
const Login = () => {
    const position: [number, number] = [51.505, -0.09];
    return (
        // <div className="justify-content-center flex min-h-screen content-center bg-slateLight-100 transition-colors dark:bg-slateLight-950">
        //     <div className="mx-auto w-52 max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-slateLight-800">test</div>
        // </div>
        <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* <LocationMarker /> */}
        </MapContainer>
    );
};

export default Login;
