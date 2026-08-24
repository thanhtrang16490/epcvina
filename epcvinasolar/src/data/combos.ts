// Combo catalog data - Solar solution packages
export interface LocalCombo {
  id: string;
  slug: string;
  name: string;
  system_type: 'on-grid' | 'hybrid';
  phase: '1-phase' | '3-phase';
  voltage?: 'low' | 'high' | null;
  power_kw: number;
  battery_kwh?: number;
  panel_brand?: string;
  panel_model?: string;
  inverter_brand?: string;
  inverter_model?: string;
  battery_brand?: string;
  battery_model?: string;
  investment_million_vnd: number;
  production_min_kwh: number;
  production_max_kwh: number;
  payback_years: number;
  payback_label: string;
  roof_area_m2?: number;
  is_active: boolean;
  display_order: number;
}

function parsePayback(s: string): number {
  const m = s.match(/(\d+)n(\d+)t/);
  if (!m) return 5;
  return parseInt(m[1]) + parseInt(m[2]) / 12;
}

function fmtPayback(s: string): string {
  const m = s.match(/(\d+)n(\d+)t/);
  if (!m) return s;
  const t = parseInt(m[2]);
  return t > 0 ? `${m[1]} năm ${t} tháng` : `${m[1]} năm`;
}

type EquipmentOverride = {
  inverter?: { brand: string; model: string; slug?: string };
  battery?: { brand: string; model: string; slug?: string };
};

