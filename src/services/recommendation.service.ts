export enum ValueType {
  PERCENTAGE = "percentage",
  NUMBER = "number",
}

export enum DiscountType {
  POINTS = "points",
  CASHBACK = "cashback",
  DISCOUNT = "discount",
}

export type CreditCard = {
  id: number;
  name: string;
};

export type Business = {
  id: number;
  name: string;
};

export type Benefit = {
  businessId?: number;
  creditCardId: number;
  valueType: ValueType;
  discountType: DiscountType;
  value: number;
};

export type UserPreferences = {
  creditCardsIds: number[];
  discountType: DiscountType;
};

export type GradedBenefit = {
  benefit: Benefit;
  grade: number;
};

//TODO - need to take the pointsValue from the database. -> Remove after DB integration. line 74.
// Mapping points to money conversion based on credit card names
const pointsToMoneyMap: { [key: string]: number } = {
  0: 5, // for creditCardId 0, visa
  1: 2, // for creditCardId 1, isracard
  2: 7, // Assuming this was for a business ID, but not used in this context, burekas aagala
};

/**
 * Converts a benefit to a graded benefit based on user preferences and transaction price.
 * Adds a bonus for cashback benefits tied to a credit card.
 * @param {Benefit} benefit - The benefit to grade.
 * @param {UserPreferences} userPreferences - The user's preferences.
 * @param {number} transactionPrice - The price of the transaction.
 * @param {Benefit[]} allBenefits - The list of all benefits to check for credit card cashback.
 * @returns {number} - The grade of the benefit.
 */
const grading = (
  benefit: Benefit,
  userPreferences: UserPreferences,
  transactionPrice: number,
  allBenefits: Benefit[]
): number => {
  let grade = 0;
  // Find if the credit card itself has a cashback benefit
  const creditCardCashbackBenefit = allBenefits.find(
    (b) =>
      b.creditCardId === benefit.creditCardId &&
      b.discountType === DiscountType.CASHBACK &&
      !b.businessId
  );
  const cashbackBonus = creditCardCashbackBenefit
    ? creditCardCashbackBenefit.value
    : 0;

  switch (userPreferences.discountType) {
    case DiscountType.DISCOUNT:
      if (benefit.valueType === ValueType.PERCENTAGE) {
        grade =
          transactionPrice -
          transactionPrice * (benefit.value / 100) +
          cashbackBonus;
      } else {
        grade = transactionPrice - benefit.value + cashbackBonus;
      }
      break;
    case DiscountType.POINTS:
      //TODO - need to take the pointsValue from the database.
      const creditCardId =
        userPreferences.creditCardsIds.find(
          (cardId) => cardId === benefit.creditCardId
        ) || 0;
      const pointsValue = pointsToMoneyMap[creditCardId] || 0;
      grade = transactionPrice - benefit.value * pointsValue + cashbackBonus;
      break;
  }
  return grade;
};

/**
 * Sorts and grades benefits based on user preferences and transaction price.
 * @param {Benefit[]} benefits - The list of benefits to grade.
 * @param {UserPreferences} userPreferences - The user's preferences.
 * @param {number} transactionAmount - The price of the transaction.
 * @returns {GradedBenefit[]} - The list of graded benefits sorted in descending order of their grade.
 */
const getRecommendations = async (
  benefits: Benefit[],
  userPreferences: UserPreferences,
  transactionAmount: number
): Promise<GradedBenefit[]> => {
  const gradedBenefits = benefits
    .filter((benefit) =>
      userPreferences.creditCardsIds.includes(benefit.creditCardId)
    )
    .map((benefit) => ({
      benefit,
      grade: grading(benefit, userPreferences, transactionAmount, benefits),
    }));

  return gradedBenefits.sort((a, b) => a.grade - b.grade);
};

export default {
  getRecommendations,
};
