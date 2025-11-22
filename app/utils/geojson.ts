/**
 * GeoJSON utility functions
 * Handles loading, processing, and validation of GeoJSON data
 */

import { GeoJSONFeatureCollection, GeoJSONFeature } from '@/app/types/geojson';
import { DistrictData } from '@/app/data/districts';

/**
 * Load GeoJSON data from local public directory
 * @param path - Path to GeoJSON file relative to public directory
 * @returns Promise resolving to GeoJSON data
 * @throws Error if loading fails
 */
export async function loadGeoJSON(path: string): Promise<GeoJSONFeatureCollection> {
    try {
        const response = await fetch(path);

        if (!response.ok) {
            throw new Error(`Failed to load GeoJSON: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Basic validation
        if (!data || data.type !== 'FeatureCollection' || !Array.isArray(data.features)) {
            throw new Error('Invalid GeoJSON format');
        }

        return data as GeoJSONFeatureCollection;
    } catch (error) {
        console.error('Error loading GeoJSON:', error);
        throw error;
    }
}

/**
 * Filter GeoJSON features by province name
 * @param geoJson - Full GeoJSON data
 * @param provinceName - Province name in Thai
 * @returns Filtered features
 */
export function filterByProvince(
    geoJson: GeoJSONFeatureCollection,
    provinceName: string
): GeoJSONFeature[] {
    return geoJson.features.filter(
        (feature) => feature.properties.pro_th === provinceName
    );
}

/**
 * Merge district data with GeoJSON features
 * @param features - GeoJSON features
 * @param districts - District data array
 * @returns GeoJSON with merged properties
 */
export function mergeDistrictData(
    features: GeoJSONFeature[],
    districts: DistrictData[]
): GeoJSONFeatureCollection {
    const mergedFeatures = features.map((feature) => {
        // Normalize district name (remove "อำเภอ" prefix)
        const geoName = feature.properties.amp_th.replace('อำเภอ', '').trim();

        // Find matching district from our data
        const matchDistrict = districts.find(
            (d) => d.name.replace('อำเภอ', '').trim() === geoName
        );

        return {
            ...feature,
            properties: {
                ...feature.properties,
                ...matchDistrict,
                score: matchDistrict ? matchDistrict.score : 0,
                hasData: !!matchDistrict,
                matchId: matchDistrict?.id,
            },
        };
    });

    return {
        type: 'FeatureCollection',
        features: mergedFeatures,
    };
}

/**
 * Validate GeoJSON feature collection
 * @param data - Data to validate
 * @returns True if valid
 */
export function isValidGeoJSON(data: unknown): data is GeoJSONFeatureCollection {
    if (!data || typeof data !== 'object') return false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const geoData = data as any;
    return (
        geoData.type === 'FeatureCollection' &&
        Array.isArray(geoData.features) &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        geoData.features.every((f: any) => f.type === 'Feature' && f.properties && f.geometry)
    );
}
