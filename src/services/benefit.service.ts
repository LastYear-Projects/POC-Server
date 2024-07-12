import Benefit from "../models/Benefit.model";
import genericService, { BaseService } from "./generic.service";

interface BenefitService extends BaseService {

}
const benefitService: BenefitService = {
    ...genericService<BenefitService>(Benefit),
    
}



export default benefitService
