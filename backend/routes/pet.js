const express = require('express');
const Pet = require('../models/Pet');
const User = require('../models/User');
const router = express.Router();
const upload = require('../config/multer');
const transporter = require('../config/nodemailer');

// Retrieve all pets
router.get('/', async (req, res) => {
  try {
    const pets = await Pet.find();
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pets', error: error.message });
  }
});

// Retrieve a specific pet by ID
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    res.json(pet);
  } catch (error) {
    console.error('Error fetching pet:', error);
    res.status(500).json({ message: 'Error fetching pet', error: error.message });
  }
});

// Retrieve pets uploaded by a specific user
router.get('/staff/:uploadedBy', async (req, res) => {
  const { uploadedBy } = req.params;
  try {
    const pets = await Pet.find({ uploadedBy });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pets', error: error.message });
  }
});

// Add a new pet with multiple images
router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    const { name, type, breed, size, age, ageUnit, gender, shelter, description, uploadedBy } = req.body;
    
    // Create a new Pet document
    const newPet = new Pet({
      name,
      type,
      breed,
      size,
      age,
      ageUnit,
      gender,
      shelter,
      description,
      uploadedBy,
      images: req.files.map(file => file.path) // Store the paths of the uploaded images
    });

    // Save the new Pet document to the database
    await newPet.save();
    
    res.status(201).json({ message: 'Pet added successfully!' });
  } catch (error) {
    console.error('Error adding pet:', error);
    res.status(500).json({ message: 'Failed to add pet', error: error.message });
  }
});

// Update a pet's details and optionally its image
router.put('/:petId', upload.single('image'), async (req, res) => {
  try {
    const petId = req.params.petId;
    const { name, type, breed, age, ageUnit, gender, shelter, description } = req.body;

    // Find the pet by ID
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Update pet fields
    pet.name = name || pet.name;
    pet.type = type || pet.type;
    pet.breed = breed || pet.breed;
    pet.age = age || pet.age;
    pet.ageUnit = ageUnit || pet.ageUnit;
    pet.gender = gender || pet.gender;
    pet.shelter = shelter || pet.shelter;
    pet.description = description || pet.description;

    // Update image if new one is provided
    if (req.file) {
      pet.images = [req.file.path]; // Replace with new image if necessary
    }

    // Save updated pet
    await pet.save();

    res.status(200).json({ message: 'Pet updated successfully', pet });
  } catch (error) {
    console.error('Error updating pet:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Mark a pet as adopted or not adopted
router.put('/adopt/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    pet.isAdopted = req.body.isAdopted;

    await pet.save();

    res.status(200).json({ message: 'Pet status updated', pet });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a pet by ID
router.delete('/:id', async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });
    res.status(200).json({ message: 'Pet deleted successfully' });
  } catch (error) {
    console.error('Error deleting pet listing:', error);
    res.status(500).json({ message: 'Failed to delete pet listing', error: error.message });
  }
});

// Add a pet to a user's liked pets
router.post('/like/:name/:petId', async (req, res) => {
  try {
    const { name, petId } = req.params;

    // Find the user by name
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add the pet ID to the user's likedPets array
    await User.findByIdAndUpdate(user._id, {
      $addToSet: { likedPets: petId }
    });

    res.status(200).json({ message: 'Pet liked' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to like pet', error: error.message });
  }
});

// Remove a pet from a user's liked pets
router.post('/unlike/:name/:petId', async (req, res) => {
  try {
    const { name, petId } = req.params;

    // Find the user by name
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove the pet ID from the user's likedPets array
    await User.findByIdAndUpdate(user._id, {
      $pull: { likedPets: petId }
    });

    res.status(200).json({ message: 'Pet unliked' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to unlike pet', error: error.message });
  }
});

// Get all liked pets for a user
router.get('/liked-pets/:name', async (req, res) => {
  try {
    const { name } = req.params;

    // Find the user by name and populate likedPets
    const user = await User.findOne({ name }).populate('likedPets');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.likedPets);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch liked pets', error: error.message });
  }
});

// Handle an adoption request by sending an email
router.post('/adopt/:petId', async (req, res) => {
  const { userName, userEmail, message } = req.body;
  const petId = req.params.petId;

  try {
    // Find the user by name
    const user = await User.findOne({ name: userName });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the pet by ID
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Setup email options
    const mailOptions = {
      from: userEmail,
      to: 'pawsweb.2024@gmail.com',
      replyTo: userEmail, 
      subject: `Interested in Adopting Pet: ${pet.name}`,
      text: `Hello,\n\n` +
            `I am interested in adopting the following pet:\n\n` +
            `Pet Name: ${pet.name}\n` +
            `Type: ${pet.type}\n` +
            `Breed: ${pet.breed}\n` +
            `Age: ${pet.age} ${pet.ageUnit}\n\n` +
            `Name: ${userName}\n` +
            `Email: ${userEmail}\n\n` +
            `Please get back to me with the next steps.\n\n` +
            `Thank you!`
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Your message has been sent to the shelter. Please wait for further arrangements.' });
  } catch (error) {
    console.error('Error sending adoption request:', error);
    res.status(500).json({ message: 'Failed to send adoption request. Please try again later.', error: error.message });
  }
});

// Get spotlight pets: most recent non-adopted pets
router.get('/pets/spotlight', async (req, res) => {
  try {
    const pets = await Pet.find({ isAdopted: false })
      .sort({ dateAdded: -1 })  // Sort by the most recent
      .limit(3);                // Limit to the top 3

    res.json(pets);
  } catch (error) {
    console.error('Error fetching spotlight pets:', error);
    res.status(500).send('Error fetching spotlight pets');
  }
});

module.exports = router;
