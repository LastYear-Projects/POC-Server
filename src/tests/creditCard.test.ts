import creditCardSchema from "../Schemas/creditCardSchema";

interface CreditCard{
    cardName:any
}
const creditCard:CreditCard={
    cardName:"bit card",
}

describe("creditCardSchema", () => {
    it("should validate a correct credit card", () => {
        const result = creditCardSchema.safeParse(creditCard);
        expect(result.success).toBe(true);
    });
    
    it("should validate a wrong credit card-short cardName", () => {
        creditCard.cardName = "b";
        const result = creditCardSchema.safeParse(creditCard);
        expect(result.success).toBe(false);
        creditCard.cardName = "bit card";
    });
    it("should validate a wrong credit card-not a string", () => {
        creditCard.cardName = 1234;
        const result = creditCardSchema.safeParse(creditCard);
        expect(result.success).toBe(false);
        creditCard.cardName = "bit card";
    });
    it("should validate a wrong credit card-missing field", () => {
        delete creditCard.cardName;
        const result = creditCardSchema.safeParse(creditCard);
        expect(result.success).toBe(false);
        creditCard.cardName = "bit card";
    });
})