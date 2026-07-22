import { MapPin } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Button } from './ui/Button';

type Props = {
  onContact: () => void;
};

const cities = [
  { name: 'Одеса', coordinates: [30.723, 46.482] as [number, number] },
  { name: 'Чорноморськ', coordinates: [30.65, 46.3] as [number, number] },
  { name: 'Київ', coordinates: [30.52, 50.45] as [number, number] },
  { name: 'Львів', coordinates: [24.03, 49.84] as [number, number] },
];

const mapTilerApiKey = import.meta.env.VITE_MAPTILER_API_KEY?.trim();

export function CoverageMap({ onContact }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || !mapTilerApiKey) return;

    let map: import('maplibre-gl').Map | undefined;
    let cancelled = false;

    const initializeMap = async () => {
      const { default: maplibregl } = await import('maplibre-gl');
      if (cancelled || !mapContainerRef.current) return;

      map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: `https://api.maptiler.com/maps/dataviz-v4-light/style.json?key=${mapTilerApiKey}`,
        center: [31.6, 48.9],
        zoom: 5,
        minZoom: 3.5,
        maxZoom: 15,
        scrollZoom: true,
        dragRotate: false,
        pitchWithRotate: false,
        attributionControl: false,
      });

      map.addControl(
        new maplibregl.NavigationControl({ showCompass: false, visualizePitch: false }),
        'top-left',
      );
      map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

      cities.forEach((city) => {
        const marker = document.createElement('button');
        marker.type = 'button';
        marker.className = 'portway-map-marker';
        marker.setAttribute('aria-label', city.name);

        new maplibregl.Marker({ element: marker, anchor: 'center' })
          .setLngLat(city.coordinates)
          .setPopup(
            new maplibregl.Popup({
              offset: 18,
              closeButton: false,
              className: 'portway-map-popup',
            }).setText(city.name),
          )
          .addTo(map!);
      });
    };

    void initializeMap();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, []);

  return (
    <section id="operate" className="scroll-mt-10 py-20 md:py-24">
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
        <div className="border-portway-line bg-portway-mint-soft relative h-[420px] overflow-hidden rounded-[18px] border">
          {mapTilerApiKey ? (
            <div
              ref={mapContainerRef}
              className="h-full w-full"
              aria-label="Карта покриття Portway"
            />
          ) : (
            <div className="text-portway-ink-2 flex h-full items-center justify-center px-8 text-center text-sm leading-6">
              Додайте VITE_MAPTILER_API_KEY у frontend/.env.local, щоб показати карту.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
