import { Link } from "react-router-dom";

const folders = [
  { label: "CICS 110", image: "/Dark-Blue-Folder.png", link: "/CICS110" },
  { label: "CICS 160", image: "/Yellow-Folder.png", link: "/CICS160" },
  { label: "CICS 210", image: "/Red-Folder.png", link: "/CICS210" },
  { label: "CICS 220", image: "/Light-Blue-Folder.png", link: "/CICS220" },
  { label: "CICS 230", image: "/Purple-Folder.png", link: "/CICS230" },
];

export default function FolderStack() {
  const SPACING = 100; // Consistent spacing between each folder in pixels

  return (
    <div className="relative w-full min-h-screen bg-gray-900 pt-16">
      <div className="relative w-full" style={{ height: `calc(100vh + ${SPACING * (folders.length - 1)}px)` }}>
        {folders.map((f, i) => (
          <Link
            key={f.label}
            to={f.link}
            className="absolute w-full transition-transform duration-200 hover:scale-[1.01]"
            style={{
              top: `${i * SPACING}px`, // Each folder positioned with consistent spacing
              zIndex: i + 1, // Bottom folder has highest z-index
              filter: 'saturate(0.75) brightness(0.9)'

            }}
          >
            <img 
              src={f.image} 
              alt={f.label}
              className="w-full h-auto"
            />
            
            {/* Label overlay on the tab area */}
            <div 
  className="absolute top-8 left-60 sm:left-50 text-2xl sm:text-3xl lg:text-4xl font-bold pointer-events-none"
  style={{ zIndex: 10 }}
>
  {f.label}
</div>
          </Link>
        ))}
      </div>
    </div>
  );
}