import { ages } from './ages.js';

const ids = Object.keys(ages);
const nids = ids.map((e) => parseInt(e));

const getNearestIDs = (id, ids) => {
  let low = 0, high = ids.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (ids[mid] === id) return [ids[mid], ids[mid]]; // Exact match
    if (ids[mid] < id) low = mid + 1;
    else high = mid - 1;
  }

  // Return nearest lower and higher IDs
  return [ids[high] || null, ids[low] || null];
};

const getDate = (id) => {
  const [lowerID, upperID] = getNearestIDs(id, nids);

  if (lowerID === null) {
    return [-1, new Date(ages[ids[0]])];
  } else if (upperID === null) {
    return [1, new Date(ages[ids[ids.length - 1]])];
  } else {
    const lage = ages[lowerID];
    const uage = ages[upperID];

    const idratio = (id - lowerID) / (upperID - lowerID);
    const midDate = Math.floor(idratio * (uage - lage) + lage);
    return [0, new Date(midDate)];
  }
};

const getAge = (id) => {
  const d = getDate(id); // Assuming getDate returns a date array
  const registrationYear = d[1].getUTCFullYear(); // Extract the year from the date

  const currentYear = new Date().getUTCFullYear(); // Get the current year
  const age = currentYear - registrationYear; // Calculate age by subtracting

  return { age, registrationYear }; // Return both age and registration year
};

export default getAge;