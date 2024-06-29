import mongoose from "mongoose";
import { PopulatedBenefit } from "../controllers/recommendation.controller";
import { DiscountType, IBenefit, ValueType } from "../models/Benefit.model";
import { UserPreferences } from "../models/User.Model";

export type EvaluatedCreditCard = {
  creditCardId: mongoose.Schema.Types.ObjectId;
  grade: number;
  profit: number;
};

const calculateGrade = (
  benefit: IBenefit,
  transactionPrice: number
): number => {
  let grade = 0;

  switch (benefit.discountType) {
    case DiscountType.DISCOUNT:
      if (benefit.valueType === ValueType.PERCENTAGE) {
        grade = transactionPrice - transactionPrice * (benefit.value / 100);
      } else {
        grade = transactionPrice - benefit.value;
      }
      break;
    case DiscountType.POINTS:
      const pointToMoneyValue = benefit.creditCardId.pointValue;
      grade = transactionPrice - benefit.value * pointToMoneyValue;
      break;
  }
  return transactionPrice - grade;
};

const evaluatedCreditCardsWithCashBack = (
  userPreferences: UserPreferences,
  benefits: IBenefit[]
): EvaluatedCreditCard[] => {
  return userPreferences.cardsPreference.map((creditCard) => {
    const cashBackBenefit = benefits.find(
      (benefit) =>
        benefit.creditCardId === creditCard &&
        benefit.discountType === DiscountType.CASHBACK &&
        !benefit.businessId
    );
    const cashbackValue =
      cashBackBenefit?.creditCardId.pointValue * cashBackBenefit?.value || 0;
    return {
      creditCardId: creditCard,
      grade: cashbackValue,
      profit: cashbackValue,
    };
  });
};

const gradeBenefits = (benefits: IBenefit[], transactionAmount: number) => {
  return benefits.map((benefit) => ({
    benefit,
    grade: calculateGrade(benefit, transactionAmount),
  }));
};

const findBestBenefit = (
  gradedBenefits: { benefit: IBenefit; grade: number }[],
  creditCardId: mongoose.Schema.Types.ObjectId
) => {
  return gradedBenefits
    .filter(
      (populatedMapObject) =>
        populatedMapObject.benefit.creditCardId === creditCardId
    )
    .sort((a, b) => b.grade - a.grade)[0];
};

const getRecommendations = (
  populatedBenefits: IBenefit[],
  userPreferences: UserPreferences,
  transactionAmount: number
): EvaluatedCreditCard[] => {
  const evaluatedCreditCards = evaluatedCreditCardsWithCashBack(
    userPreferences,
    populatedBenefits
  );

  const gradedBenefits = gradeBenefits(populatedBenefits, transactionAmount);

  evaluatedCreditCards.forEach((evaluatedCreditCard) => {
    const bestBenefitMapObject = findBestBenefit(
      gradedBenefits,
      evaluatedCreditCard.creditCardId
    );
    if (bestBenefitMapObject) {
      evaluatedCreditCard.grade += bestBenefitMapObject.grade;
      evaluatedCreditCard.profit += bestBenefitMapObject.grade;
    }
  });

  return evaluatedCreditCards;
};

export default {
  getRecommendations,
};
