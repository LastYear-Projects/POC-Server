import mongoose from "mongoose";
import { PopulatedBenefit } from "../controllers/recommendation.controller";
import { DiscountType, ValueType } from "../models/Benefit.model";
import { UserPreferences } from "../models/User.Model";

export type EvaluatedCreditCard = {
  creditCardId: mongoose.Schema.Types.ObjectId;
  grade: number;
  profit: number;
};

const calculateGrade = (
  populatedBenefit: PopulatedBenefit,
  transactionPrice: number
): number => {
  let grade = 0;

  switch (populatedBenefit.discountType) {
    case DiscountType.DISCOUNT:
      if (populatedBenefit.valueType === ValueType.PERCENTAGE) {
        grade =
          transactionPrice - transactionPrice * (populatedBenefit.value / 100);
      } else {
        grade = transactionPrice - populatedBenefit.value;
      }
      break;
    case DiscountType.POINTS:
      const pointToMoneyValue = populatedBenefit.creditCard.pointToMoney;
      grade = transactionPrice - populatedBenefit.value * pointToMoneyValue;
      break;
  }
  return transactionPrice - grade;
};

const evaluatedCreditCardsWithCashBack = (
  userPreferences: UserPreferences,
  populatedBenefits: PopulatedBenefit[]
): EvaluatedCreditCard[] => {
  return userPreferences.cardsPreference.map((creditCard) => {
    const cashBackBenefit = populatedBenefits.find(
      (benefit) =>
        benefit.creditCardId === creditCard &&
        benefit.discountType === DiscountType.CASHBACK &&
        !benefit.businessId
    );
    const cashbackValue =
      cashBackBenefit?.creditCard.pointToMoney * cashBackBenefit?.value || 0;
    return {
      creditCardId: creditCard,
      grade: cashbackValue,
      profit: cashbackValue,
    };
  });
};

const gradePopulatedBenefits = (
  populatedBenefits: PopulatedBenefit[],
  transactionAmount: number
) => {
  return populatedBenefits.map((populatedBenefit) => ({
    populatedBenefit,
    grade: calculateGrade(populatedBenefit, transactionAmount),
  }));
};

const findBestBenefit = (
  gradedPopulatedBenefits: { populatedBenefit: PopulatedBenefit; grade: number }[],
  creditCardId: mongoose.Schema.Types.ObjectId
) => {
  return gradedPopulatedBenefits
    .filter(
      (populatedMapObject) =>
        populatedMapObject.populatedBenefit.creditCardId === creditCardId
    )
    .sort((a, b) => b.grade - a.grade)[0];
};

const getRecommendations = (
  populatedBenefits: PopulatedBenefit[],
  userPreferences: UserPreferences,
  transactionAmount: number
): EvaluatedCreditCard[] => {
  const evaluatedCreditCards = evaluatedCreditCardsWithCashBack(
    userPreferences,
    populatedBenefits
  );

  const gradedPopulatedBenefits = gradePopulatedBenefits(
    populatedBenefits,
    transactionAmount
  );

  evaluatedCreditCards.forEach((evaluatedCreditCard) => {
    const bestBenefitMapObject = findBestBenefit(
      gradedPopulatedBenefits,
      evaluatedCreditCard.creditCardId
    );
    if (bestBenefitMapObject) {
      evaluatedCreditCard.grade += bestBenefitMapObject.grade;
    }
  });

  return evaluatedCreditCards.sort((a, b) => b.grade - a.grade);
};

export default {
  getRecommendations,
};