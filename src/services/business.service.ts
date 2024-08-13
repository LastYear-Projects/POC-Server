import Business from "../models/Business.model";

import genericService, { BaseService } from "./generic.service";

interface BusinessService extends BaseService {
    getByName(name: string): Promise<any>;

}
const businessService: BusinessService = {
    ...genericService<BusinessService>(Business),
    getByName: async (name: string) => {
        return Business.findOne({businessName: name});
    }
}


export default businessService
