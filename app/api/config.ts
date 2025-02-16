import L from "leaflet";
export const customIcon = L.icon({
  iconUrl: "./marker-icon-2x-green.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export const popupContentStyle = {
  backgroundColor: "#fff",
  padding: "10px",
  borderRadius: "5px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
  fontSize: "14px",
  color: "#333",
};

export const dropupMenuStyle = {
  position: "absolute",
  bottom: "10px",
  right: "10px",
  backgroundColor: "#fff",
  padding: "10px",
  borderRadius: "5px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
  zIndex: 1000,
};

export const places = [
  { id: 1, name: "Hospital" },
  { id: 2, name: "Temple" },
  { id: 3, name: "School" },
  { id: 4, name: "Mall" },
  { id: 5, name: "Park" },
  { id: 6, name: "Others" },
];
export const customIconFunction = (type: string) => {
  return new L.Icon({
    iconUrl: `/${type}.svg`,

    shadowUrl: "/marker-shadow.png",

    iconSize: [30, 41],

    iconAnchor: [12, 41],

    popupAnchor: [1, -34],

    shadowSize: [41, 41],
  });
};
