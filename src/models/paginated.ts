
export default interface Paginated<T> {
    resultsPerPage?: number,
    totalResults?: number,
    totalPages?: number,
    results: T[]
}