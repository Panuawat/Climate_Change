import { DistrictData } from '@/app/data/districts';

// Pseudo-random generator for consistent client/server values
const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

// Deterministic score generator
const getScore = (id: number, min: number, max: number, salt: number = 0) => {
    const random = seededRandom(id * 13 + salt * 7);
    return Math.floor(random * (max - min + 1)) + min;
};

/** Load real district data from the public folder */
export async function loadDistricts(): Promise<DistrictData[]> {
    const res = await fetch('/data/districts.json');
    if (!res.ok) {
        throw new Error(`Failed to load districts: ${res.status}`);
    }
    const rawData = (await res.json()) as Partial<DistrictData>[];

    // Enrich data with missing fields
    return rawData.map((d) => {
        // Ensure ID is a number
        const id = Number(d.id);
        const score = d.score ?? getScore(id, 40, 100, 0);

        // Generate status if missing
        let status: 'good' | 'mid' | 'bad' = d.status || 'mid';
        if (!d.status) {
            if (score >= 75) status = 'good';
            else if (score < 60) status = 'bad';
        }

        // Generate details if missing
        const disaster = d.details?.disaster ?? getScore(id, score - 10, score + 10, 1);
        const potential = d.details?.potential ?? getScore(id, score - 5, score + 15, 2);
        const resource = d.details?.resource ?? getScore(id, score - 15, score + 5, 3);
        const social = d.details?.social ?? getScore(id, score - 5, score + 10, 4);
        const people_view = getScore(id, score - 10, score + 10, 5); // Usually part of radar

        // Generate radar if missing
        const radar = d.radar || [
            { subject: 'ภัยธรรมชาติ', A: Math.min(100, disaster), fullMark: 100 },
            { subject: 'ศักยภาพการปรับตัว', A: Math.min(100, potential), fullMark: 100 },
            { subject: 'ทรัพยากรธรรมชาติ', A: Math.min(100, resource), fullMark: 100 },
            { subject: 'สังคม-เศรษฐกิจ', A: Math.min(100, social), fullMark: 100 },
            { subject: 'มุมมองประชาชน', A: Math.min(100, people_view), fullMark: 100 },
        ];

        return {
            ...d,
            id,
            score,
            status,
            radar,
            details: {
                disaster: Math.min(100, disaster),
                potential: Math.min(100, potential),
                resource: Math.min(100, resource),
                social: Math.min(100, social),
                ...d.details
            },
            // Keep existing descriptions or undefined (optional in interface)
        } as DistrictData;
    });
}
