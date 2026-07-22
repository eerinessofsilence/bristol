import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import { Button } from './ui/Button';

type Props = {
  onContact: () => void;
};

const cities = [
  { name: 'Одеса', position: [46.482, 30.723] as [number, number] },
  { name: 'Чорноморськ', position: [46.3, 30.65] as [number, number] },
  { name: 'Київ', position: [50.45, 30.52] as [number, number] },
  { name: 'Львів', position: [49.84, 24.03] as [number, number] },
];

export function CoverageMap({ onContact }: Props) {
  return (
    <section id="operate" className="scroll-mt-10 pb-20 md:pb-24">
      <div
        className="page-wrap grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14"
        data-reveal
      >
        <div>
          <span className="section-tag">Покриття</span>
          <h2 className="section-title mt-4">Де ми працюємо</h2>
          <p className="text-portway-ink-2 mt-5 max-w-md leading-7">
            Власні офіси та партнери-агенти в ключових портах і містах України — під разові поставки
            або постійну співпрацю.
          </p>
          <div className="my-7 flex flex-wrap gap-2">
            {cities.map((city) => (
              <span key={city.name} className="glass-tag bg-portway-primary/5">
                <MapPin size={14} strokeWidth={2.4} /> {city.name}
              </span>
            ))}
          </div>
          <Button variant="outline" onClick={onContact}>
            Перевірити покриття портів
          </Button>
        </div>
        <div className="border-portway-line h-[420px] overflow-hidden rounded-[18px] border">
          <MapContainer
            center={[48.9, 31.6]}
            zoom={5}
            scrollWheelZoom
            touchZoom
            wheelDebounceTime={30}
            wheelPxPerZoomLevel={80}
            className="h-full w-full"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap &copy; CARTO"
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            {cities.map((city) => (
              <CircleMarker
                key={city.name}
                center={city.position}
                radius={9}
                pathOptions={{ color: '#ffffff', weight: 3, fillColor: '#2e9a75', fillOpacity: 1 }}
              >
                <Popup>{city.name}</Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>
    </section>
  );
}
