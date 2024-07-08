import mongoose, { Types } from "mongoose";
import { PopulatedBenefit } from "../controllers/recommendation.controller";
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
  cards: any[];
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
        (card) => card._id == benefit.creditCardId
      ).pointValue;
      profit = benefit.value * pointToMoneyValue;
      grade =
        userPreferences.profitType === ProfitType.POINTS ? profit * 3 : profit;
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
      benefit.creditCardId === creditCard &&
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

const gradeBenefits = (
  benefits: IBenefit[],
  transactionAmount: number,
  userPreferences: UserPreferencesWithCreditCards
) => {
  return benefits.map((benefit: IBenefit) => {
    const calculatedGrade = calculateBenefitGradeAndProfit(
      benefit,
      transactionAmount,
      userPreferences
    );
    const grade: number = calculatedGrade[0];
    const profit: number = calculatedGrade[1];
    return { benefit, grade, profit };
  });
};

const findBestBenefit = (
  gradedBenefits: { benefit: IBenefit; grade: number; profit: number }[],
  creditCardId: Types.ObjectId
) => {
  return gradedBenefits
    .filter((mapObject) => mapObject.benefit.creditCardId === creditCardId)
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

//Local data:
const localCreditCards = [
  {
    _id: "60d0fe4f5311236168a109cb",
    cardName: "Card A",
    pointValue: 0.01,
  },
  {
    _id: "60d0fe4f5311236168a109cc",
    cardName: "Card B",
    pointValue: 0.02,
  },
  {
    _id: "60d0fe4f5311236168a109cO",
    cardName: "Card C",
  },
];

const getRecommendations = async (
  populatedBenefits: IBenefit[],
  userPreferences: UserPreferences,
  transactionAmount: number
): Promise<EvaluatedCreditCard[]> => {
  const userCreditCards = localCreditCards;

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

  const gradedBenefits = gradeBenefits(
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

//#region Dummy Data
//
//
//
//
//
//
//
//
//
//
//
//
//
//#region profitType Points
/*
{
  "transactionAmount": 300,
  "user": {
    "_id": "60d0fe4f5311236168a109cb",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "password": "hashedpassword",
    "creditCards": ["60d0fe4f5311236168a109cb", "60d0fe4f5311236168a109cc", "60d0fe4f5311236168a109c0"],
    "userPreferences": {
      "profitType": "POINTS",
      "cardsPreference": ["60d0fe4f5311236168a109cc", "60d0fe4f5311236168a109cb", "60d0fe4f5311236168a109c0"]
    }
  },
  "benefits": [
    {
      "businessId": "60d0fe4f5311236168a109cd",
      "creditCardId": "60d0fe4f5311236168a109cb",
      "discountType": "DISCOUNT",
      "valueType": "PERCENTAGE",
      "value": 15,
      "maxProfit": 60
    },
    {
      "businessId": "60d0fe4f5311236168a109ce",
      "creditCardId": "60d0fe4f5311236168a109cc",
      "discountType": "POINTS",
      "valueType": "NUMBER",
      "value": 150,
      "minPurchaseAmount": 300
    },
    {
      "creditCardId": "60d0fe4f5311236168a109c0",
      "discountType": "DISCOUNT",
      "valueType": "NUMBER",
      "value": 50,
      "minPurchaseAmount": 200
    }
  ]
}
*/

//#region Result for profitType Points
/*
[
  {
    "creditCardId": "60d0fe4f5311236168a109cc",
    "grade": 180, // (transactionAmount * 0.15)
    "profit": 45   // (transactionAmount * 0.15)
  },
  {
    "creditCardId": "60d0fe4f5311236168a109cb",
    "grade": 45,   // (transactionAmount * 0.15)
    "profit": 45   // (transactionAmount * 0.15)
  },
  {
    "creditCardId": "60d0fe4f5311236168a109c0",
    "grade": 50,
    "profit": 50
  }
]

Explanation of Results
Card B (60d0fe4f5311236168a109cc): Jane's top preference for points. Based on the benefit configuration, she earns 150 points for a transaction amount of 300, which translates to a grade and profit of 180 points (transactionAmount * 0.15).
Card A (60d0fe4f5311236168a109cb): Earns 45 points (transactionAmount * 0.15) based on the configured discount percentage.
Card C (60d0fe4f5311236168a109c0): Provides a flat discount of 50 based on the configured benefit.
*/
//#endregion

//#region profitType: Lowest_price
/*
{
  "transactionAmount": 250,
  "user": {
    "_id": "60d0fe4f5311236168a109cc",
    "firstName": "Michael",
    "lastName": "Johnson",
    "email": "michael.johnson@example.com",
    "password": "hashedpassword",
    "creditCards": ["60d0fe4f5311236168a109cb", "60d0fe4f5311236168a109cc", "60d0fe4f5311236168a109c0"],
    "userPreferences": {
      "profitType": "LOWEST_PRICE",
      "cardsPreference": ["60d0fe4f5311236168a109cb", "60d0fe4f5311236168a109cc", "60d0fe4f5311236168a109c0"]
    }
  },
  "benefits": [
    {
      "businessId": "60d0fe4f5311236168a109cd",
      "creditCardId": "60d0fe4f5311236168a109cb",
      "discountType": "DISCOUNT",
      "valueType": "PERCENTAGE",
      "value": 20,
      "maxProfit": 50
    },
    {
      "businessId": "60d0fe4f5311236168a109ce",
      "creditCardId": "60d0fe4f5311236168a109cc",
      "discountType": "POINTS",
      "valueType": "NUMBER",
      "value": 200,
      "minPurchaseAmount": 400
    },
    {
      "creditCardId": "60d0fe4f5311236168a109c0",
      "discountType": "CASHBACK",
      "valueType": "PERCENTAGE",
      "value": 5
    }
  ]
}
*/
//#region Result for profitType Lowest_price
/*
[
  {
    "creditCardId": "60d0fe4f5311236168a109cb",
    "grade": 50,   // (transactionAmount * 0.20)
    "profit": 50   // (transactionAmount * 0.20)
  },
  {
    "creditCardId": "60d0fe4f5311236168a109cc",
    "grade": 0,    // No points earned as transactionAmount < minPurchaseAmount
    "profit": 0
  },
  {
    "creditCardId": "60d0fe4f5311236168a109c0",
    "grade": 12.5, // (transactionAmount * 0.05)
    "profit": 12.5 // (transactionAmount * 0.05)
  }
]

Explanation of Results
Card A (60d0fe4f5311236168a109cb): Michael prefers lowest price, so the algorithm selects the highest discount percentage benefit, earning him 50 points (transactionAmount * 0.20).
Card B (60d0fe4f5311236168a109cc): No points are earned because the transaction amount is below the minimum purchase amount required for points.
Card C (60d0fe4f5311236168a109c0): Provides a cashback of 5% based on the transaction amount, resulting in 12.5 points (transactionAmount * 0.05).
*/
//#endregion

//#region profitType Nominal_profit
/* 
{
  "transactionAmount": 300,
  "user": {
    "_id": "60d0fe4f5311236168a109cd",
    "firstName": "Emily",
    "lastName": "Smith",
    "email": "emily.smith@example.com",
    "password": "hashedpassword",
    "creditCards": ["60d0fe4f5311236168a109cb", "60d0fe4f5311236168a109cc", "60d0fe4f5311236168a109c0"],
    "userPreferences": {
      "profitType": "NOMINAL_PROFIT",
      "cardsPreference": ["60d0fe4f5311236168a109cb", "60d0fe4f5311236168a109cc", "60d0fe4f5311236168a109c0"]
    }
  },
  "benefits": [
    {
      "businessId": "60d0fe4f5311236168a109cd",
      "creditCardId": "60d0fe4f5311236168a109cb",
      "discountType": "DISCOUNT",
      "valueType": "PERCENTAGE",
      "value": 15,
      "maxProfit": 50
    },
    {
      "businessId": "60d0fe4f5311236168a109ce",
      "creditCardId": "60d0fe4f5311236168a109cc",
      "discountType": "POINTS",
      "valueType": "NUMBER",
      "value": 150,
      "minPurchaseAmount": 400
    },
    {
      "creditCardId": "60d0fe4f5311236168a109c0",
      "discountType": "CASHBACK",
      "valueType": "PERCENTAGE",
      "value": 7
    }
  ]
}
*/
//#region Result for profitType Nominal_profit
/* 
[
  {
    "creditCardId": "60d0fe4f5311236168a109cb",
    "grade": 45,   // (transactionAmount * 0.15)
    "profit": 45   // (transactionAmount * 0.15)
  },
  {
    "creditCardId": "60d0fe4f5311236168a109cc",
    "grade": 150,  // Fixed profit of 150 because transactionAmount >= minPurchaseAmount
    "profit": 150
  },
  {
    "creditCardId": "60d0fe4f5311236168a109c0",
    "grade": 21,   // (transactionAmount * 0.07)
    "profit": 21   // (transactionAmount * 0.07)
  }
]
Explanation of Results
Card A (60d0fe4f5311236168a109cb): Emily prefers nominal profit, so the algorithm selects the highest discount percentage benefit, earning her 45 points (transactionAmount * 0.15).
Card B (60d0fe4f5311236168a109cc): Earns a fixed profit of 150 points because the transaction amount meets the minimum purchase amount required for points.
Card C (60d0fe4f5311236168a109c0): Provides a cashback of 7% based on the transaction amount, resulting in 21 points (transactionAmount * 0.07).
*/
//#endregion
