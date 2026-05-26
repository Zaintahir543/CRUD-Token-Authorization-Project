const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../mailer/mail");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// OTP generate function
const generateOTP = () => Math.floor(100000 + Math.random() * 900000); // 6 digit

// // ================= REGISTER =================
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // // profile image
    let profileImageUrl = null;
    if (req.file) {
      profileImageUrl = `${req.protocol}://${req.get("host")}/public/${req.file.filename}`;
    }

    // generate otp
    const otp = generateOTP();
    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    // create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      profile: profileImageUrl,
      otp,
      otpExpiry,
    });
    await user.save();

    // email message
    const subject = "WELCOME TO EXPRESS JS - Verify Your OTP";
    const message = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; border-radius: 10px;">
        <h2 style="color: #4CAF50;">Welcome, ${name} 👋</h2>
        <p style="font-size: 16px; color: #333;">
          Thank you for registering with <b>ExpressJs</b>.<br/>
          Please verify your email using the OTP below:
        </p>
        <h1 style="letter-spacing: 5px; color: #e63946;">${otp}</h1>
        <p style="margin-top:20px; font-size:12px; color:#777;">
          This OTP is valid for 5 minutes. Do not share it with anyone.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: email,
      subject,
      html: message,
    });

    res.json({
      message: "User registered successfully. OTP sent to email.",
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ================= VERIFY OTP =================
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (String(user.otp) !== String(otp))
      return res.status(400).json({ message: "Invalid OTP" });

    if (user.otpExpiry < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: "OTP verified successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= LOGIN =================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Create JWT token
    const token = generateToken(user._id);

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= ADD CONTACT =================
const contact = async (req, res) => {
  try {
    const { name, phone, email } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.contacts.push({ name, phone, email });
    await user.save();

    res.json({ message: "Contact added successfully", contacts: user.contacts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= GET CONTACTS =================
const getContects = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("contacts");
    res.json(user.contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= GET USER =================
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { register, verifyOtp, login, contact, getContects, getUser };
