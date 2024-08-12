// import { Types } from 'mongoose';
// import getRecommendations from "../services/recommendation.service"

// interface IBenefitTest {
//     businessId?: Types.ObjectId;
//     creditCardId?: string;
//     discountType: "cashback" | "points" | "discount";
//     valueType: "percentage" | "number";
//     value: any;
// }

// type RecommendationRequest = {
//     benefits: IBenefitTest[],
//     userPreference: "lowestPrice" | "points" | "nominalValue",
//     amount: number
// };


// const exampleRequest: RecommendationRequest = {
//     benefits: [
//         {
//             businessId: new Types.ObjectId(), //41
//             creditCardId: "1",
//             discountType: "cashback",
//             valueType: "percentage",
//             value: 10
//         },
//         {
//             businessId: new Types.ObjectId(),
//             creditCardId: "1",
//             discountType: "discount",
//             valueType: "number",
//             value: 5
//         },
//         {
//             businessId: new Types.ObjectId(), //10 points + 3
//             creditCardId: "2",
//             discountType: "points",
//             valueType: "number",
//             value: 10
//         },
//         {
//             businessId: new Types.ObjectId(),
//             creditCardId: "1",
//             discountType: "cashback",
//             valueType: "percentage",
//             value: 2
//         },
//         {
//             businessId: new Types.ObjectId(), //45
//             creditCardId: "3",
//             discountType: "discount",
//             valueType: "percentage",
//             value: 15
//         },
//         {
//             creditCardId: "4", //20 points
//             discountType: "points",
//             valueType: "number",
//             value: 20
//         },
//         {
//             businessId: new Types.ObjectId(),
//             creditCardId: "2",
//             discountType: "cashback",
//             valueType: "number",
//             value: 3
//         }
//     ],
//     userPreference: "lowestPrice",
//     amount: 300
// };

// console.log(exampleRequest);


// describe("Recommendation Service", () => {
//   it("should validate a correct sort", () => {
//     getRecommendations(exampleRequest.benefits, exampleRequest.userPreference, exampleRequest.amount)
//   });

//   it("should validate a wrong  business-short businessName", () => {
//     creditbusiness.businessName = "b";
//     const result = businessSchema.safeParse(creditbusiness);
//     expect(result.success).toBe(false);
//     creditbusiness.businessName = "bit business";
//   });
//   it("should validate a wrong business-not a string", () => {
//     creditbusiness.businessName = 1234;
//     const result = businessSchema.safeParse(creditbusiness);
//     expect(result.success).toBe(false);
//     creditbusiness.businessName = "bit business";
//   });
//   it("should validate a wrong business-missing field", () => {
//     delete creditbusiness.businessName;
//     const result = businessSchema.safeParse(creditbusiness);
//     expect(result.success).toBe(false);
//     creditbusiness.businessName = "bit business";
//   });
// });
