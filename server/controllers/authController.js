const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ msg: 'User already exists with that email or username' });
    }

    user = new User({ username, email, password });
    await user.save();

    const payload = { user: { id: user.id } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        console.error('JWT Sign Error:', err.message);
        return res.status(500).json({ msg: 'Token generation failed' });
      }
      return res.status(201).json({
        msg: 'User registered successfully',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    });

  } catch (err) {
    console.error('Registration Error:', err.message);
    res.status(500).send('Server error during registration');
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login attempt with non-existing email:', email);
      return res.status(400).json({ msg: 'Invalid credentials: email not found' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log('Login attempt failed password match for:', email);
      return res.status(400).json({ msg: 'Invalid credentials: incorrect password' });
    }

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        console.error('JWT Sign Error:', err.message);
        return res.status(500).json({ msg: 'Token generation failed' });
      }

      res.json({
        msg: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    });

  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).send('Server error during login');
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);

  } catch (err) {
    console.error('Get Current User Error:', err.message);
    res.status(500).send('Server error');
  }
};

exports.logoutUser = async (req, res) => {
  try {
    // Instruct the client to delete the token
    return res.status(200).json({ msg: 'Logout successful. Please remove the token on client side.' });
  } catch (err) {
    console.error('Logout Error:', err.message);
    res.status(500).send('Server error during logout');
  }
};
