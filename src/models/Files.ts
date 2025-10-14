import mongoose, { Schema, model, models, Document, Types } from "mongoose";
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing

// --- Interface Definition ---
export interface IFile extends Document {
  filename: string;
  url: string;
  cloudinaryId: string;
  shareId: string;
  uploaderId: Types.ObjectId; // Link to the IUser._id
  password: string; // CHANGED: Now required
  publicId: string; // CHANGED: Assuming this is always present after upload
  createdAt: Date;
  expiresAt: Date;
  // Method signature for password comparison
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// --- Schema Definition ---
const FileSchema: Schema<IFile> = new Schema(
  {
    filename: { type: mongoose.Schema.Types.String, required: true },
    url: { type: mongoose.Schema.Types.String, required: true },
    cloudinaryId: { type: mongoose.Schema.Types.String, required: true },
    // A short, unique ID for sharing.
    shareId: { type: mongoose.Schema.Types.String, required: true, unique: true },
    // Link to the user who uploaded the file, using explicit Mongoose ObjectId type
    uploaderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    
    // CHANGED: Password field is now required. It will be stored as a hash.
    password: { type: String, required: true },

    publicId: { type: String, required: true }, // Setting publicId as required as well

    // expiresAt is set to (current_time + 10 minutes) in the API handler.
    expiresAt: { type: mongoose.Schema.Types.Date, required: true },
  },
  { timestamps: true }
);

// --- Pre-save Hook for Password Hashing ---
FileSchema.pre<IFile>("save", async function (next) {
    // Only hash if the password field is present and is being modified (or is new)
    // We explicitly check if it's NOT a hash already, although `isModified` should handle it.
    if (!this.password || !this.isModified("password")) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        // Handle error gracefully
        if (err instanceof Error) {
            next(err);
        } else {
            next(new Error("An unknown error occurred during password hashing"));
        }
    }
});

// --- Instance Method for Password Comparison ---
FileSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    if (!this.password) return false; // Cannot compare if no password is set (though it's now required)
    return bcrypt.compare(candidatePassword, this.password);
};

// ✅ TTL Index: MongoDB will use the specific date/time stored in 'expiresAt'
// to determine when to delete the document after 0 seconds (immediately after expiration time).
FileSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const File = models.File 
    ? (models.File as mongoose.Model<IFile>) 
    : model<IFile>("File", FileSchema);
