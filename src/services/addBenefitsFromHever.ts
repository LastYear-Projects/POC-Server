import {Types} from "mongoose";
import {DiscountType, ValueType} from "../models/Benefit.model";
import businessService from "./business.service";
import benefitService from "./benefit.service";

export interface IcashBack  {
    businessName: string,
    creditCardId: Types.ObjectId;
    discountType: DiscountType;
    valueType:ValueType ;
    value: number
    businessImage: string
}
 const createBenefitFromURL = async (cashBackArr: IcashBack[]) => {
    try {
        //TODO change to cashBackArr.length after testing
        // for (let i = 0; i < cashBackArr.length; i++) {
        for (let i = 0; i < 2; i++) {
            const {businessName, creditCardId, discountType, valueType, value, businessImage} = cashBackArr[i]
            const business=await businessService.getByName(businessName);
            if (!business) {
                await businessService.add({name: businessName, businessImage: businessImage})
            }

            const benefit = {
                businessId: business._id,
                creditCardId,
                discountType,
                valueType,
                value,
            }
            if (!await benefitService.isBenefitExist(benefit)) {
                await benefitService.add(benefit)
            }
        }
    } catch (error: any) {
        console.log("error in createBenefitFromHever " + error.message);
    }

}
export default createBenefitFromURL;