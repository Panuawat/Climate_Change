/**
 * TypeScript interfaces for GeoJSON data structures
 * Used for Thailand districts GeoJSON data
 */

export interface GeoJSONProperties {
    // Original GeoJSON properties
    amp_th: string;      // District name in Thai
    pro_th: string;      // Province name in Thai
    amp_en?: string;     // District name in English
    pro_en?: string;     // Province name in English

    // Extended properties from our app
    id?: number;
    name?: string;
    score: number;
    hasData: boolean;
    matchId?: number;

    // Category scores
    disaster?: number;
    potential?: number;
    resource?: number;
    social?: number;

    // Extended district data
    lat?: number;
    lng?: number;
    status?: 'good' | 'mid' | 'bad';
    details?: {
        disaster: number;
        potential: number;
        resource: number;
        social: number;
    };
}

export interface GeoJSONGeometry {
    type: string;
    coordinates: number[] | number[][] | number[][][] | number[][][][]; // Complex nested arrays
}

export interface GeoJSONFeature {
    type: 'Feature';
    properties: GeoJSONProperties;
    geometry: GeoJSONGeometry;
}

export interface GeoJSONFeatureCollection {
    type: 'FeatureCollection';
    features: GeoJSONFeature[];
}
