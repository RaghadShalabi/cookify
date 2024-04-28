import { roles } from "../../middleware/auth.js";

export const endPoint = {
    create: [roles.User, roles.Admin],
    delete: [roles.User, roles.Admin],
    update: [roles.User, roles.Admin]
};
