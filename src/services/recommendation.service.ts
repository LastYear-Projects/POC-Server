import mongoose, { Types } from "mongoose";
import { DiscountType, IBenefit, ValueType } from "../models/Benefit.model";
import { ProfitType, UserPreferences } from "../models/User.Model";
import creditCardService from "./creditCard.service";
import { ICreditCard } from "../models/CreditCard.model";

const USER_PREFERENCE_MODIFIER = 3;

export type EvaluatedCreditCard = {
  creditCardId: Types.ObjectId;
  grade: number;
  profit: number;
};

type UserPreferencesWithCreditCards = {
  profitType: ProfitType;
  cardsPreference: Types.ObjectId[];
  cards: ICreditCard[];
};

const calculateBenefitGradeAndProfit = (
  benefit: IBenefit,
  transactionPrice: number,
  userPreferences: UserPreferencesWithCreditCards
): Promise<number[]> => {
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
          ? profit * USER_PREFERENCE_MODIFIER
          : profit;
      break;

    case DiscountType.POINTS:
      const pointToMoneyValue = userPreferences.cards.find(
        (card) => card._id.toString() == benefit.creditCardId._id.toString()
      ).pointValue;
      profit = benefit.value * pointToMoneyValue;
      grade =
        userPreferences.profitType === ProfitType.POINTS
          ? profit * USER_PREFERENCE_MODIFIER
          : profit;
      break;
  }
  return Promise.resolve([grade, profit]);
};

const evaluateCreditCardsWithCashBack = (
  userPreferences: UserPreferencesWithCreditCards,
  transactionAmount: number,
  benefits: IBenefit[]
): EvaluatedCreditCard[] => {
  return userPreferences.cardsPreference.map((creditCard) => {
    let grade = 0;
    let profit = 0;
    const cashbackBenefits = benefits.filter((benefit: IBenefit) => {
      return benefit.creditCardId._id.toString() == creditCard.toString() &&
        benefit.discountType === DiscountType.CASHBACK;
    });

    cashbackBenefits.forEach((cashbackBenefit) => {
      profit +=
        cashbackBenefit.valueType === ValueType.PERCENTAGE
          ? transactionAmount * (cashbackBenefit.value / 100)
          : cashbackBenefit.value;
    });
    grade =
      userPreferences.profitType === ProfitType.LOWEST_PRICE
        ? profit * USER_PREFERENCE_MODIFIER
        : profit;
    return {
      creditCardId: creditCard,
      grade: grade,
      profit: profit,
    };
  });
};

const gradeBenefits =  async (
  benefits: IBenefit[],
  transactionAmount: number,
  userPreferences: UserPreferencesWithCreditCards
) => {
    const benefitsToGradeAndProfit = await Promise.all(benefits.map((benefit: IBenefit) => {
        return calculateBenefitGradeAndProfit(
          benefit,
          transactionAmount,
          userPreferences
        )}));
    const benefitsWithGradeAndProfit = []
    for(let i=0;i<benefits.length;i++){
        const grade: number = benefitsToGradeAndProfit[i][0]
        const profit: number = benefitsToGradeAndProfit[i][1]
        benefitsWithGradeAndProfit[i] = {benefit: benefits[i], grade, profit}
    }
    return benefitsWithGradeAndProfit;
};

const findBestBenefit = (
  gradedBenefits: { benefit: IBenefit; grade: number; profit: number }[],
  creditCardId: Types.ObjectId
) => {
  return gradedBenefits
    .filter((mapObject) => mapObject.benefit.creditCardId._id.toString() == creditCardId.toString())
    .sort((a, b) => b.grade - a.grade)[0];
};

//TODO - function will be in different file.
const getCreditCardsById = async (cardsIds: Types.ObjectId[]) => {
  const creditCards: ICreditCard[] = [];
  for (let i = 0; i < cardsIds.length; i++) {
    creditCards.push(await creditCardService.getById(cardsIds[i]));
  }
  return creditCards;
};


const getRecommendations = async (
  populatedBenefits: IBenefit[],
  userPreferences: UserPreferences,
  transactionAmount: number
): Promise<EvaluatedCreditCard[]> => {
  const userCreditCards = await getCreditCardsById(userPreferences.cardsPreference);

  const extendedUserPreferences: UserPreferencesWithCreditCards = {
    profitType: userPreferences.profitType,
    cards: userCreditCards,
    cardsPreference: userPreferences.cardsPreference,
  };

  const evaluatedCreditCards = evaluateCreditCardsWithCashBack(
    extendedUserPreferences,
    transactionAmount,
    populatedBenefits
  );


  const gradedBenefits = await gradeBenefits(
    populatedBenefits,
    transactionAmount,
    extendedUserPreferences
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