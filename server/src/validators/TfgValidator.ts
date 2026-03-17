import { TfgFormData } from "../shared/types/TfgFormData";

export const availableCsl: string[] = [
  "acm-sig-proceedings",
  "iso690-author-date-cs",
  "iso690-numeric-en",
];

export function validateCsl(csl: string): void {
  if (!availableCsl.includes(csl)) {
    throw new Error(
      `Invalid CSL style: ${csl}. Available styles are: ${availableCsl.join(
        ", "
      )}`
    );
  }
}

export function validateTfgFormData(data: TfgFormData): void {
  if (
    !data.title ||
    !data.subtitle ||
    !data.language ||
    !data.call ||
    !data.tutor
  ) {
    throw new Error("TfgValidator: Missing required fields in TFG data.");
  }
  if (!data.call.year || !data.call.month) {
    throw new Error("TfgValidator: Call year and month are required.");
  }
  if (
    typeof data.tutor !== "string" ||
    (data.coTutor && typeof data.coTutor !== "string")
  ) {
    throw new Error("TfgValidator: Tutor and co-tutor must be strings.");
  }
  if (!data.department) {
    throw new Error("TfgValidator: Department is required.");
  }
  // TODO: Add more validation logic if needed
}
