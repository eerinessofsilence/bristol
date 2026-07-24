import { geoCentroid, geoMercator, geoPath } from 'd3-geo';
import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  LineString,
  MultiPolygon,
  Polygon,
} from 'geojson';
import { AlertCircle, Anchor, RefreshCw, Warehouse } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';

const TOPOLOGY_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
const MAP_WIDTH = 920;
const MAP_HEIGHT = 560;

const COUNTRY_IDS = {
  bulgaria: 100,
  belarus: 112,
  hungary: 348,
  moldova: 498,
  poland: 616,
  romania: 642,
  slovakia: 703,
  ukraine: 804,
} as const;

const FOCUS_COUNTRY_IDS = new Set<number>(Object.values(COUNTRY_IDS));
const CORAL_COUNTRY_IDS = new Set<number>([COUNTRY_IDS.poland, COUNTRY_IDS.romania]);

const PORTS = [
  {
    name: 'Гданськ',
    coordinates: [18.65, 54.35] as [number, number],
    labelOffset: [14, -10] as [number, number],
  },
  {
    name: 'Констанца',
    coordinates: [28.65, 44.18] as [number, number],
    labelOffset: [14, -10] as [number, number],
  },
] as const;

const WAREHOUSE = {
  name: 'Склад клієнта',
  coordinates: [32, 49] as [number, number],
  labelOffset: [14, -10] as [number, number],
} as const;

type WorldTopology = Topology<{
  countries: GeometryCollection<GeoJsonProperties>;
}>;

type CountryFeature = Feature<Polygon | MultiPolygon, GeoJsonProperties>;
type CountryPiece = Feature<Polygon, GeoJsonProperties> & { countryId: number };

function toCountryId(value: string | number | undefined) {
  const countryId = Number(value);
  return Number.isFinite(countryId) ? countryId : -1;
}

function splitCountryPolygons(country: CountryFeature, featureIndex: number): CountryPiece[] {
  const countryId = toCountryId(country.id);
  const properties = country.properties ?? {};

  if (country.geometry.type === 'Polygon') {
    return [
      {
        ...country,
        id: `${countryId}-${featureIndex}-0`,
        geometry: country.geometry,
        properties,
        countryId,
      },
    ];
  }

  return country.geometry.coordinates.map((coordinates, index) => ({
    type: 'Feature',
    id: `${countryId}-${featureIndex}-${index}`,
    properties,
    countryId,
    geometry: {
      type: 'Polygon',
      coordinates,
    },
  }));
}

function isCrimeanPolygon(piece: CountryPiece) {
  const [longitude, latitude] = geoCentroid(piece);
  return longitude >= 33 && longitude <= 36.8 && latitude >= 44 && latitude <= 46.5;
}

function getCountryTone(piece: CountryPiece) {
  if (piece.countryId === COUNTRY_IDS.ukraine || isCrimeanPolygon(piece)) return 'ukraine';
  if (CORAL_COUNTRY_IDS.has(piece.countryId)) return 'coordination';
  return 'neutral';
}

function getCountryFill(piece: CountryPiece) {
  const tone = getCountryTone(piece);
  if (tone === 'ukraine') return '#E1F5EE';
  if (tone === 'coordination') return '#FAECE7';
  return '#D3D1C7';
}

function getCountryStroke(piece: CountryPiece) {
  const tone = getCountryTone(piece);
  if (tone === 'ukraine') return '#1D9E75';
  if (tone === 'coordination') return '#D85A30';
  return '#FFFFFF';
}

