import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { LngLatLike } from "mapbox-gl";
import "../components/Map.css"; // Import CSS file for custom styling
import Sidebar from "@/comps/Side-bar";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
// import bg from "../assets/bg.jpeg";

interface ClassResult {
  survey_number: string;
  state_or_ut: string;
  class: string;
}

interface CropSuggestionResponse {
  cropSuggestion: string;
}

const Map: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [classResult, setClassResult] = useState<ClassResult | null>(null);
  const [cropSuggestion, setCropSuggestion] =
    useState<CropSuggestionResponse | null>(null);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiaGFyc2hkZXNobXVraDIxIiwiYSI6ImNsdW1ydmF3MjBiNWMya3BueWxsbHc1OTYifQ.ZQ10ldWOzFyzBb_DMeiDXg"; // Your provided Mapbox access token

    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      zoom: 9,
    });

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        map.setCenter([longitude, latitude] as LngLatLike);
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }

    map.on("click", (e) => {
      const { lng, lat } = e.lngLat;

      // Use Mapbox Geocoding API to reverse geocode the coordinates
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
      )
        .then((response) => response.json())
        .then((data) => {
          const areaName = data.features[0].place_name;
          console.log(
            `Latitude: ${lat}, Longitude: ${lng}, Area Name: ${areaName}`
          );

          // Call the first backend API (get_class) with the obtained longitude, latitude, and area name
          fetch("http://localhost:5003/get_class", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ latitude: lat, longitude: lng, areaName }),
          })
            .then((response) => response.json())
            .then((data: ClassResult) => {
              console.log("Class result:", data);
              setClassResult(data); // Store the class result in state
            })
            .catch((error) => {
              console.error("Error fetching class result:", error);
            });

          // Call the second backend API (suggest-crops) with the obtained longitude, latitude, and area name
          fetch("http://localhost:5001/suggest-crops", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ latitude: lat, longitude: lng, areaName }),
          })
            .then((response) => response.json())
            .then((data: CropSuggestionResponse) => {
              console.log("Crop suggestion:", data);
              setCropSuggestion(data); // Store the crop suggestion result in state
            })
            .catch((error) => {
              console.error("Error fetching crop suggestion:", error);
            });
        })
        .catch((error) => {
          console.error("Error fetching reverse geocoding data:", error);
        });
    });
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: "Search for a location",
    });

    map.addControl(geocoder);

    return () => map.remove();
  }, []);

  return (
    <div
      className="whole bg-cover bg-center text-sm"
      // style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="flex">
        <Sidebar />
        <div className="">
          <h2 className="pl-[50px] mt-12 font-bold">YIELD ATLAS.</h2>
          <div
            ref={mapContainerRef}
            className=" w-[650px] h-[500px] ml-[5vw] mt-[5%] "
          />
        </div>
      </div>
      <div className="flex-row ml-[100px]  h-[500px] mt-130px">
        {classResult && (
          <div className="flex-row w-[300px] font-light">
            <h3 className="font-bold">Class Result-</h3>
            <p className="font-semibold">
              Survey Number: {classResult.survey_number}
            </p>
            <p className="font-semibold text-sm">
              State/UT: {classResult.state_or_ut}
            </p>
            <p className="font-semibold text-sm">Class: {classResult.class}</p>
          </div>
        )}
        {cropSuggestion && (
          <div className="mt-[40px] pr-[10px]">
            <h3 className="font-semibold text-sm">Crop Suggestion:</h3>
            <p>{cropSuggestion.cropSuggestion}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Map;
