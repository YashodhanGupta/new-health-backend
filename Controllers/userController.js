import User from "../models/UserSchema.js";
import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";

export const updateUser = async (req, res) => {
  console.log(req.body);
  const id = req.params.id;

  try {
    let user = await User.findById(id);
    if (!user) {
      user = await Doctor.findById(id);
    }
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Prevent updating the password directly
    if (req.body.password) {
      delete req.body.password;
    }

    const updatedUser = await user.constructor.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: rest,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(id) || await Doctor.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "Successfully deleted" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete", error: error.message });
  }
};

export const getSingleUser = async (req, res) => {
  const id = req.params.id;
  try {
    let user = await User.findById(id).select("-password") || await Doctor.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User found", data: user });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching user", error: error.message });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    const doctors = await Doctor.find({}).select("-password");
    
    res.status(200).json({ success: true, message: "Users found", data: [...users, ...doctors] });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching users", error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  const userId = req.userId;
  try {
    let user = await User.findById(userId) || await Doctor.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { password, ...rest } = user._doc;
    res.status(200).json({ success: true, message: "Profile fetched", data: rest });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching profile", error: error.message });
  }
};

export const getMyAppointment = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId });
    const doctorIds = bookings.map((el) => el.doctor.id);

    const doctors = await Doctor.find({ _id: { $in: doctorIds } }).select("-password");

    res.status(200).json({ success: true, message: "Appointments retrieved", data: doctors });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching appointments", error: error.message });
  }
};
