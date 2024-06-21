import Joi from "joi";
import ExpressError from "./ExpressError.js";

class CampgroundValidator {

    static validator = Joi.object({
        campground: Joi.object({
            title: Joi.string().required(),
            imagePath: Joi.string().uri().required(),
            price: Joi.number().positive().required(),
            description: Joi.string().required(),
            location: Joi.string().required(),
        }).required()
    });

    static test = (req, res, next) => {
        // console.log(this); // kill me pls
        const { error } = this.validator.validate(req.body);
        if (error) {
            throw new ExpressError(400, error.details.map(d => d.message).join(', '));
        }
        else {
            return next();
        }
    }
}

export default CampgroundValidator;