import { DiscountType, ValueType } from "../models/Benefit.model";
import benefitSchema from "../Schemas/benefitSchema";

interface IBenefitTest{
    businessId?: string;
    creditCardId?: string;
    discountType: string;
    valueType: string;
    value: any;
}
const benefit:IBenefitTest = {
    businessId: "60f3c4f6e1b4e5f9b8f8f4c6",
    creditCardId: "60f3c4f6e1b4e5f9b8f8f4c6",
    discountType:"cashback",
    valueType: "percentage",
    value:3,
  };

  let testBenefit:IBenefitTest = {...benefit}

describe("benefitSchema", () => {
  it("should validate a correct benefit", () => {
 
    const result = benefitSchema.safeParse(testBenefit);
    expect(result.success).toBe(true);
  });

  it("should validate a wrong benefit-invalid discountType", () => {
    testBenefit.discountType = "cashback1";
    const result = benefitSchema.safeParse(testBenefit);
    expect(result.success).toBe(false);
    testBenefit = { ...benefit };
  });

  it("should validate a wrong benefit-invalid valueType", () => {
    testBenefit.valueType = "number1";
    const result = benefitSchema.safeParse(testBenefit);
    expect(result.success).toBe(false);
    testBenefit = { ...benefit };
  });

  it("should validate a wrong benefit-invalid value", () => {
    testBenefit.value = "number1";
    const result = benefitSchema.safeParse(testBenefit);
    expect(result.success).toBe(false);
    testBenefit = { ...benefit };
  });

  it("should validate a wrong benefit-invalid objectId", () => {
    testBenefit.creditCardId = "1";
    const result = benefitSchema.safeParse(testBenefit);
    expect(result.success).toBe(false);
    testBenefit = { ...benefit };
  });

    it("should validate a wrong benefit-missing field", () => {
        delete testBenefit.value;
        const result = benefitSchema.safeParse(testBenefit);
        expect(result.success).toBe(false);
        testBenefit = { ...benefit };
    });
}) 
