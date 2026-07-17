import type { SubjectKey } from './subject'
import { SUBJECT_KEY_TO_TOPICS } from './syllabus'
import type { SubjectTopicGroup } from './syllabus'

export const HIGH_YIELD_DEFAULT_COUNT = 5

/** High-yield topics first (CMS PYQ weight); remaining syllabus topics follow in original order. */
const HIGH_YIELD_PRIORITY: Record<SubjectKey, string[]> = {
  anatomy: [
    'Upper Limb',
    'Lower Limb',
    'Head & Neck',
    'Thorax',
    'Abdomen',
    'Neuroanatomy',
    'Pelvis & Perineum',
    'Embryology',
    'General Anatomy',
    'Histology',
    'Genetics',
    'Surface Anatomy',
    'Radiological Anatomy',
  ],
  physiology: [
    'Cardiovascular System',
    'Respiratory System',
    'Renal Physiology',
    'Endocrinology',
    'Central Nervous System',
    'Gastrointestinal System',
    'Blood',
    'Acid-Base Balance',
    'General Physiology',
    'Cell Physiology',
    'Nerve & Muscle',
    'Reproductive Physiology',
    'Special Senses',
    'Temperature Regulation',
  ],
  biochemistry: [
    'Carbohydrate Metabolism',
    'Lipid Metabolism',
    'Protein Metabolism',
    'Vitamins',
    'Enzymes',
    'Clinical Biochemistry',
    'Molecular Biology',
    'Nutrition',
    'Biomolecules',
    'Bioenergetics',
    'Nucleotide Metabolism',
    'DNA Replication',
    'Transcription',
    'Translation',
    'Gene Regulation',
    'Cancer Biochemistry',
  ],
  pathology: [
    'Neoplasia',
    'Inflammation',
    'Hematology',
    'Cardiovascular Pathology',
    'Respiratory Pathology',
    'Gastrointestinal Pathology',
    'Renal Pathology',
    'Liver & Biliary Pathology',
    'CNS',
    'Cell Injury',
    'Healing',
    'Hemodynamic Disorders',
    'Genetic Disorders',
    'Immunopathology',
    'Environmental Pathology',
    'Endocrine Pathology',
    'Breast',
    'Female Genital Tract',
    'Male Genital Tract',
    'Bone & Soft Tissue',
    'Skin',
    'Cytology',
  ],
  pharmacology: [
    'Antibiotics',
    'Autonomic Nervous System',
    'Cardiovascular Drugs',
    'Central Nervous System Drugs',
    'NSAIDs',
    'Endocrine Drugs',
    'Chemotherapy',
    'Antitubercular Drugs',
    'General Pharmacology',
    'Respiratory Drugs',
    'Gastrointestinal Drugs',
    'Antifungals',
    'Antivirals',
    'Antimalarials',
    'Anticancer Drugs',
    'Clinical Pharmacology',
    'Toxicology',
  ],
  microbiology: [
    'Bacteriology',
    'Virology',
    'Parasitology',
    'Immunology',
    'Vaccines',
    'Mycology',
    'Hospital Infection',
    'Sterilization & Disinfection',
    'Laboratory Diagnosis',
  ],
  forensic_medicine: [
    'Thanatology',
    'Mechanical Injuries',
    'Poisoning',
    'Identification',
    'Autopsy',
    'Medical Jurisprudence',
    'Thermal Injuries',
    'Sexual Offences',
    'Forensic Psychiatry',
  ],
  community_medicine: [
    'Epidemiology',
    'National Health Programmes',
    'Vaccination',
    'Biostatistics',
    'Screening',
    'Maternal & Child Health',
    'Nutrition',
    'Demography',
    'Environment',
    'Occupational Health',
    'Health Management',
    'International Health',
  ],
  general_medicine: [
    'Cardiology',
    'Infectious Diseases',
    'Respiratory Medicine',
    'Endocrinology',
    'Nephrology',
    'Neurology',
    'Gastroenterology',
    'ECG',
    'Critical Care',
    'Hematology',
    'Rheumatology',
    'Toxicology',
    'Electrolytes',
    'Acid-Base Disorders',
  ],
  dermatology: [
    'Leprosy',
    'Sexually Transmitted Diseases',
    'Bacterial Diseases',
    'Viral Diseases',
    'Fungal Diseases',
    'Autoimmune Disorders',
    'Skin Tumours',
    'Pigmentary Disorders',
    'Vesiculobullous Disorders',
    'Skin Anatomy',
  ],
  psychiatry: [
    'Schizophrenia',
    'Mood Disorders',
    'Anxiety Disorders',
    'Substance Abuse',
    'Psychopharmacology',
    'OCD',
    'Personality Disorders',
    'Child Psychiatry',
    'Sleep Disorders',
  ],
  general_surgery: [
    'General Surgery',
    'Trauma',
    'Gastrointestinal Surgery',
    'Breast',
    'Thyroid',
    'Hepatobiliary Surgery',
    'Urology',
    'Shock',
    'Burns',
    'Wound Healing',
    'Pancreatic Surgery',
    'Vascular Surgery',
    'Neurosurgery',
    'Plastic Surgery',
  ],
  orthopedics: [
    'Fractures',
    'Arthritis',
    'Spine',
    'Osteomyelitis',
    'Sports Injuries',
    'Bone Tumours',
    'Metabolic Bone Disease',
    'Pediatric Orthopaedics',
  ],
  anesthesiology: [
    'Airway Management',
    'General Anaesthesia',
    'ICU',
    'CPR',
    'Ventilation',
    'Local Anaesthesia',
    'Monitoring',
    'Pain Management',
  ],
  radiology: [
    'X-Ray',
    'CT',
    'MRI',
    'Ultrasound',
    'Contrast Media',
    'Nuclear Medicine',
    'Radiation Physics',
    'Interventional Radiology',
  ],
  obstetrics_and_gynecology: [
    'Antenatal Care',
    'Labour',
    'High-Risk Pregnancy',
    'Hypertension in Pregnancy',
    'Postpartum Hemorrhage',
    'Contraception',
    'Infertility',
    'Physiology of Pregnancy',
    'Diabetes in Pregnancy',
    'Menstrual Disorders',
    'Gynecologic Oncology',
    'Urogynecology',
  ],
  pediatrics: [
    'Neonatology',
    'Growth & Development',
    'Vaccination',
    'Pediatric Infections',
    'Pediatric Emergencies',
    'Nutrition',
    'Cardiology',
    'Neurology',
    'Nephrology',
  ],
  ophthalmology: [
    'Glaucoma',
    'Cataract',
    'Retina',
    'Uveitis',
    'Neuro-Ophthalmology',
    'Ocular Trauma',
    'Anatomy',
    'Optics',
  ],
  ent: [
    'Ear',
    'Nose',
    'Larynx',
    'Pharynx',
    'Neck',
    'Paranasal Sinuses',
    'Audiology',
    'Vestibular Disorders',
    'Oral Cavity',
  ],
}

