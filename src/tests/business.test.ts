import businessSchema from "../Schemas/businessSchema"

interface Business{
    businessName:any
}
const creditbusiness:Business={
    businessName:"bit business",
}

describe("businessSchema", () => {
    it("should validate a correct  business", () => {
        const result = businessSchema.safeParse(creditbusiness);
        expect(result.success).toBe(true);
    });
    
    it("should validate a wrong  business-short businessName", () => {
        creditbusiness.businessName = "b";
        const result = businessSchema.safeParse(creditbusiness);
        expect(result.success).toBe(false);
        creditbusiness.businessName = "bit business";
    });
    it("should validate a wrong business-not a string", () => {
        creditbusiness.businessName = 1234;
        const result = businessSchema.safeParse(creditbusiness);
        expect(result.success).toBe(false);
        creditbusiness.businessName = "bit business";
    });
    it("should validate a wrong business-missing field", () => {
        delete creditbusiness.businessName;
        const result = businessSchema.safeParse(creditbusiness);
        expect(result.success).toBe(false);
        creditbusiness.businessName = "bit business";
    });
})