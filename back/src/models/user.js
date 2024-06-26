import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ["USER_ROLE", "ADMIN_ROLE"],
			default: "USER_ROLE",
		},
		color: {
			type: String,
			default: "#3f51b5",
		},
		authentificationToken: {
			type: String,
		},
		confirmed: {
			type: Boolean,
		},
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("User", userSchema);

export default User;
