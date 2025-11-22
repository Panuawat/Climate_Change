/**
 * Color utilities for Climate Change Dashboard
 * Centralized color mapping based on climate resilience scores
 */

/**
 * Color constants for different score ranges
 */
export const SCORE_COLORS = {
    EXCELLENT: '#1B5E20',  // Dark green (80-100)
    GOOD: '#4CAF50',       // Green (70-79)
    MODERATE: '#FFC107',   // Yellow (60-69)
    FAIR: '#FF9800',       // Orange (50-59)
    POOR: '#F44336',       // Red (0-49)
} as const;

/**
 * Get color based on climate resilience score
 * @param score - Climate resilience score (0-100)
 * @returns Hex color code
 */
export const getScoreColor = (score: number): string => {
    if (score >= 80) return SCORE_COLORS.EXCELLENT;
    if (score >= 70) return SCORE_COLORS.GOOD;
    if (score >= 60) return SCORE_COLORS.MODERATE;
    if (score >= 50) return SCORE_COLORS.FAIR;
    return SCORE_COLORS.POOR;
};

/**
 * Get status text based on score
 * @param score - Climate resilience score (0-100)
 * @returns Status text in Thai
 */
export const getScoreStatus = (score: number): string => {
    if (score >= 80) return 'ดีเยี่ยม';
    if (score >= 70) return 'ดี';
    if (score >= 60) return 'ปานกลาง';
    if (score >= 50) return 'พอใช้';
    return 'ต้องปรับปรุง';
};

/**
 * Get status type based on score
 * @param score - Climate resilience score (0-100)
 * @returns Status type
 */
export const getScoreStatusType = (score: number): 'good' | 'mid' | 'bad' => {
    if (score >= 75) return 'good';
    if (score >= 60) return 'mid';
    return 'bad';
};
