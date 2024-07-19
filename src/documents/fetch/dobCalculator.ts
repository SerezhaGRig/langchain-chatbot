export const calculateDOBFromAge = (age: number): string => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const birthYear = currentYear - age;

  // Create the birth date with the calculated birth year
  const birthDate = new Date(currentDate);
  birthDate.setFullYear(birthYear);

  // Adjust the birth date if the birth date in the current year hasn't occurred yet
  if (currentDate < birthDate) {
    birthDate.setFullYear(birthYear - 1);
  }

  // Format the birth date as YYYY-MM-DD
  const year = birthDate.getFullYear();
  const month = String(birthDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(birthDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
