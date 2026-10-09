export type UnitCategory = "Length" | "Weight/Mass" | "Temperature" | "Volume" | "Area" | "Speed" | "Digital Storage" | "Time" | "Pressure" | "Energy";

export interface Unit {
  id: string;
  name: string;
  symbol: string;
  factor?: number; // Factor to convert to base unit
  toBase?: (val: number) => number; // Custom conversion to base
  fromBase?: (val: number) => number; // Custom conversion from base
}

export const unitsConfig: Record<UnitCategory, { baseUnit: string; units: Unit[] }> = {
  "Length": {
    baseUnit: "m",
    units: [
      { id: "m", name: "Meter", symbol: "m", factor: 1 },
      { id: "km", name: "Kilometer", symbol: "km", factor: 1000 },
      { id: "cm", name: "Centimeter", symbol: "cm", factor: 0.01 },
      { id: "mm", name: "Millimeter", symbol: "mm", factor: 0.001 },
      { id: "in", name: "Inch", symbol: "in", factor: 0.0254 },
      { id: "ft", name: "Foot", symbol: "ft", factor: 0.3048 },
      { id: "yd", name: "Yard", symbol: "yd", factor: 0.9144 },
      { id: "mi", name: "Mile", symbol: "mi", factor: 1609.344 },
    ],
  },
  "Weight/Mass": {
    baseUnit: "kg",
    units: [
      { id: "kg", name: "Kilogram", symbol: "kg", factor: 1 },
      { id: "g", name: "Gram", symbol: "g", factor: 0.001 },
      { id: "mg", name: "Milligram", symbol: "mg", factor: 0.000001 },
      { id: "lb", name: "Pound", symbol: "lb", factor: 0.45359237 },
      { id: "oz", name: "Ounce", symbol: "oz", factor: 0.0283495231 },
    ],
  },
  "Temperature": {
    baseUnit: "C",
    units: [
      { 
        id: "C", 
        name: "Celsius", 
        symbol: "°C", 
        toBase: (c) => c, 
        fromBase: (c) => c 
      },
      { 
        id: "F", 
        name: "Fahrenheit", 
        symbol: "°F", 
        toBase: (f) => (f - 32) * 5/9, 
        fromBase: (c) => (c * 9/5) + 32 
      },
      { 
        id: "K", 
        name: "Kelvin", 
        symbol: "K", 
        toBase: (k) => k - 273.15, 
        fromBase: (c) => c + 273.15 
      },
    ],
  },
  "Volume": {
    baseUnit: "L",
    units: [
      { id: "L", name: "Liter", symbol: "L", factor: 1 },
      { id: "mL", name: "Milliliter", symbol: "mL", factor: 0.001 },
      { id: "gal", name: "US Gallon", symbol: "gal", factor: 3.78541 },
      { id: "qt", name: "US Quart", symbol: "qt", factor: 0.946353 },
      { id: "pt", name: "US Pint", symbol: "pt", factor: 0.473176 },
      { id: "cup", name: "US Cup", symbol: "cup", factor: 0.236588 },
      { id: "fl_oz", name: "US Fluid Ounce", symbol: "fl oz", factor: 0.0295735 },
    ],
  },
  "Area": {
    baseUnit: "sq_m",
    units: [
      { id: "sq_m", name: "Square Meter", symbol: "m²", factor: 1 },
      { id: "sq_km", name: "Square Kilometer", symbol: "km²", factor: 1000000 },
      { id: "sq_cm", name: "Square Centimeter", symbol: "cm²", factor: 0.0001 },
      { id: "sq_in", name: "Square Inch", symbol: "sq in", factor: 0.00064516 },
      { id: "sq_ft", name: "Square Foot", symbol: "sq ft", factor: 0.092903 },
      { id: "sq_yd", name: "Square Yard", symbol: "sq yd", factor: 0.836127 },
      { id: "ac", name: "Acre", symbol: "ac", factor: 4046.86 },
      { id: "ha", name: "Hectare", symbol: "ha", factor: 10000 },
    ],
  },
  "Speed": {
    baseUnit: "m_s",
    units: [
      { id: "m_s", name: "Meter per second", symbol: "m/s", factor: 1 },
      { id: "km_h", name: "Kilometer per hour", symbol: "km/h", factor: 0.277778 },
      { id: "mi_h", name: "Mile per hour", symbol: "mph", factor: 0.44704 },
      { id: "kn", name: "Knot", symbol: "kn", factor: 0.514444 },
    ],
  },
  "Digital Storage": {
    baseUnit: "B",
    units: [
      { id: "b", name: "Bit", symbol: "b", factor: 0.125 },
      { id: "B", name: "Byte", symbol: "B", factor: 1 },
      { id: "KB", name: "Kilobyte", symbol: "KB", factor: 1024 },
      { id: "MB", name: "Megabyte", symbol: "MB", factor: 1048576 },
      { id: "GB", name: "Gigabyte", symbol: "GB", factor: 1073741824 },
      { id: "TB", name: "Terabyte", symbol: "TB", factor: 1099511627776 },
    ],
  },
  "Time": {
    baseUnit: "s",
    units: [
      { id: "ms", name: "Millisecond", symbol: "ms", factor: 0.001 },
      { id: "s", name: "Second", symbol: "s", factor: 1 },
      { id: "min", name: "Minute", symbol: "min", factor: 60 },
      { id: "h", name: "Hour", symbol: "h", factor: 3600 },
      { id: "d", name: "Day", symbol: "d", factor: 86400 },
      { id: "wk", name: "Week", symbol: "wk", factor: 604800 },
      { id: "mo", name: "Month (30 days)", symbol: "mo", factor: 2592000 },
      { id: "yr", name: "Year (365 days)", symbol: "yr", factor: 31536000 },
    ],
  },
  "Pressure": {
    baseUnit: "Pa",
    units: [
      { id: "Pa", name: "Pascal", symbol: "Pa", factor: 1 },
      { id: "hPa", name: "Hectopascal", symbol: "hPa", factor: 100 },
      { id: "kPa", name: "Kilopascal", symbol: "kPa", factor: 1000 },
      { id: "bar", name: "Bar", symbol: "bar", factor: 100000 },
      { id: "atm", name: "Atmosphere", symbol: "atm", factor: 101325 },
      { id: "psi", name: "Pound-force per sq inch", symbol: "psi", factor: 6894.76 },
      { id: "mmHg", name: "Millimeter of mercury", symbol: "mmHg", factor: 133.322 },
    ],
  },
  "Energy": {
    baseUnit: "J",
    units: [
      { id: "J", name: "Joule", symbol: "J", factor: 1 },
      { id: "kJ", name: "Kilojoule", symbol: "kJ", factor: 1000 },
      { id: "cal", name: "Gram calorie", symbol: "cal", factor: 4.184 },
      { id: "kcal", name: "Kilocalorie", symbol: "kcal", factor: 4184 },
      { id: "Wh", name: "Watt-hour", symbol: "Wh", factor: 3600 },
      { id: "kWh", name: "Kilowatt-hour", symbol: "kWh", factor: 3600000 },
    ],
  }
};

export const convertUnit = (value: number, fromId: string, toId: string, category: UnitCategory): number => {
  const cat = unitsConfig[category];
  const fromUnit = cat.units.find(u => u.id === fromId);
  const toUnit = cat.units.find(u => u.id === toId);

  if (!fromUnit || !toUnit) return 0;

  let baseValue = 0;
  if (fromUnit.toBase) {
    baseValue = fromUnit.toBase(value);
  } else if (fromUnit.factor !== undefined) {
    baseValue = value * fromUnit.factor;
  }

  if (toUnit.fromBase) {
    return toUnit.fromBase(baseValue);
  } else if (toUnit.factor !== undefined) {
    return baseValue / toUnit.factor;
  }

  return 0;
};
