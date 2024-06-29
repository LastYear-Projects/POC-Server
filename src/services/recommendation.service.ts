import mongoose, { Types } from "mongoose";
import { PopulatedBenefit } from "../controllers/recommendation.controller";
import { DiscountType, IBenefit, ValueType } from "../models/Benefit.model";
import { ProfitType, UserPreferences } from "../models/User.Model";

const userPreferenceModifier = 3;

export type EvaluatedCreditCard = {
  creditCardId: mongoose.Schema.Types.ObjectId;
  grade: number;
  profit: number;
};

const calculateBenefitGradeAndProfit = (
  benefit: IBenefit,
  transactionPrice: number,
  userPreferences: UserPreferences
): number[] => {
  let profit = 0;
  let grade = 0;

  switch (benefit.discountType) {
    case DiscountType.DISCOUNT:
      profit =
        benefit.valueType === ValueType.PERCENTAGE
          ? transactionPrice * (benefit.value / 100)
          : benefit.value;
      grade = 
        userPreferences.profitType === ProfitType.LOWEST_PRICE
        ? profit * 3
        : profit
      break;

    case DiscountType.POINTS:
      const pointToMoneyValue = benefit.creditCardId.pointValue;
      profit = benefit.value * pointToMoneyValue;
      grade = 
        userPreferences.profitType === ProfitType.POINTS
        ? profit * 3
        : profit
      break;
  }
  return [grade, profit];
};

const evaluateCreditCardsWithCashBack = (
  userPreferences: UserPreferences,
  transactionAmount: number,
  benefits: IBenefit[]
): EvaluatedCreditCard[] => {
  return userPreferences.cardsPreference.map((creditCard) => {
    let grade = 0
    let profit = 0
    const cashbackBenefits = benefits.filter((benefit: IBenefit) => {
      benefit.creditCardId === creditCard &&
      benefit.discountType === DiscountType.CASHBACK
    })
    cashbackBenefits.forEach((cashbackBenefit) => {
      profit += cashbackBenefit.valueType === ValueType.PERCENTAGE
      ? transactionAmount * (cashbackBenefit.value / 100)
      : cashbackBenefit.value;
    })
    grade = userPreferences.profitType === ProfitType.LOWEST_PRICE
    ? profit * 3
    : profit
    return {
      creditCardId: creditCard,
      grade: grade,
      profit: profit,
    };
  });
};

const gradeBenefits = (
  benefits: IBenefit[],
  transactionAmount: number,
  userPreferences: UserPreferences
) => {
  return benefits.map((benefit) => {
    const calculatedGrade = calculateBenefitGradeAndProfit(benefit, transactionAmount, userPreferences)
    const grade = calculatedGrade[0]
    const profit = calculatedGrade[1]
    return {benefit,grade,profit}
  });
};

const findBestBenefit = (
  gradedBenefits: { benefit: IBenefit; grade: number; profit: number }[],
  creditCardId: Types.ObjectId
) => {
  return gradedBenefits
    .filter(
      (mapObject) =>
        mapObject.benefit.creditCardId === creditCardId
    )
    .sort((a, b) => b.grade - a.grade)[0];
};

const getRecommendations = (
  populatedBenefits: IBenefit[],
  userPreferences: UserPreferences,
  transactionAmount: number
): EvaluatedCreditCard[] => {
  const evaluatedCreditCards = evaluateCreditCardsWithCashBack(
    userPreferences,
    transactionAmount,
    populatedBenefits
  );

  const gradedBenefits = gradeBenefits(
    populatedBenefits,
    transactionAmount,
    userPreferences
  );

  evaluatedCreditCards.forEach((evaluatedCreditCard) => {
    const bestBenefitMapObject = findBestBenefit(
      gradedBenefits,
      evaluatedCreditCard.creditCardId
    );
    if (bestBenefitMapObject) {
      evaluatedCreditCard.grade += bestBenefitMapObject.grade;
      evaluatedCreditCard.profit += bestBenefitMapObject.profit;
    }
  });

  return evaluatedCreditCards;
};

export default {
  getRecommendations,
};
