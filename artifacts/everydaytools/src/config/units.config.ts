export interface UnitDef {
  id: string;
  name: string;
  symbol: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}
export interface UnitCategory {
  id: string;
  name: string;
  units: UnitDef[];
}

export const UNIT_CATEGORIES = [
  {
    id: "length",
    name: "Length",
    units: [
      { id: "meter", name: "Meter", symbol: "m", toBase: v => v, fromBase: v => v },
      { id: "kilometer", name: "Kilometer", symbol: "km", toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: "centimeter", name: "Centimeter", symbol: "cm", toBase: v => v / 100, fromBase: v => v * 100 },
      { id: "millimeter", name: "Millimeter", symbol: "mm", toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: "mile", name: "Mile", symbol: "mi", toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
      { id: "yard", name: "Yard", symbol: "yd", toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
      { id: "foot", name: "Foot", symbol: "ft", toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
      { id: "inch", name: "Inch", symbol: "in", toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
      { id: "nautical-mile", name: "Nautical Mile", symbol: "nmi", toBase: v => v * 1852, fromBase: v => v / 1852 },
      { id: "light-year", name: "Light Year", symbol: "ly", toBase: v => v * 9460730472580800, fromBase: v => v / 9460730472580800 }
    ]
  },
  {
    id: "weight",
    name: "Weight",
    units: [
      { id: "kilogram", name: "Kilogram", symbol: "kg", toBase: v => v, fromBase: v => v },
      { id: "gram", name: "Gram", symbol: "g", toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: "milligram", name: "Milligram", symbol: "mg", toBase: v => v / 1000000, fromBase: v => v * 1000000 },
      { id: "pound", name: "Pound", symbol: "lb", toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
      { id: "ounce", name: "Ounce", symbol: "oz", toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
      { id: "stone", name: "Stone", symbol: "st", toBase: v => v * 6.35029, fromBase: v => v / 6.35029 },
      { id: "ton-metric", name: "Ton (Metric)", symbol: "t", toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: "ton-imperial", name: "Ton (Imperial)", symbol: "ton", toBase: v => v * 1016.05, fromBase: v => v / 1016.05 },
      { id: "ton-us", name: "Ton (US)", symbol: "ton", toBase: v => v * 907.185, fromBase: v => v / 907.185 }
    ]
  },
  {
    id: "temperature",
    name: "Temperature",
    units: [
      { id: "celsius", name: "Celsius", symbol: "°C", toBase: v => v, fromBase: v => v },
      { id: "fahrenheit", name: "Fahrenheit", symbol: "°F", toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
      { id: "kelvin", name: "Kelvin", symbol: "K", toBase: v => v - 273.15, fromBase: v => v + 273.15 }
    ]
  },
  {
    id: "volume",
    name: "Volume",
    units: [
      { id: "liter", name: "Liter", symbol: "L", toBase: v => v, fromBase: v => v },
      { id: "milliliter", name: "Milliliter", symbol: "mL", toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: "gallon-us", name: "Gallon (US)", symbol: "gal", toBase: v => v * 3.78541, fromBase: v => v / 3.78541 },
      { id: "gallon-uk", name: "Gallon (UK)", symbol: "gal", toBase: v => v * 4.54609, fromBase: v => v / 4.54609 },
      { id: "quart", name: "Quart", symbol: "qt", toBase: v => v * 0.946353, fromBase: v => v / 0.946353 },
      { id: "pint", name: "Pint", symbol: "pt", toBase: v => v * 0.473176, fromBase: v => v / 0.473176 },
      { id: "cup", name: "Cup", symbol: "cup", toBase: v => v * 0.24, fromBase: v => v / 0.24 },
      { id: "fluid-ounce", name: "Fluid Ounce", symbol: "fl oz", toBase: v => v * 0.0295735, fromBase: v => v / 0.0295735 },
      { id: "tablespoon", name: "Tablespoon", symbol: "tbsp", toBase: v => v * 0.0147868, fromBase: v => v / 0.0147868 },
      { id: "teaspoon", name: "Teaspoon", symbol: "tsp", toBase: v => v * 0.00492892, fromBase: v => v / 0.00492892 },
      { id: "cubic-meter", name: "Cubic Meter", symbol: "m³", toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: "cubic-centimeter", name: "Cubic Centimeter", symbol: "cm³", toBase: v => v / 1000, fromBase: v => v * 1000 }
    ]
  },
  {
    id: "area",
    name: "Area",
    units: [
      { id: "square-meter", name: "Square Meter", symbol: "m²", toBase: v => v, fromBase: v => v },
      { id: "square-kilometer", name: "Square Kilometer", symbol: "km²", toBase: v => v * 1000000, fromBase: v => v / 1000000 },
      { id: "square-centimeter", name: "Square Centimeter", symbol: "cm²", toBase: v => v / 10000, fromBase: v => v * 10000 },
      { id: "square-millimeter", name: "Square Millimeter", symbol: "mm²", toBase: v => v / 1000000, fromBase: v => v * 1000000 },
      { id: "square-mile", name: "Square Mile", symbol: "mi²", toBase: v => v * 2589988.11, fromBase: v => v / 2589988.11 },
      { id: "square-yard", name: "Square Yard", symbol: "yd²", toBase: v => v * 0.836127, fromBase: v => v / 0.836127 },
      { id: "square-foot", name: "Square Foot", symbol: "ft²", toBase: v => v * 0.092903, fromBase: v => v / 0.092903 },
      { id: "square-inch", name: "Square Inch", symbol: "in²", toBase: v => v * 0.00064516, fromBase: v => v / 0.00064516 },
      { id: "hectare", name: "Hectare", symbol: "ha", toBase: v => v * 10000, fromBase: v => v / 10000 },
      { id: "acre", name: "Acre", symbol: "ac", toBase: v => v * 4046.86, fromBase: v => v / 4046.86 }
    ]
  },
  {
    id: "speed",
    name: "Speed",
    units: [
      { id: "meter-second", name: "Meter / Second", symbol: "m/s", toBase: v => v, fromBase: v => v },
      { id: "kilometer-hour", name: "Kilometer / Hour", symbol: "km/h", toBase: v => v / 3.6, fromBase: v => v * 3.6 },
      { id: "mile-hour", name: "Mile / Hour", symbol: "mph", toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
      { id: "knot", name: "Knot", symbol: "kn", toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
      { id: "foot-second", name: "Foot / Second", symbol: "ft/s", toBase: v => v * 0.3048, fromBase: v => v / 0.3048 }
    ]
  },
  {
    id: "pressure",
    name: "Pressure",
    units: [
      { id: "pascal", name: "Pascal", symbol: "Pa", toBase: v => v, fromBase: v => v },
      { id: "kilopascal", name: "Kilopascal", symbol: "kPa", toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: "megapascal", name: "Megapascal", symbol: "MPa", toBase: v => v * 1000000, fromBase: v => v / 1000000 },
      { id: "bar", name: "Bar", symbol: "bar", toBase: v => v * 100000, fromBase: v => v / 100000 },
      { id: "millibar", name: "Millibar", symbol: "mbar", toBase: v => v * 100, fromBase: v => v / 100 },
      { id: "psi", name: "PSI", symbol: "psi", toBase: v => v * 6894.76, fromBase: v => v / 6894.76 },
      { id: "atm", name: "Atmosphere", symbol: "atm", toBase: v => v * 101325, fromBase: v => v / 101325 },
      { id: "torr", name: "Torr", symbol: "Torr", toBase: v => v * 133.322, fromBase: v => v / 133.322 },
      { id: "mmhg", name: "Millimeter of Mercury", symbol: "mmHg", toBase: v => v * 133.322, fromBase: v => v / 133.322 }
    ]
  },
  {
    id: "energy",
    name: "Energy",
    units: [
      { id: "joule", name: "Joule", symbol: "J", toBase: v => v, fromBase: v => v },
      { id: "kilojoule", name: "Kilojoule", symbol: "kJ", toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: "megajoule", name: "Megajoule", symbol: "MJ", toBase: v => v * 1000000, fromBase: v => v / 1000000 },
      { id: "calorie", name: "Calorie", symbol: "cal", toBase: v => v * 4.184, fromBase: v => v / 4.184 },
      { id: "kilocalorie", name: "Kilocalorie", symbol: "kcal", toBase: v => v * 4184, fromBase: v => v / 4184 },
      { id: "watt-hour", name: "Watt Hour", symbol: "Wh", toBase: v => v * 3600, fromBase: v => v / 3600 },
      { id: "kilowatt-hour", name: "Kilowatt Hour", symbol: "kWh", toBase: v => v * 3600000, fromBase: v => v / 3600000 },
      { id: "electron-volt", name: "Electron Volt", symbol: "eV", toBase: v => v * 1.60218e-19, fromBase: v => v / 1.60218e-19 },
      { id: "btu", name: "BTU", symbol: "BTU", toBase: v => v * 1055.06, fromBase: v => v / 1055.06 }
    ]
  },
  {
    id: "power",
    name: "Power",
    units: [
      { id: "watt", name: "Watt", symbol: "W", toBase: v => v, fromBase: v => v },
      { id: "kilowatt", name: "Kilowatt", symbol: "kW", toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: "megawatt", name: "Megawatt", symbol: "MW", toBase: v => v * 1000000, fromBase: v => v / 1000000 },
      { id: "horsepower-metric", name: "Horsepower (Metric)", symbol: "PS", toBase: v => v * 735.499, fromBase: v => v / 735.499 },
      { id: "horsepower-imperial", name: "Horsepower (Imperial)", symbol: "hp", toBase: v => v * 745.7, fromBase: v => v / 745.7 },
      { id: "btu-hour", name: "BTU / Hour", symbol: "BTU/h", toBase: v => v * 0.293071, fromBase: v => v / 0.293071 }
    ]
  },
  {
    id: "data",
    name: "Data",
    units: [
      { id: "byte", name: "Byte", symbol: "B", toBase: v => v, fromBase: v => v },
      { id: "bit", name: "Bit", symbol: "b", toBase: v => v / 8, fromBase: v => v * 8 },
      { id: "kilobyte", name: "Kilobyte", symbol: "KB", toBase: v => v * 1024, fromBase: v => v / 1024 },
      { id: "megabyte", name: "Megabyte", symbol: "MB", toBase: v => v * 1048576, fromBase: v => v / 1048576 },
      { id: "gigabyte", name: "Gigabyte", symbol: "GB", toBase: v => v * 1073741824, fromBase: v => v / 1073741824 },
      { id: "terabyte", name: "Terabyte", symbol: "TB", toBase: v => v * 1099511627776, fromBase: v => v / 1099511627776 },
      { id: "kibibyte", name: "Kibibyte", symbol: "KiB", toBase: v => v * 1024, fromBase: v => v / 1024 },
      { id: "mebibyte", name: "Mebibyte", symbol: "MiB", toBase: v => v * 1048576, fromBase: v => v / 1048576 },
      { id: "gibibyte", name: "Gibibyte", symbol: "GiB", toBase: v => v * 1073741824, fromBase: v => v / 1073741824 },
      { id: "tebibyte", name: "Tebibyte", symbol: "TiB", toBase: v => v * 1099511627776, fromBase: v => v / 1099511627776 }
    ]
  },
  {
    id: "time",
    name: "Time",
    units: [
      { id: "second", name: "Second", symbol: "s", toBase: v => v, fromBase: v => v },
      { id: "millisecond", name: "Millisecond", symbol: "ms", toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: "microsecond", name: "Microsecond", symbol: "μs", toBase: v => v / 1000000, fromBase: v => v * 1000000 },
      { id: "minute", name: "Minute", symbol: "min", toBase: v => v * 60, fromBase: v => v / 60 },
      { id: "hour", name: "Hour", symbol: "h", toBase: v => v * 3600, fromBase: v => v / 3600 },
      { id: "day", name: "Day", symbol: "d", toBase: v => v * 86400, fromBase: v => v / 86400 },
      { id: "week", name: "Week", symbol: "wk", toBase: v => v * 604800, fromBase: v => v / 604800 },
      { id: "month", name: "Month", symbol: "mo", toBase: v => v * 2629746, fromBase: v => v / 2629746 },
      { id: "year", name: "Year", symbol: "y", toBase: v => v * 31556952, fromBase: v => v / 31556952 }
    ]
  },
  {
    id: "angle",
    name: "Angle",
    units: [
      { id: "degree", name: "Degree", symbol: "°", toBase: v => v, fromBase: v => v },
      { id: "radian", name: "Radian", symbol: "rad", toBase: v => v * 180 / Math.PI, fromBase: v => v * Math.PI / 180 },
      { id: "gradian", name: "Gradian", symbol: "grad", toBase: v => v * 0.9, fromBase: v => v / 0.9 },
      { id: "arcminute", name: "Arcminute", symbol: "'", toBase: v => v / 60, fromBase: v => v * 60 },
      { id: "arcsecond", name: "Arcsecond", symbol: "''", toBase: v => v / 3600, fromBase: v => v * 3600 }
    ]
  },
  {
    id: "frequency",
    name: "Frequency",
    units: [
      { id: "hertz", name: "Hertz", symbol: "Hz", toBase: v => v, fromBase: v => v },
      { id: "kilohertz", name: "Kilohertz", symbol: "kHz", toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: "megahertz", name: "Megahertz", symbol: "MHz", toBase: v => v * 1000000, fromBase: v => v / 1000000 },
      { id: "gigahertz", name: "Gigahertz", symbol: "GHz", toBase: v => v * 1000000000, fromBase: v => v / 1000000000 },
      { id: "rpm", name: "RPM", symbol: "rpm", toBase: v => v / 60, fromBase: v => v * 60 }
    ]
  }
];
