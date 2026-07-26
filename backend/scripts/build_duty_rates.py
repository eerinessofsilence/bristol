#!/usr/bin/env python3
"""Build the runtime duty-rate dictionary from official tariff HTML exports."""

import argparse
import json
import re
import zipfile
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path

SOURCE_DOCUMENTS = [
    {
        "groups": "01-49",
        "url": "https://zakon.rada.gov.ua/laws/show/2697%D0%B0-20#Text",
    },
    {
        "groups": "50-97",
        "url": "https://zakon.rada.gov.ua/laws/show/2697%D0%B1-20#Text",
    },
]
NUMBER_PATTERN = re.compile(r"^\d+(?:[.,]\d+)?$")


class TariffTableParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.tables: list[list[list[str]]] = []
        self._table: list[list[str]] | None = None
        self._row: list[str] | None = None
        self._cell_parts: list[str] | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag == "table" and self._table is None:
            self._table = []
        elif tag == "tr" and self._table is not None:
            self._row = []
        elif tag in {"td", "th"} and self._row is not None:
            self._cell_parts = []

    def handle_data(self, data: str) -> None:
        if self._cell_parts is not None:
            self._cell_parts.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag in {"td", "th"} and self._cell_parts is not None:
            if self._row is not None:
                self._row.append(" ".join("".join(self._cell_parts).split()))
            self._cell_parts = None
        elif tag == "tr" and self._row is not None:
            if self._table is not None and self._row:
                self._table.append(self._row)
            self._row = None
        elif tag == "table" and self._table is not None:
            if self._table:
                self.tables.append(self._table)
            self._table = None


def _decode_html(content: bytes) -> str:
    header = content[:2000].decode("ascii", errors="ignore")
    match = re.search(r"charset=[\"']?([\w-]+)", header, re.IGNORECASE)
    encodings = [match.group(1)] if match else []
    encodings.extend(["utf-8-sig", "windows-1251"])
    for encoding in encodings:
        try:
            return content.decode(encoding)
        except (LookupError, UnicodeDecodeError):
            continue
    raise ValueError("Не вдалося визначити кодування HTML-файлу")


def _read_export(path: Path) -> str:
    if path.suffix.lower() != ".zip":
        return _decode_html(path.read_bytes())

    with zipfile.ZipFile(path) as archive:
        members = [
            name
            for name in archive.namelist()
            if Path(name).suffix.lower() in {".htm", ".html"}
        ]
        if len(members) != 1:
            raise ValueError(f"{path}: ZIP має містити один HTML-файл")
        return _decode_html(archive.read(members[0]))


def _extract_rates(html: str, wanted_codes: set[str]) -> dict[str, dict[str, object]]:
    parser = TariffTableParser()
    parser.feed(html)
    result: dict[str, dict[str, float]] = {}

    for table in parser.tables:
        headings = {cell for row in table[:3] for cell in row}
        if "пільгова" not in headings:
            continue

        preferential_index = 3 if "преференційна" in headings else 2
        full_index = preferential_index + 1
        for row in table:
            code = re.sub(r"\D", "", row[0]) if row else ""
            if len(code) != 10 or code not in wanted_codes or len(row) <= full_index:
                continue

            preferential_raw = row[preferential_index]
            full_raw = row[full_index]
            if not NUMBER_PATTERN.fullmatch(preferential_raw):
                raise ValueError(
                    f"{code}: непідтримувана пільгова ставка {preferential_raw!r}"
                )
            if not full_raw:
                raise ValueError(f"{code}: відсутня повна ставка")

            rate = {
                "preferentialPercent": float(preferential_raw.replace(",", ".")),
                "fullRate": full_raw,
                "additionalUnit": (
                    row[full_index + 1] if len(row) > full_index + 1 else ""
                ),
            }
            previous = result.get(code)
            if previous is not None and previous != rate:
                raise ValueError(f"{code}: знайдено суперечливі ставки")
            result[code] = rate

    return result


def main() -> None:
    backend_dir = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser()
    parser.add_argument("--groups-01-49", type=Path, required=True)
    parser.add_argument("--groups-50-97", type=Path, required=True)
    parser.add_argument(
        "--risk-prices",
        type=Path,
        default=backend_dir / "app" / "data" / "risk_prices.json",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=backend_dir / "app" / "data" / "duty_rates.json",
    )
    args = parser.parse_args()

    risk_data = json.loads(args.risk_prices.read_text(encoding="utf-8"))
    wanted_codes = set(risk_data["pricesUsdPerKg"])
    rates = {}
    rates.update(_extract_rates(_read_export(args.groups_01_49), wanted_codes))
    rates.update(_extract_rates(_read_export(args.groups_50_97), wanted_codes))

    missing = sorted(wanted_codes - rates.keys())
    if missing:
        preview = ", ".join(missing[:20])
        raise ValueError(f"Не знайдено {len(missing)} кодів: {preview}")

    output = {
        "source": (
            "Закон України «Про Митний тариф України» № 2697-IX"
        ),
        "sourceDocuments": SOURCE_DOCUMENTS,
        "effectiveFrom": "2023-01-01",
        "retrievedAt": datetime.now(timezone.utc).date().isoformat(),
        "defaultRate": "пільгова",
        "countryPreferencesIncluded": False,
        "rateUnit": "percent",
        "rates": {code: rates[code] for code in sorted(rates)},
    }
    args.output.write_text(
        json.dumps(output, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Записано {len(rates)} ставок у {args.output}")


if __name__ == "__main__":
    main()
