import { Schema, model, models } from 'mongoose'

const CourseSchema = new Schema(
	{
		title: String,
		description: String,
		learning: String,
		requirements: String,
		level: String,
		category: String, // ✅ to‘g‘ri yozilishi kerak
		language: String,
		oldPrice: Number,
		currentPrice: Number,
		previewImage: String,
		slug: String,
		tags: String,
		published: { type: Boolean, default: false },
		instructor: { type: Schema.Types.ObjectId, ref: 'User' },
	},
	{ timestamps: true }
)

const Course = models.Course || model('Course', CourseSchema)
export default Course
