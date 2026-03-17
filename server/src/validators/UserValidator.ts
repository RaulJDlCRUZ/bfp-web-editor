import { UserFormData } from "../shared/types/UserFormData";

export function validateUserFormData(data: UserFormData): void {
  if (!data.email || !data.password || !data.name || !data.lastNames.length) {
    throw new Error("UserValidator: Missing required fields in user data.");
  }
  if (data.lastNames.length < 2) {
    throw new Error("UserValidator: At least two last names are required.");
  }
  if (data.phone) {
    const parsedPhone = Number(data.phone);
    if (isNaN(parsedPhone)) {
      throw new Error("UserValidator: Phone must be a valid number.");
    }
  }
  // TODO: Add more validation logic (if needed)
}
