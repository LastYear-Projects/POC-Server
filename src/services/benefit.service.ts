import Benefit from "../models/Benefit.model";
import genericService, { BaseService } from "./generic.service";

interface BenefitService extends BaseService {
    isBenefitExist(benefit: any): Promise<any>;

}
const benefitService: BenefitService = {
    ...genericService<BenefitService>(Benefit),
    isBenefitExist: async (benefit: any) => {
        return Benefit.findOne(benefit)

    }
}

export default benefitService
