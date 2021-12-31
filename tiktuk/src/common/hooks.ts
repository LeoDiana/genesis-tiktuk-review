export const useShorterNumber = (num: number) => {
    return Intl.NumberFormat('en', {notation: 'compact'}).format(num);
}