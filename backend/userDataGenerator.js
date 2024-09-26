const faker = require('faker');
const { generateSeed } = require('./seedGenerator');

// Helper function to generate random user data
const generateUserData = (region, errors, seed, page) => {
  faker.seed(generateSeed(seed, page));
  let users = [];
  
  // Define regions' language specifics
  const locales = {
    'USA': 'en_US',
    'Poland': 'pl',
    'Georgian': 'ka',
  };
  
  faker.locale = locales[region] || 'en_US';

  for (let i = 0; i < 20; i++) {
    let name = `${faker.name.firstName()} ${faker.name.middleName()} ${faker.name.lastName()}`;
    let address = `${faker.address.city()}, ${faker.address.streetAddress()}`;
    let phone = faker.phone.phoneNumber();

    // Apply errors to data
    if (errors > 0) {
      const errorCount = Math.ceil(errors);
      for (let j = 0; j < errorCount; j++) {
        if (Math.random() < errors / errorCount) {
          name = applyErrors(name, 1);
          address = applyErrors(address, 1);
          phone = applyErrors(phone, 1);
        }
      }
    }

    users.push({
      index: i + 1 + (page - 1) * 20,
      id: faker.datatype.uuid(),
      name,
      address,
      phone
    });
  }

  return users;
};

// Function to apply errors to strings based on error count
const applyErrors = (str, errors) => {
  for (let i = 0; i < errors; i++) {
    const type = faker.datatype.number({ min: 1, max: 3 });
    switch (type) {
      case 1: // Delete character
        if (str.length > 1) {
          const pos = faker.datatype.number({ min: 0, max: str.length - 1 });
          str = str.slice(0, pos) + str.slice(pos + 1);
        }
        break;
      case 2: // Add random character
        const randChar = faker.random.alpha();
        const insertPos = faker.datatype.number({ min: 0, max: str.length });
        str = str.slice(0, insertPos) + randChar + str.slice(insertPos);
        break;
      case 3: // Swap adjacent characters
        if (str.length > 1) {
          const swapPos = faker.datatype.number({ min: 0, max: str.length - 2 });
          str = str.slice(0, swapPos) + str[swapPos + 1] + str[swapPos] + str.slice(swapPos + 2);
        }
        break;
    }
  }
  return str;
};

module.exports = { generateUserData };