import CreditCard from "../models/CreditCard.model";
import genericService, { BaseService } from "./generic.service";

interface CreditCardService extends BaseService {

}
const creditCardService: CreditCardService = {
    ...genericService<CreditCardService>(CreditCard),

}

export default creditCardService;
