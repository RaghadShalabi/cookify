import { roles } from "../../middleware/auth.js";

export const endPoint = {
    create: [roles.Admin,roles.User],
    delete: [roles.Admin,roles.User],
    update:[roles.Admin,roles.User]
};
