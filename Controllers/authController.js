import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1d",
    }
  );
  return token;
};

export const register = async (req, res) => {
  console.log("====================================");
  console.log(req.body);
  console.log("====================================");
  const { email, password, name, role, photo, gender,bloodType } = req.body;

  try {
    let user = null;

    if (role === "patient") {
      user = await User.findOne({ email });
    } else if (role === "doctor") {
      user = await Doctor.findOne({ email });
    }

    if (user) {
      return res.status(400).json({ message: "User already exist" });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (role === "patient") {
      user = new User({
        email,
        name,
        photo,
        gender,
        password: hashedPassword,
        role,
        bloodType,
      });
    }
    if (role === "doctor") {
      user = new Doctor({
        email,
        name,
        photo,
        gender,
        password: hashedPassword,
        role,
        bloodType,
      });
    }

    console.log("User data before save:", user);
    await user.save();
    console.log("User saved successfully");
    

    res.status(200).json({ success: true, message: "User successfully created" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({success: false,message: "Internal Server error,Try again",
        error: error.message,
      });
  }
};

export const login = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  try {
    let user = null;
    let doctorId = null;

    const patient = await User.findOne({ email });

    const doctor = await Doctor.findOne({ email });
    
    if (patient) {
      user = patient;
    }
    if (doctor) {
      user = doctor;
      doctorId = doctor._id;
    }

    // check if user exist or not

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(404)
        .json({ status: false, message: "Invalid Credentials" });
    }

    //get token
    const token = generateToken(user);

    const { password: userPassword, role, appointment, ...rest } = user._doc;

    return res.status(200).json({
      status: true,
      message: "Successfully Login",
      token,
      data: { ...rest },
      role,
      doctorId,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: "failed to login" });
  }
};