function MapSkeleton() {
  return (
    <div
      className="grid aspect-[23/14] min-h-[320px] place-items-center rounded-[22px] bg-[#f4f4f1]"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 text-sm font-medium text-[#6a7873]">
        <RefreshCw className="animate-spin" size={18} aria-hidden="true" />
        Завантажуємо мапу маршрутів…
      </div>
    </div>
  );
}

export function CoverageMap() {
  const [countries, setCountries] = useState<CountryFeature[] | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const [isCompactMap, setIsCompactMap] = useState(() =>
    window.matchMedia('(max-width: 640px)').matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 640px)');
    const handleChange = (event: MediaQueryListEvent) => setIsCompactMap(event.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetch(TOPOLOGY_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Map data request failed: ${response.status}`);
        return response.json() as Promise<WorldTopology>;
      })
      .then((topology) => {
        const collection = feature(topology, topology.objects.countries) as FeatureCollection<
          Geometry,
          GeoJsonProperties
        >;
        const polygonCountries = collection.features.filter(
          (country): country is CountryFeature =>
            country.geometry.type === 'Polygon' || country.geometry.type === 'MultiPolygon',
        );
        setCountries(polygonCountries);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setLoadError(true);
      });

    return () => controller.abort();
  }, [loadAttempt]);

  const map = useMemo(() => {
    if (!countries) return null;

    const focusCountries = countries.filter((country) =>
      FOCUS_COUNTRY_IDS.has(toCountryId(country.id)),
    );
    const focusCollection: FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties> = {
      type: 'FeatureCollection',
      features: focusCountries,
    };
    const projection = geoMercator().fitExtent(
      [
        [42, 36],
        [MAP_WIDTH - 42, MAP_HEIGHT - 38],
      ],
      focusCollection,
    );
    const path = geoPath(projection);
    const pieces = countries.flatMap(splitCountryPolygons);
    const routes: Array<Feature<LineString>> = PORTS.map((port) => ({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [port.coordinates, WAREHOUSE.coordinates],
      },
    }));

    return { projection, path, pieces, routes };
  }, [countries]);

  return (
    <section id="operate" className="scroll-mt-10 bg-white py-20 md:py-24">
      <div className="page-wrap">
        <div className="mx-auto max-w-3xl text-center" data-reveal>
          <span className="section-tag">Гданськ і Констанца</span>
          <h2 className="section-title mt-5">Маршрут вантажу до України</h2>
          <p className="text-portway-ink-2 mt-5 leading-7">
            Координуємо прибуття вантажу через порти Польщі та Румунії, виконуємо митне оформлення
            в Україні й організовуємо доставку до складу клієнта.
          </p>
        </div>

        <figure
          className="mt-12 overflow-hidden rounded-[24px] border border-[#d3d1c7]/70 bg-[#fbfbf9] p-3 shadow-[0_24px_64px_rgba(22,34,30,0.08)] sm:p-5 lg:p-7"
          data-reveal
          aria-labelledby="routes-map-title"
        >
          <figcaption id="routes-map-title" className="sr-only">
            Мапа маршрутів від портів Гданська та Констанци до складу клієнта в Україні
          </figcaption>

          {!countries && !loadError && <MapSkeleton />}

          {loadError && (
            <div
              className="grid aspect-[23/14] min-h-[320px] place-items-center rounded-[22px] bg-[#faece7] p-6 text-center"
              role="alert"
            >
              <div>
                <AlertCircle className="mx-auto text-[#d85a30]" size={28} aria-hidden="true" />
                <p className="mt-3 font-semibold text-[#712b13]">Не вдалося завантажити мапу</p>
                <button
                  type="button"
                  className="mt-4 cursor-pointer rounded-full bg-[#712b13] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5f220f]"
                  onClick={() => {
                    setLoadError(false);
                    setLoadAttempt((attempt) => attempt + 1);
                  }}
                >
                  Спробувати ще раз
                </button>
              </div>
            </div>
          )}

          {map && (
            <div className="relative">
              <svg
                viewBox={
                  isCompactMap ? `190 45 560 460` : `0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`
                }
                className="block h-auto w-full"
                role="img"
                aria-labelledby="map-svg-title map-svg-description"
              >
                <title id="map-svg-title">Маршрути через Гданськ і Констанцу</title>
                <desc id="map-svg-description">
                  Польща та Румунія позначені як країни координації. Україна, включно з Кримом,
                  позначена як країна митного оформлення. Пунктирні лінії ведуть від портів до
                  складу клієнта в Україні.
                </desc>
                <defs>
                  <filter id="map-point-shadow" x="-100%" y="-100%" width="300%" height="300%">
                    <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.18" />
                  </filter>
                </defs>

                <g aria-hidden="true">
                  {map.pieces.map((piece) => (
                    <path
                      key={String(piece.id)}
                      d={map.path(piece) ?? undefined}
                      fill={getCountryFill(piece)}
                      stroke={getCountryStroke(piece)}
                      strokeWidth={getCountryTone(piece) === 'neutral' ? 1.5 : 2}
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                </g>

                <g
                  fill="none"
                  stroke="#D85A30"
                  strokeDasharray="10 10"
                  strokeLinecap="round"
                  strokeWidth="3"
                  opacity="0.72"
                  aria-hidden="true"
                >
                  {map.routes.map((route, index) => (
                    <path
                      key={PORTS[index].name}
                      d={map.path(route) ?? undefined}
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                </g>

                {PORTS.map((port) => {
                  const point = map.projection(port.coordinates);
                  if (!point) return null;
                  const [x, y] = point;

                  return (
                    <g key={port.name} transform={`translate(${x} ${y})`}>
                      <circle
                        r="10"
                        fill="#D85A30"
                        stroke="#FFFFFF"
                        strokeWidth="4"
                        filter="url(#map-point-shadow)"
                      />
                      <text
                        x={port.labelOffset[0]}
                        y={port.labelOffset[1]}
                        fill="#141C1A"
                        fontSize="18"
                        fontWeight="700"
                        paintOrder="stroke"
                        stroke="#FBFBF9"
                        strokeWidth="5"
                        strokeLinejoin="round"
                      >
                        {port.name}
                      </text>
                    </g>
                  );
                })}

                {(() => {
                  const point = map.projection(WAREHOUSE.coordinates);
                  if (!point) return null;
                  const [x, y] = point;

                  return (
                    <g transform={`translate(${x} ${y})`}>
                      <circle
                        r="11"
                        fill="#085041"
                        stroke="#FFFFFF"
                        strokeWidth="4"
                        filter="url(#map-point-shadow)"
                      />
                      <text
                        x={WAREHOUSE.labelOffset[0]}
                        y={WAREHOUSE.labelOffset[1]}
                        fill="#141C1A"
                        fontSize="18"
                        fontWeight="700"
                        paintOrder="stroke"
                        stroke="#FBFBF9"
                        strokeWidth="5"
                        strokeLinejoin="round"
                      >
                        {WAREHOUSE.name}
                      </text>
                    </g>
                  );
                })()}
              </svg>
            </div>
          )}

          <div
            className="mt-4 grid gap-3 border-t border-[#d3d1c7]/70 px-2 pt-5 text-xs leading-5 text-[#3a4744] sm:grid-cols-2 lg:grid-cols-4"
            aria-label="Легенда мапи"
          >
            <div className="flex items-center gap-2.5">
              <span className="grid size-7 place-items-center rounded-full bg-[#faece7] text-[#d85a30]">
                <Anchor size={14} strokeWidth={2.5} aria-hidden="true" />
              </span>
              Порт координації
            </div>
            <div className="flex items-center gap-2.5">
              <span className="grid size-7 place-items-center rounded-full bg-[#e1f5ee] text-[#085041]">
                <Warehouse size={14} strokeWidth={2.5} aria-hidden="true" />
              </span>
              Склад клієнта
            </div>
            <div className="flex items-center gap-2.5">
              <span
                className="size-4 shrink-0 rounded-[4px] border-2 border-[#d85a30] bg-[#faece7]"
                aria-hidden="true"
              />
              Країна координації
            </div>
            <div className="flex items-center gap-2.5">
              <span
                className="size-4 shrink-0 rounded-[4px] border-2 border-[#1d9e75] bg-[#e1f5ee]"
                aria-hidden="true"
              />
              Україна — митне оформлення
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
}
