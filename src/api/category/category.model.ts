import mongoose, { Document, Schema } from 'mongoose';

interface ICategory extends Document {
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
    {
        name: { type: String, required: true },
    },
    { timestamps: true }
);

const Category = mongoose.model<ICategory>('Category', CategorySchema);
export default Category;
