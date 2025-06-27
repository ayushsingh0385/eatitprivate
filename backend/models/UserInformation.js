const mongoose = require("mongoose");
const { Schema } = mongoose;

const InformationSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
      validate: {
        validator: function(value) {
          const now = new Date();
          const oldestDate = new Date(now.getFullYear() - 120, now.getMonth(), now.getDate());
          return value <= now && value >= oldestDate;
        },
        message: "Date of birth must be in the past and within 120 years."
      }
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    heightCm: {
      type: Number,
      required: true,
      min: 30, // cm
      max: 300,
    },
    weightKg: {
      type: Number,
      required: true,
      min: 1, // kg
      max: 500,
    },
    purposes: {
      type: [String],
      enum: [
        "Fitness Tracking",
        "Health Monitoring",
        "Diet/Nutrition Planning",
        "Weight Management",
        "Medical Condition Management",
        "Physical Activity Management",
        "Research Purpose"
      ],
      default: [],
    },
    
    allergies: {
      type: [String],
      enum: ["Nuts", "Dairy", "Gluten", "Seafood", "Pollen", "Latex", "None"],
      default: ["None"],
    },
    diseases: {
      type: [String],
      enum: [
        "Diabetes",
        "Hypertension",
        "Heart Disease",
        "Asthma",
        "Thyroid Disorder",
        "None",
        "Other"
      ],
      default: ["None"],
    },
    otherDisease: {
      type: String,
      trim: true,
    },
    healthGoal: {
      type: String,
      enum: [
        "Gain Weight",
        "Maintain Weight",
        "Weight Loss",
        "Improve Muscle Tone",
        "Increase Stamina",
        "Improve Overall Health"
      ],
      required: true,
    },
    dietPreference: {
      type: String,
      enum: ["Vegetarian", "Vegan", "Pescatarian", "Omnivore", "Keto", "Paleo", "None"],
      required: true,
    },
    image: { url: String, publicId: String },
    documents: 
      {
        type: String,
        uploadedAt: { type: Date, default: Date.now }
      }
    ,
    authId: {
      type: Schema.Types.ObjectId,
      ref: "UserAuth",
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Information", InformationSchema);