function buildTopicsByYield(subject: SubjectKey): string[] {
  const all = SUBJECT_KEY_TO_TOPICS[subject] ?? []
  const priority = HIGH_YIELD_PRIORITY[subject] ?? []
  const allSet = new Set(all)
  const ordered = priority.filter((topic) => allSet.has(topic))
  for (const topic of all) {
    if (!ordered.includes(topic)) ordered.push(topic)
  }
  return ordered
}

export const SUBJECT_TOPICS_BY_YIELD: Record<SubjectKey, string[]> =
  Object.fromEntries(
    (Object.keys(SUBJECT_KEY_TO_TOPICS) as SubjectKey[]).map((subject) => [
      subject,
      buildTopicsByYield(subject),
    ]),
  ) as Record<SubjectKey, string[]>

export function getTopicsByYieldForSubjects(
  subjects: SubjectKey[],
): SubjectTopicGroup[] {
  return subjects.map((subject) => ({
    subject,
    topics: SUBJECT_TOPICS_BY_YIELD[subject] ?? [],
  }))
}

export function getFlatTopicsByYieldForSubjects(
  subjects: SubjectKey[],
): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const subject of subjects) {
    for (const topic of SUBJECT_TOPICS_BY_YIELD[subject] ?? []) {
      if (!seen.has(topic)) {
        seen.add(topic)
        result.push(topic)
      }
    }
  }
  return result
}

export function getDefaultHighYieldTopicsForSubject(
  subject: SubjectKey,
): string[] {
  const topics = SUBJECT_TOPICS_BY_YIELD[subject] ?? []
  return topics.slice(0, HIGH_YIELD_DEFAULT_COUNT)
}

export function getDefaultHighYieldTopics(subjects: SubjectKey[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const subject of subjects) {
    for (const topic of getDefaultHighYieldTopicsForSubject(subject)) {
      if (!seen.has(topic)) {
        seen.add(topic)
        result.push(topic)
      }
    }
  }
  return result
}

export function isHighYieldTopic(subject: SubjectKey, topic: string): boolean {
  const topics = SUBJECT_TOPICS_BY_YIELD[subject] ?? []
  const index = topics.indexOf(topic)
  return index >= 0 && index < HIGH_YIELD_DEFAULT_COUNT
}