function getEquipmentOverride(slug: string): EquipmentOverride | undefined {
  const exact: Record<string, EquipmentOverride> = {
    'hybrid-5kw-1pha-5kwh': {
      inverter: { brand: 'HOPETREK', model: 'SUN-SL-HP5K-A1', slug: 'bien-tan-hybrid-hopetrek-sun-sl-hp5k-a1-1-pha-221' },
      battery: { brand: 'HOPETREK', model: 'ESS-LB5-W05', slug: 'pin-luu-tru-hopetrek-5-12-kwh-ess-lb5-w05-225' },
    },
    'hybrid-5kw-1pha-10kwh': {
      inverter: { brand: 'HOPETREK', model: 'SUN-SL-HP5K-A1', slug: 'bien-tan-hybrid-hopetrek-sun-sl-hp5k-a1-1-pha-221' },
      battery: { brand: 'HOPETREK', model: 'ESS-LB16-W02', slug: 'pin-luu-tru-hopetrek-16-08-kwh-ess-lb16-w02-226' },
    },
    'hybrid-8.8kw-1pha-5kwh': {
      inverter: { brand: 'HOPETREK', model: 'SUN-SL-HP6K-A1', slug: 'bien-tan-hybrid-hopetrek-sun-sl-hp6k-a1-1-pha-222' },
      battery: { brand: 'HOPETREK', model: 'ESS-LB5-W05', slug: 'pin-luu-tru-hopetrek-5-12-kwh-ess-lb5-w05-225' },
    },
    'hybrid-8.8kw-1pha-10kwh': {
      inverter: { brand: 'HOPETREK', model: 'SUN-SL-HP6K-A1', slug: 'bien-tan-hybrid-hopetrek-sun-sl-hp6k-a1-1-pha-222' },
      battery: { brand: 'HOPETREK', model: 'ESS-LB16-W02', slug: 'pin-luu-tru-hopetrek-16-08-kwh-ess-lb16-w02-226' },
    },
    'hybrid-10.7kw-1pha-5kwh': {
      inverter: { brand: 'HOPETREK', model: 'SUN-SL-HP10K-A1', slug: 'bien-tan-hybrid-hopetrek-sun-sl-hp5k-a1-1-pha-221' },
      battery: { brand: 'HOPETREK', model: 'ESS-LB5-W05', slug: 'pin-luu-tru-hopetrek-5-12-kwh-ess-lb5-w05-225' },
    },
    'hybrid-8.8kw-1pha-16kwh': {
      inverter: { brand: 'HOPETREK', model: 'SUN-SL-HP6K-A1', slug: 'bien-tan-hybrid-hopetrek-sun-sl-hp6k-a1-1-pha-222' },
      battery: { brand: 'HOPETREK', model: 'ESS-LB16-W02', slug: 'pin-luu-tru-hopetrek-16-08-kwh-ess-lb16-w02-226' },
    },
    'hybrid-10.7kw-1pha-10kwh': {
      inverter: { brand: 'HOPETREK', model: 'SUN-SL-HP10K-A1', slug: 'bien-tan-hybrid-hopetrek-sun-sl-hp10k-a1-1-pha-223' },
      battery: { brand: 'HOPETREK', model: 'ESS-LB5-W05', slug: 'pin-luu-tru-hopetrek-5-12-kwh-ess-lb5-w05-225' },
    },
    'hybrid-11.2kw-1pha-16kwh': {
      inverter: { brand: 'HOPETREK', model: 'SUN-SL-HP10K-A1', slug: 'bien-tan-hybrid-hopetrek-sun-sl-hp10k-a1-1-pha-223' },
      battery: { brand: 'HOPETREK', model: 'ESS-LB16-W02', slug: 'pin-luu-tru-hopetrek-16-08-kwh-ess-lb16-w02-226' },
    },
    'hybrid-10.7kw-1pha-16kwh-v2': {
      inverter: { brand: 'HOPETREK', model: 'SUN-SL-HP10K-A1', slug: 'bien-tan-hybrid-hopetrek-sun-sl-hp10k-a1-1-pha-223' },
      battery: { brand: 'HOPETREK', model: 'ESS-LB16-W02', slug: 'pin-luu-tru-hopetrek-16-08-kwh-ess-lb16-w02-226' },
    },
    'hybrid-15.7kw-1pha-16kwh': {
      inverter: { brand: 'HOPETREK', model: 'SUN-SL-HP10K-A1', slug: 'bien-tan-hybrid-hopetrek-sun-sl-hp10k-a1-1-pha-223' },
      battery: { brand: 'HOPETREK', model: 'ESS-LB16-W02', slug: 'pin-luu-tru-hopetrek-16-08-kwh-ess-lb16-w02-226' },
    },
    'hybrid-18.8kw-1pha-16kwh': {
      inverter: { brand: 'HOPETREK', model: 'SUN-SL-HP10K-A1', slug: 'bien-tan-hybrid-hopetrek-sun-sl-hp10k-a1-1-pha-223' },
      battery: { brand: 'HOPETREK', model: 'ESS-LB16-W02', slug: 'pin-luu-tru-hopetrek-16-08-kwh-ess-lb16-w02-226' },
    },
    'hybrid-15.7kw-1pha-32kwh': {
      inverter: { brand: 'HOPETREK', model: 'SUN-SL-HP10K-A1', slug: 'bien-tan-hybrid-hopetrek-sun-sl-hp10k-a1-1-pha-223' },
      battery: { brand: 'HOPETREK', model: 'ESS-LB16-W02', slug: 'pin-luu-tru-hopetrek-16-08-kwh-ess-lb16-w02-226' },
    },
    'hybrid-24.4kw-1pha-32kwh': {
      inverter: { brand: 'HOPETREK', model: 'SUN-SL-HP10K-A1', slug: 'bien-tan-hybrid-hopetrek-sun-sl-hp10k-a1-1-pha-223' },
      battery: { brand: 'HOPETREK', model: 'ESS-LB16-W02', slug: 'pin-luu-tru-hopetrek-16-08-kwh-ess-lb16-w02-226' },
    },
    'hybrid-10.7kw-3pha-at-5kwh': {
      inverter: { brand: 'HOPETREK', model: 'SUN-TL-HP10K-A1', slug: 'bien-tan-hybrid-hopetrek-sun-tl-hp10k-a1-3-pha-223' },
      battery: { brand: 'HOPETREK', model: 'ESS-LB5-W05', slug: 'pin-luu-tru-hopetrek-5-12-kwh-ess-lb5-w05-225' },
    },
    'hybrid-10.7kw-3pha-at-16kwh': {
      inverter: { brand: 'HOPETREK', model: 'SUN-TL-HP10K-A1', slug: 'bien-tan-hybrid-hopetrek-sun-tl-hp10k-a1-3-pha-223' },
      battery: { brand: 'HOPETREK', model: 'ESS-LB16-W02', slug: 'pin-luu-tru-hopetrek-16-08-kwh-ess-lb16-w02-226' },
    },
    'hybrid-15.7kw-3pha-at-16kwh': {
      inverter: { brand: 'HOPETREK', model: 'SUN-TL-HP12K-A1', slug: 'bien-tan-hybrid-hopetrek-sun-tl-hp12k-a1-3-pha-224' },
      battery: { brand: 'HOPETREK', model: 'ESS-LB16-W02', slug: 'pin-luu-tru-hopetrek-16-08-kwh-ess-lb16-w02-226' },
    },
    'hybrid-24.4kw-3pha-at-16kwh': {
      inverter: { brand: 'HOPETREK', model: 'SUN-TL-HP12K-A1', slug: 'bien-tan-hybrid-hopetrek-sun-tl-hp12k-a1-3-pha-224' },
      battery: { brand: 'HOPETREK', model: 'ESS-LB16-W02', slug: 'pin-luu-tru-hopetrek-16-08-kwh-ess-lb16-w02-226' },
    },
    'hybrid-15.7kw-3pha-ac-15kwh': {
      inverter: { brand: 'SAJ', model: 'H2-12K-LT2', slug: 'bien-tan-hybrid-saj-12kw-3-pha-h2-12k-lt2-207' },
      battery: { brand: 'SAJ', model: 'EK60 B3 16kWh', slug: 'pin-luu-tru-saj-ek60-b3-16kwh-264' },
    },
    'hybrid-24.4kw-3pha-ac-15kwh': {
      inverter: { brand: 'SAJ', model: 'H2-16K-LT2', slug: 'bien-tan-hybrid-saj-16kw-3-pha-h2-16k-lt2-208' },
      battery: { brand: 'SAJ', model: 'EK60 B3 16kWh', slug: 'pin-luu-tru-saj-ek60-b3-16kwh-264' },
    },
    'on-grid-5kw-1pha': {
      inverter: { brand: 'SAJ', model: 'R6-6K-S3', slug: 'bien-tan-hoa-luoi-saj-6kw-1-pha-r6-6k-s3' },
    },
    'on-grid-8.8kw-1pha': {
      inverter: { brand: 'SAJ', model: 'R6-8K-S3' },
    },
    'on-grid-10.7kw-1pha': {
      inverter: { brand: 'SAJ', model: 'R6-10K-S3' },
    },
    'on-grid-10.7kw-3pha': {
      inverter: { brand: 'SAJ', model: 'R6-20K-T2-32', slug: 'bien-tan-hoa-luoi-saj-20kw-3-pha-r6-20k-t2-32-242' },
    },
    'on-grid-15.7kw-3pha': {
      inverter: { brand: 'SAJ', model: 'R6-20K-T2-32', slug: 'bien-tan-hoa-luoi-saj-20kw-3-pha-r6-20k-t2-32-242' },
    },
    'on-grid-18.8kw-3pha': {
      inverter: { brand: 'SAJ', model: 'R6-20K-T2-32', slug: 'bien-tan-hoa-luoi-saj-20kw-3-pha-r6-20k-t2-32-242' },
    },
    'on-grid-29.4kw-3pha': {
      inverter: { brand: 'SAJ', model: 'R6-50K-T4-32', slug: 'bien-tan-hoa-luoi-saj-50kw-3-pha-r6-50k-t4-32-261' },
    },
    'on-grid-48.8kw-3pha': {
      inverter: { brand: 'SAJ', model: 'R6-50K-T4-32', slug: 'bien-tan-hoa-luoi-saj-50kw-3-pha-r6-50k-t4-32-261' },
    },
    'on-grid-73.1kw-3pha': {
      inverter: { brand: 'SAJ', model: 'C6-99.9K-T9-40', slug: 'bien-tan-hoa-luoi-saj-99kw-3-pha-c6-99-9k-t9-40' },
    },
    'on-grid-97kw-3pha': {
      inverter: { brand: 'SAJ', model: 'C6-99.9K-T9-40', slug: 'bien-tan-hoa-luoi-saj-99kw-3-pha-c6-99-9k-t9-40' },
    },
  };

  return exact[slug];
}

