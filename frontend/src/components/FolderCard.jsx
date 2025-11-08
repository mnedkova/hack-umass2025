import { Link } from "react-router-dom";

export default function FolderCard({ label, image, link }) {
  return (
    <Link to={link} className="flex flex-col items-center hover:scale-105 transition">
      <img src={image} alt={label} className="w-32 h-32 object-contain" />
      <span className="mt-2 font-medium">{label}</span>
    </Link>
  );
}