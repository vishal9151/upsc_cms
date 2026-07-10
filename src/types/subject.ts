export const SUBJECTS = [
  { key: "anatomy", label: "Anatomy" },
  { key: "physiology", label: "Physiology" },
  { key: "biochemistry", label: "Biochemistry" },
  { key: "pathology", label: "Pathology" },
  { key: "pharmacology", label: "Pharmacology" },
  { key: "microbiology", label: "Microbiology" },
  { key: "forensic_medicine", label: "Forensic Medicine" },
  { key: "community_medicine", label: "Community Medicine" },
  { key: "general_medicine", label: "General Medicine" },
  { key: "dermatology", label: "Dermatology" },
  { key: "psychiatry", label: "Psychiatry" },
  { key: "general_surgery", label: "General Surgery" },
  { key: "orthopedics", label: "Orthopedics" },
  { key: "anesthesiology", label: "Anesthesiology" },
  { key: "radiology", label: "Radiology" },
  { key: "obstetrics_and_gynecology", label: "Obstetrics & Gynecology" },
  { key: "pediatrics", label: "Pediatrics" },
  { key: "ophthalmology", label: "Ophthalmology" },
  { key: "ent", label: "ENT" },
] as const

export type SubjectKey = typeof SUBJECTS[number]["key"]

export function getSubjectLabel(key: SubjectKey): string {
  const subject = SUBJECTS.find(subject => subject.key === key)
  return subject ? subject.label : key
}