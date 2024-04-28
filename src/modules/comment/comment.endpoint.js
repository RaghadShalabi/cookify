import { roles } from "../../middleware/auth.js";

export const endPoint = {
    addComment: [roles.User],
    delete: [roles.User],
};
