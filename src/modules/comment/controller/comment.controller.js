import commentModel from "../../../../DB/model/comment.model.js";
import recipeModel from "../../../../DB/model/recipe.model.js";

// Add comment to recipe
export const addComment = async (req, res, next) => {
    const { content } = req.body;
    const { recipeId } = req.params;

    const recipe = await recipeModel.findOne({ _id: recipeId })
    if (!recipe) {
        return next(new Error("can not comment this recipe, recipe does not exist", { cause: 404 }))
    }
    let userComment = await commentModel.findOne({ userId: req.user._id, recipeId: recipeId });

    if (userComment) {
        userComment.content = content;
    } else {
        userComment = await commentModel.create({
            createdBy: req.user._id, userId: req.user._id, recipeId: recipeId, content
        });
    }
    const savedComment = await userComment.save();
    return res.status(201).json({ message: "success", savedComment });
};

// Get all comments for a recipe
export const getComments = async (req, res, next) => {
    const { recipeId } = req.params;
    const comments = await commentModel.find({ recipeId }).populate("userId", "userName image");
    return res.status(200).json({ message: "success", comments });
};

// Delete comment
export const deleteComment = async (req, res, next) => {
    const comment = await commentModel.findById(req.params.commentId);

    if (!comment) {
        return next(new Error("Comment not found", { cause: 404 }));
    }

    if (comment.userId.toString() !== req.user._id.toString()) {
        return next(new Error("You are not authorized to delete this comment", { cause: 403 }));
    }
    await commentModel.deleteOne({ _id: req.params.commentId })
    return res.status(200).json({ message: "Comment deleted successfully" });
};