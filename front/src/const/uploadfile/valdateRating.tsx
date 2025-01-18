export const validateRating = (value: number) => {
    if (value < 1 || value > 5) {
        return "评分范围只能位于(1-5)" as any;
    }
    return Promise.resolve();
};
