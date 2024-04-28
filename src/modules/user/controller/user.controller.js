import userModel from "../../../../DB/model/user.model.js";

// Get all userModels
export const getAllUsers = async (req, res, next) => {
    let users = await userModel.find({}).populate("recipe");
    return res.status(201).json({ message: "success", users })
};

// Get single user by id
export const getProfile = async (req, res, next) => {
    const user = await userModel.findById(req.user._id).populate("recipe");
    if (!user) {
        return next(new Error("User not found", { cause: 404 }));
    }
    return res.status(201).json({ message: "success", user });
};

// Delete user
export const deleteUser = async (req, res, next) => {
    const {id} = req.params;

    const user = await userModel.findById(id);
    if (!user) {
        return next(new Error("User not found", { cause: 404 }));
    }
    if(req.user.role !== "Admin" && id.toString() !== req.user._id.toString()){
        return next(new Error("You are not authorized to delete this user", { cause: 403 }));
    }
    await userModel.deleteOne({_id:req.params.id})

    return res.status(201).json({ message: "User deleted successfully" });
};