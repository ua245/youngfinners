export const SAMPLE_STUDENT_ID = "abc123@university.ac.uk";

export function isValidStudentId(studentId: string) {
  return studentId.trim().toLowerCase() === SAMPLE_STUDENT_ID;
}