function inferEquipment(combo: Pick<LocalCombo, 'system_type' | 'phase' | 'voltage' | 'power_kw' | 'battery_kwh' | 'slug'>) {
  const panel_brand = 'AIKO';
  const panel_model =
    combo.power_kw >= 48.75 ? 'Stellar 2N 78-232' :
    combo.power_kw >= 24.38 ? 'Stellar 2N 66-231' :
    'Stellar 2N 66-202';

  let inverter_brand = 'SAJ';
  let inverter_model = '';
  let battery_brand: string | undefined;
  let battery_model: string | undefined;
  let inverter_slug: string | undefined;
  let battery_slug: string | undefined;

  const override = getEquipmentOverride(combo.slug);
  if (override?.inverter) {
    inverter_brand = override.inverter.brand;
    inverter_model = override.inverter.model;
    inverter_slug = override.inverter.slug;
  }
  if (override?.battery) {
    battery_brand = override.battery.brand;
    battery_model = override.battery.model;
    battery_slug = override.battery.slug;
  }

  if (!override?.inverter) {
    if (combo.system_type === 'on-grid') {
    inverter_brand = 'SAJ';
    if (combo.phase === '1-phase') {
      if (combo.power_kw <= 5) inverter_model = 'R6-6K-S3';
      else if (combo.power_kw <= 8.75) inverter_model = 'R6-8K-S3';
      else inverter_model = 'R6-10K-S3';
    } else {
      if (combo.power_kw <= 20) inverter_model = 'R6-20K-T2-32';
      else if (combo.power_kw <= 50) inverter_model = 'R6-50K-T4-32';
      else inverter_model = 'C6-99.9K-T9-40';
    }
  } else {
    if (combo.voltage === 'low') {
      inverter_brand = 'HOPETREK';
    } else {
      inverter_brand = 'SAJ';
    }
    if (combo.phase === '1-phase') {
      if (combo.voltage === 'low') {
        if (combo.power_kw <= 5) inverter_model = 'SUN-SL-HP5K-A1';
        else if (combo.power_kw <= 8.75) inverter_model = 'SUN-SL-HP6K-A1';
        else if (combo.power_kw <= 10.63) inverter_model = 'SUN-SL-HP8K-A1';
        else inverter_model = 'SUN-SL-HP10K-A1';
      } else {
        if (combo.power_kw <= 5) inverter_model = 'H2-6K-LS2-S';
        else if (combo.power_kw <= 8.75) inverter_model = 'H2-8K-LS2';
        else if (combo.power_kw <= 10.63) inverter_model = 'H2-10K-LS2';
        else inverter_model = 'H2-12K-LS2';
      }
    } else if (combo.voltage === 'high') {
      inverter_model = combo.power_kw <= 15.63 ? 'H2-12K-LT2' : 'H2-16K-LT2';
      } else {
        if (combo.power_kw <= 10.63) inverter_model = 'SUN-TL-HP10K-A1';
        else inverter_model = 'SUN-TL-HP12K-A1';
      }
    }
  }

  if (!override?.battery && combo.system_type !== 'on-grid') {
    const batteryMap: Record<string, { brand: string; model: string }> = {
      '5.12': { brand: 'HOPETREK', model: 'ESS-LB5-W05' },
      '10.24': { brand: 'HOPETREK', model: 'ESS-LB5-W05' },
      '16': { brand: 'HOPETREK', model: 'ESS-LB16-W02' },
      '15.36': { brand: 'SAJ', model: 'EK60 B3 16kWh' },
      '32': { brand: 'HOPETREK', model: 'ESS-LB16-W02' },
    };

    const key = combo.battery_kwh ? String(combo.battery_kwh) : '';
    const battery = batteryMap[key];
    if (battery) {
      battery_brand = battery.brand;
      battery_model = battery.model;
      battery_slug = battery.model === 'EK60 B3 16kWh'
        ? 'pin-luu-tru-saj-ek60-b3-16kwh-264'
        : battery.model === 'ESS-LB16-W02'
          ? 'pin-luu-tru-hopetrek-16-08-kwh-ess-lb16-w02-226'
          : battery.model === 'ESS-LB5-W05'
            ? 'pin-luu-tru-hopetrek-5-12-kwh-ess-lb5-w05-225'
            : undefined;
    }
  }

  if (!inverter_slug) {
    inverter_slug =
      combo.system_type === 'on-grid'
        ? combo.phase === '1-phase'
          ? combo.power_kw <= 5
            ? 'bien-tan-hoa-luoi-saj-6kw-1-pha-r6-6k-s3'
            : combo.power_kw <= 8.75
              ? undefined
              : undefined
          : combo.power_kw <= 20
            ? 'bien-tan-hoa-luoi-saj-20kw-3-pha-r6-20k-t2-32-242'
            : combo.power_kw <= 50
              ? 'bien-tan-hoa-luoi-saj-50kw-3-pha-r6-50k-t4-32-261'
              : 'bien-tan-hoa-luoi-saj-99kw-3-pha-c6-99-9k-t9-40'
        : combo.phase === '1-phase'
          ? combo.voltage === 'low'
            ? combo.power_kw <= 5
              ? 'bien-tan-hybrid-hopetrek-sun-sl-hp5k-a1-1-pha-221'
              : combo.power_kw <= 8.75
                ? 'bien-tan-hybrid-hopetrek-sun-sl-hp6k-a1-1-pha-222'
                : combo.power_kw <= 10.63
                  ? 'bien-tan-hybrid-hopetrek-sun-sl-hp10k-a1-1-pha-223'
                  : 'bien-tan-hybrid-hopetrek-sun-sl-hp10k-a1-1-pha-223'
            : combo.power_kw <= 5
              ? 'bien-tan-hybrid-saj-6kw-1-pha-h2-6k-ls2-203'
              : combo.power_kw <= 8.75
                ? 'bien-tan-hybrid-saj-8kw-1-pha-h2-8k-ls2-204'
                : combo.power_kw <= 10.63
                  ? 'bien-tan-hybrid-saj-10kw-1-pha-h2-10k-ls2-205'
                  : 'bien-tan-hybrid-saj-12kw-1-pha-h2-12k-ls2-206'
          : combo.voltage === 'high'
            ? combo.power_kw <= 15.63
              ? 'bien-tan-hybrid-saj-12kw-3-pha-h2-12k-lt2-207'
              : 'bien-tan-hybrid-saj-16kw-3-pha-h2-16k-lt2-208'
            : combo.power_kw <= 10.63
              ? 'bien-tan-hybrid-hopetrek-sun-tl-hp10k-a1-3-pha-223'
              : 'bien-tan-hybrid-hopetrek-sun-tl-hp12k-a1-3-pha-224';
  }

  if (!battery_slug && battery_model) {
    battery_slug =
      battery_model === 'EK60 B3 16kWh'
        ? 'pin-luu-tru-saj-ek60-b3-16kwh-264'
        : battery_model === 'ESS-LB16-W02'
          ? 'pin-luu-tru-hopetrek-16-08-kwh-ess-lb16-w02-226'
          : battery_model === 'ESS-LB5-W05'
            ? 'pin-luu-tru-hopetrek-5-12-kwh-ess-lb5-w05-225'
            : battery_model === 'ES-BOX36 MAX'
              ? 'pin-luu-tru-genixgreen-16-08kwh-es-box36-max-247'
              : battery_model === 'ES-BOX12F MAX+'
                ? 'pin-luu-tru-genixgreen-16-08kwh-es-box12f-max-213'
                : battery_model === 'ES-BOX12F PLUS'
                  ? 'pin-luu-tru-genixgreen-10-24-kwh-es-box12f-plus-246'
                  : battery_model === 'ES-BOX12F'
                    ? 'pin-luu-tru-genixgreen-5-12kwh-es-box12f-245'
                    : undefined;
  }

  return {
    panel_brand,
    panel_model,
    panel_slug:
      combo.power_kw >= 48.75
        ? 'tam-pin-mat-troi-aiko-800w-mat-kinh-stellar-2n-78-232'
        : combo.power_kw >= 24.38
          ? 'tam-pin-mat-troi-aiko-680w-mat-kinh-stellar-2n-66-231'
          : 'tam-pin-mat-troi-aiko-650w-mat-kinh-stellar-2n-66-202',
    inverter_brand,
    inverter_model,
    inverter_slug,
    battery_brand,
    battery_model,
    battery_slug,
  };
}

