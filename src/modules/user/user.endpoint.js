import { roles } from "../../middleware/auth.js";

export const endPoint = {
    delete:[roles.Admin, roles.User],
};
