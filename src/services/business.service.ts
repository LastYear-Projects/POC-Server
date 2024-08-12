import Business from "../models/Business.model";

import genericService, { BaseService } from "./generic.service";

interface BusinessService extends BaseService {

}
const businessService: BusinessService = {
    ...genericService<BusinessService>(Business),
    
}



export default businessService