function enrichCombo<T extends LocalCombo>(combo: T): T {
  return {
    ...combo,
    ...inferEquipment(combo),
  };
}

export const localCombos: LocalCombo[] = [
  // Hybrid 1-phase
  {
    id: 'h1p-5-5',
    slug: 'hybrid-5kw-1pha-5kwh',
    name: 'Hy-Brid 5 kWp 1pha – 5.12 kWh',
    system_type: 'hybrid',
    phase: '1-phase',
    voltage: null,
    power_kw: 5,
    battery_kwh: 5.12,
    investment_million_vnd: 100.5,
    production_min_kwh: 600,
    production_max_kwh: 600,
    payback_years: parsePayback('4n8t'),
    payback_label: fmtPayback('4n8t'),
    roof_area_m2: 21.6,
    is_active: true,
    display_order: 1,
  },
  {
    id: 'h1p-5-10',
    slug: 'hybrid-5kw-1pha-10kwh',
    name: 'Hy-Brid 5 kWp 1pha – 10.24 kWh',
    system_type: 'hybrid',
    phase: '1-phase',
    voltage: null,
    power_kw: 5,
    battery_kwh: 10.24,
    investment_million_vnd: 123.6,
    production_min_kwh: 600,
    production_max_kwh: 600,
    payback_years: parsePayback('6n10t'),
    payback_label: fmtPayback('6n10t'),
    roof_area_m2: 21.6,
    is_active: true,
    display_order: 2,
  },
  {
    id: 'h1p-88-5',
    slug: 'hybrid-8.8kw-1pha-5kwh',
    name: 'Hy-Brid 8.8 kWp 1pha – 5.12 kWh',
    system_type: 'hybrid',
    phase: '1-phase',
    voltage: null,
    power_kw: 8.75,
    battery_kwh: 5.12,
    investment_million_vnd: 125.2,
    production_min_kwh: 1050,
    production_max_kwh: 1050,
    payback_years: parsePayback('4n8t'),
    payback_label: fmtPayback('4n8t'),
    roof_area_m2: 37.8,
    is_active: true,
    display_order: 3,
  },
  {
    id: 'h1p-88-10',
    slug: 'hybrid-8.8kw-1pha-10kwh',
    name: 'Hy-Brid 8.8 kWp 1pha – 10.24 kWh',
    system_type: 'hybrid',
    phase: '1-phase',
    voltage: null,
    power_kw: 8.75,
    battery_kwh: 10.24,
    investment_million_vnd: 148.3,
    production_min_kwh: 1050,
    production_max_kwh: 1050,
    payback_years: parsePayback('4n10t'),
    payback_label: fmtPayback('4n10t'),
    roof_area_m2: 37.8,
    is_active: true,
    display_order: 4,
  },
  {
    id: 'h1p-107-5',
    slug: 'hybrid-10.7kw-1pha-5kwh',
    name: 'Hy-Brid 10.7 kWp 1pha – 5.12 kWh',
    system_type: 'hybrid',
    phase: '1-phase',
    voltage: null,
    power_kw: 10.63,
    battery_kwh: 5.12,
    investment_million_vnd: 151.4,
    production_min_kwh: 1276,
    production_max_kwh: 1276,
    payback_years: parsePayback('4n0t'),
    payback_label: fmtPayback('4n0t'),
    roof_area_m2: 45.9,
    is_active: true,
    display_order: 5,
  },
  {
    id: 'h1p-88-16',
    slug: 'hybrid-8.8kw-1pha-16kwh',
    name: 'Hy-Brid 8.8 kWp 1pha – 16 kWh',
    system_type: 'hybrid',
    phase: '1-phase',
    voltage: null,
    power_kw: 8.75,
    battery_kwh: 16,
    investment_million_vnd: 164.8,
    production_min_kwh: 1050,
    production_max_kwh: 1050,
    payback_years: parsePayback('6n2t'),
    payback_label: fmtPayback('6n2t'),
    roof_area_m2: 37.8,
    is_active: true,
    display_order: 6,
  },
  {
    id: 'h1p-107-10',
    slug: 'hybrid-10.7kw-1pha-10kwh',
    name: 'Hy-Brid 10.7 kWp 1pha – 10.24 kWh',
    system_type: 'hybrid',
    phase: '1-phase',
    voltage: null,
    power_kw: 10.63,
    battery_kwh: 10.24,
    investment_million_vnd: 174.5,
    production_min_kwh: 1276,
    production_max_kwh: 1276,
    payback_years: parsePayback('4n8t'),
    payback_label: fmtPayback('4n8t'),
    roof_area_m2: 45.9,
    is_active: true,
    display_order: 7,
  },
  {
    id: 'h1p-112-16',
    slug: 'hybrid-11.2kw-1pha-16kwh',
    name: 'Hy-Brid 11.2 kWp 1pha – 16 kWh',
    system_type: 'hybrid',
    phase: '1-phase',
    voltage: null,
    power_kw: 11.25,
    battery_kwh: 16,
    investment_million_vnd: 184.6,
    production_min_kwh: 1350,
    production_max_kwh: 1350,
    payback_years: parsePayback('4n11t'),
    payback_label: fmtPayback('4n11t'),
    roof_area_m2: 48.6,
    is_active: true,
    display_order: 8,
  },
  {
    id: 'h1p-107-16',
    slug: 'hybrid-10.7kw-1pha-16kwh-v2',
    name: 'Hy-Brid 10.7 kWp 1pha – 16 kWh',
    system_type: 'hybrid',
    phase: '1-phase',
    voltage: null,
    power_kw: 10.63,
    battery_kwh: 16,
    investment_million_vnd: 189.9,
    production_min_kwh: 1276,
    production_max_kwh: 1276,
    payback_years: parsePayback('5n1t'),
    payback_label: fmtPayback('5n1t'),
    roof_area_m2: 45.9,
    is_active: true,
    display_order: 9,
  },
  {
    id: 'h1p-157-16',
    slug: 'hybrid-15.7kw-1pha-16kwh',
    name: 'Hy-Brid 15.7 kWp 1pha – 16 kWh',
    system_type: 'hybrid',
    phase: '1-phase',
    voltage: null,
    power_kw: 15.63,
    battery_kwh: 16,
    investment_million_vnd: 230.8,
    production_min_kwh: 1876,
    production_max_kwh: 1876,
    payback_years: parsePayback('4n9t'),
    payback_label: fmtPayback('4n9t'),
    roof_area_m2: 67.5,
    is_active: true,
    display_order: 10,
  },
  {
    id: 'h1p-188-16',
    slug: 'hybrid-18.8kw-1pha-16kwh',
    name: 'Hy-Brid 18.8 kWp 1pha – 16 kWh',
    system_type: 'hybrid',
    phase: '1-phase',
    voltage: null,
    power_kw: 18.75,
    battery_kwh: 16,
    investment_million_vnd: 261.3,
    production_min_kwh: 2250,
    production_max_kwh: 2250,
    payback_years: parsePayback('4n10t'),
    payback_label: fmtPayback('4n10t'),
    roof_area_m2: 81,
    is_active: true,
    display_order: 11,
  },
  {
    id: 'h1p-157-32',
    slug: 'hybrid-15.7kw-1pha-32kwh',
    name: 'Hy-Brid 15.7 kWp 1pha – 32 kWh',
    system_type: 'hybrid',
    phase: '1-phase',
    voltage: null,
    power_kw: 15.63,
    battery_kwh: 32,
    investment_million_vnd: 293.5,
    production_min_kwh: 1876,
    production_max_kwh: 1876,
    payback_years: parsePayback('6n1t'),
    payback_label: fmtPayback('6n1t'),
    roof_area_m2: 67.5,
    is_active: true,
    display_order: 12,
  },
  {
    id: 'h1p-244-32',
    slug: 'hybrid-24.4kw-1pha-32kwh',
    name: 'Hy-Brid 24.4 kWp 1pha – 32 kWh',
    system_type: 'hybrid',
    phase: '1-phase',
    voltage: null,
    power_kw: 24.38,
    battery_kwh: 32,
    investment_million_vnd: 367.5,
    production_min_kwh: 2926,
    production_max_kwh: 2926,
    payback_years: parsePayback('4n11t'),
    payback_label: fmtPayback('4n11t'),
    roof_area_m2: 105.3,
    is_active: true,
    display_order: 13,
  },
  // Hybrid 3-phase low voltage
  {
    id: 'h3lv-107-5',
    slug: 'hybrid-10.7kw-3pha-at-5kwh',
    name: 'Hy-Brid 10.7 kWp 3pha AT – 5.12 kWh',
    system_type: 'hybrid',
    phase: '3-phase',
    voltage: 'low',
    power_kw: 10.63,
    battery_kwh: 5.12,
    investment_million_vnd: 177.1,
    production_min_kwh: 1276,
    production_max_kwh: 1276,
    payback_years: parsePayback('4n10t'),
    payback_label: fmtPayback('4n10t'),
    roof_area_m2: 45.9,
    is_active: true,
    display_order: 14,
  },
  {
    id: 'h3lv-107-16',
    slug: 'hybrid-10.7kw-3pha-at-16kwh',
    name: 'Hy-Brid 10.7 kWp 3pha AT – 16 kWh',
    system_type: 'hybrid',
    phase: '3-phase',
    voltage: 'low',
    power_kw: 10.63,
    battery_kwh: 16,
    investment_million_vnd: 215.6,
    production_min_kwh: 1276,
    production_max_kwh: 1276,
    payback_years: parsePayback('5n9t'),
    payback_label: fmtPayback('5n9t'),
    roof_area_m2: 45.9,
    is_active: true,
    display_order: 15,
  },
  {
    id: 'h3lv-157-16',
    slug: 'hybrid-15.7kw-3pha-at-16kwh',
    name: 'Hy-Brid 15.7 kWp 3pha AT – 16 kWh',
    system_type: 'hybrid',
    phase: '3-phase',
    voltage: 'low',
    power_kw: 15.63,
    battery_kwh: 16,
    investment_million_vnd: 247,
    production_min_kwh: 1876,
    production_max_kwh: 1876,
    payback_years: parsePayback('5n2t'),
    payback_label: fmtPayback('5n2t'),
    roof_area_m2: 67.5,
    is_active: true,
    display_order: 16,
  },
  {
    id: 'h3lv-244-16',
    slug: 'hybrid-24.4kw-3pha-at-16kwh',
    name: 'Hy-Brid 24.4 kWp 3pha AT – 16 kWh',
    system_type: 'hybrid',
    phase: '3-phase',
    voltage: 'low',
    power_kw: 24.38,
    battery_kwh: 16,
    investment_million_vnd: 321.8,
    production_min_kwh: 2926,
    production_max_kwh: 2926,
    payback_years: parsePayback('4n6t'),
    payback_label: fmtPayback('4n6t'),
    roof_area_m2: 105.3,
    is_active: true,
    display_order: 17,
  },
  // Hybrid 3-phase high voltage
  {
    id: 'h3hv-157-15',
    slug: 'hybrid-15.7kw-3pha-ac-15kwh',
    name: 'Hy-Brid 15.7 kWp 3pha AC – 15.36 kWh',
    system_type: 'hybrid',
    phase: '3-phase',
    voltage: 'high',
    power_kw: 15.63,
    battery_kwh: 15.36,
    investment_million_vnd: 271.7,
    production_min_kwh: 1876,
    production_max_kwh: 1876,
    payback_years: parsePayback('5n7t'),
    payback_label: fmtPayback('5n7t'),
    roof_area_m2: 67.5,
    is_active: true,
    display_order: 18,
  },
  {
    id: 'h3hv-244-15',
    slug: 'hybrid-24.4kw-3pha-ac-15kwh',
    name: 'Hy-Brid 24.4 kWp 3pha AC – 15.36 kWh',
    system_type: 'hybrid',
    phase: '3-phase',
    voltage: 'high',
    power_kw: 24.38,
    battery_kwh: 15.36,
    investment_million_vnd: 345.2,
    production_min_kwh: 2926,
    production_max_kwh: 2926,
    payback_years: parsePayback('4n10t'),
    payback_label: fmtPayback('4n10t'),
    roof_area_m2: 105.3,
    is_active: true,
    display_order: 19,
  },
  // On-Grid 1-phase
  {
    id: 'og1p-5',
    slug: 'on-grid-5kw-1pha',
    name: 'On-Grid 5 kWp 1 pha',
    system_type: 'on-grid',
    phase: '1-phase',
    voltage: null,
    power_kw: 5,
    investment_million_vnd: 60,
    production_min_kwh: 600,
    production_max_kwh: 600,
    payback_years: parsePayback('4n3t'),
    payback_label: fmtPayback('4n3t'),
    is_active: true,
    display_order: 20,
  },
  {
    id: 'og1p-88',
    slug: 'on-grid-8.8kw-1pha',
    name: 'On-Grid 8.8 kWp 1 pha',
    system_type: 'on-grid',
    phase: '1-phase',
    voltage: null,
    power_kw: 8.75,
    investment_million_vnd: 95,
    production_min_kwh: 1050,
    production_max_kwh: 1050,
    payback_years: parsePayback('2n11t'),
    payback_label: fmtPayback('2n11t'),
    is_active: true,
    display_order: 21,
  },
  {
    id: 'og1p-107',
    slug: 'on-grid-10.7kw-1pha',
    name: 'On-Grid 10.7 kWp 1 pha',
    system_type: 'on-grid',
    phase: '1-phase',
    voltage: null,
    power_kw: 10.63,
    investment_million_vnd: 110.7,
    production_min_kwh: 1276,
    production_max_kwh: 1276,
    payback_years: parsePayback('3n1t'),
    payback_label: fmtPayback('3n1t'),
    is_active: true,
    display_order: 22,
  },
  // On-Grid 3-phase
  {
    id: 'og3p-107',
    slug: 'on-grid-10.7kw-3pha',
    name: 'On-Grid 10.7 kWp 3 pha',
    system_type: 'on-grid',
    phase: '3-phase',
    voltage: null,
    power_kw: 10.63,
    investment_million_vnd: 108.4,
    production_min_kwh: 1276,
    production_max_kwh: 1276,
    payback_years: parsePayback('3n5t'),
    payback_label: fmtPayback('3n5t'),
    is_active: true,
    display_order: 23,
  },
  {
    id: 'og3p-157',
    slug: 'on-grid-15.7kw-3pha',
    name: 'On-Grid 15.7 kWp 3 pha',
    system_type: 'on-grid',
    phase: '3-phase',
    voltage: null,
    power_kw: 15.63,
    investment_million_vnd: 145.8,
    production_min_kwh: 1876,
    production_max_kwh: 1876,
    payback_years: parsePayback('3n5t'),
    payback_label: fmtPayback('3n5t'),
    is_active: true,
    display_order: 24,
  },
  {
    id: 'og3p-188',
    slug: 'on-grid-18.8kw-3pha',
    name: 'On-Grid 18.8 kWp 3 pha',
    system_type: 'on-grid',
    phase: '3-phase',
    voltage: null,
    power_kw: 18.75,
    investment_million_vnd: 167.2,
    production_min_kwh: 2250,
    production_max_kwh: 2250,
    payback_years: parsePayback('3n7t'),
    payback_label: fmtPayback('3n7t'),
    is_active: true,
    display_order: 25,
  },
  {
    id: 'og3p-294',
    slug: 'on-grid-29.4kw-3pha',
    name: 'On-Grid 29.4 kWp 3 pha',
    system_type: 'on-grid',
    phase: '3-phase',
    voltage: null,
    power_kw: 29.38,
    investment_million_vnd: 278,
    production_min_kwh: 3526,
    production_max_kwh: 3526,
    payback_years: parsePayback('2n7t'),
    payback_label: fmtPayback('2n7t'),
    is_active: true,
    display_order: 26,
  },
  {
    id: 'og3p-488',
    slug: 'on-grid-48.8kw-3pha',
    name: 'On-Grid 48.8 kWp 3 pha',
    system_type: 'on-grid',
    phase: '3-phase',
    voltage: null,
    power_kw: 48.75,
    investment_million_vnd: 440.6,
    production_min_kwh: 5850,
    production_max_kwh: 5850,
    payback_years: parsePayback('2n5t'),
    payback_label: fmtPayback('2n5t'),
    is_active: true,
    display_order: 27,
  },
  {
    id: 'og3p-731',
    slug: 'on-grid-73.1kw-3pha',
    name: 'On-Grid 73.1 kWp 3 pha',
    system_type: 'on-grid',
    phase: '3-phase',
    voltage: null,
    power_kw: 73.13,
    investment_million_vnd: 638.9,
    production_min_kwh: 8776,
    production_max_kwh: 8776,
    payback_years: parsePayback('2n5t'),
    payback_label: fmtPayback('2n5t'),
    is_active: true,
    display_order: 28,
  },
  {
    id: 'og3p-97',
    slug: 'on-grid-97kw-3pha',
    name: 'On-Grid 97 kWp 3 pha',
    system_type: 'on-grid',
    phase: '3-phase',
    voltage: null,
    power_kw: 96.88,
    investment_million_vnd: 827.5,
    production_min_kwh: 11626,
    production_max_kwh: 11626,
    payback_years: parsePayback('2n5t'),
    payback_label: fmtPayback('2n5t'),
    is_active: true,
    display_order: 29,
  },
].map(enrichCombo);

export function getCombos(filters?: {
  systemType?: string;
  phase?: string;
  voltage?: string;
  minPower?: number;
  maxPower?: number;
}): LocalCombo[] {
  let filtered = localCombos.filter(c => c.is_active);

  if (filters?.systemType && filters.systemType !== 'all') {
    filtered = filtered.filter(c => c.system_type === filters.systemType);
  }

  if (filters?.phase) {
    filtered = filtered.filter(c => c.phase === filters.phase);
  }

  if (filters?.voltage) {
    filtered = filtered.filter(c => c.voltage === filters.voltage);
  }

  if (filters?.minPower !== undefined) {
    filtered = filtered.filter(c => c.power_kw >= filters.minPower!);
  }

  if (filters?.maxPower !== undefined) {
    filtered = filtered.filter(c => c.power_kw <= filters.maxPower!);
  }

  return filtered.sort((a, b) => a.display_order - b.display_order).map(enrichCombo);
}

export function getComboBySlug(slug: string): LocalCombo | undefined {
  const combo = localCombos.find(c => c.slug === slug);
  return combo ? enrichCombo(combo) : undefined;
}
