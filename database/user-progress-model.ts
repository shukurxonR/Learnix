import { Schema, model, models } from 'mongoose'

const UserProgressSchema = new Schema({
	userId: { type: String }, // ClerkId
	lessonId: { type: String },
	isCompleted: { type: Boolean, default: false },
})

const UserProgress =
	models.UserProgress || model('UserProgress', UserProgressSchema)
export default UserProgress
