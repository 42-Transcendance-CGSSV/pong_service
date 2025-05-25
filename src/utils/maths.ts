export function normalizePosition(position: number, max: number, min: number): number {
    return (position - min) / (max - min)
}

export function denormalizePosition(normalizedPosition: number, max: number, min: number): number {
    return normalizedPosition * (max - min) + min;
}