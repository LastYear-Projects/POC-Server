import mongoose, {Types} from "mongoose";
import {DiscountType, ValueType} from "../models/Benefit.model";
import {util} from "zod";
import find = util.find;
import businessService from "./business.service";
import {IBusiness} from "../models/Business.model";
import benefitService from "./benefit.service";

export interface IcashBack  {
    businessName: string,
    creditCardId: Types.ObjectId;
    discountType: DiscountType;
    valueType:ValueType ;
    value: number
    businessImage: string
}
const createBenefitFromHever = async (cashBackArr: IcashBack[]) => {
    try {
        for (let i = 0; i < cashBackArr.length; i++) {
            const {businessName, creditCardId, discountType, valueType, value, businessImage} = cashBackArr[i]
            const business=await businessService.getByName(businessName);
            if (!business) {
                businessService.add({name: businessName,businessImage: businessImage})
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