import { Student, SchemeOfWork, LessonPlan, RecordOfWork, Assignment, Quiz, ResourceItem, TimetableSlot, CalendarEvent, Notice, GradeLevel, SubjectName, StaffMember } from '../types';

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'tr-elvis',
    name: 'MR ELVIS',
    tscNumber: 'TSC/492810/2016',
    role: 'Creative Arts, Social Studies & Mathematics Specialist',
    primaryGrade: 'All Grades',
    specialization: ['Creative Arts (Grades 1–6)', 'Social Studies (Grades 4–6)', 'Mathematics (Grades 4–6)'],
    phone: '0798 193966',
    email: 'elvis@littleroses.ac.ke',
    joinedYear: 2018,
    status: 'Active'
  },
  {
    id: 'tr-fresiah',
    name: 'MADAM FRESIAH',
    tscNumber: 'TSC/421908/2015',
    role: 'Senior Mathematics, Science & C.R.E Specialist',
    primaryGrade: 'All Grades',
    specialization: ['Mathematics (Grades 1, 3, 4)', 'Science (Grades 4–6)', 'C.R.E (Grades 1–6)'],
    phone: '0722 789012',
    email: 'fresiah@littleroses.ac.ke',
    joinedYear: 2017,
    status: 'Active'
  },
  {
    id: 'tr-kelvin',
    name: 'MR KELVIN',
    tscNumber: 'TSC/384920/2012',
    role: 'Headteacher & Senior English / Agriculture Master',
    primaryGrade: 'All Grades',
    specialization: ['English (Grades 1–6)', 'Agriculture (Grades 4–6)', 'Administration & Leadership'],
    phone: '0798 193966',
    email: 'roseslittle3@gmail.com',
    joinedYear: 2015,
    status: 'Active'
  },
  {
    id: 'tr-liz',
    name: 'MADAM LIZ',
    tscNumber: 'TSC/518290/2019',
    role: 'Senior Kiswahili & Early Years Lead Teacher',
    primaryGrade: 'Grade 2',
    specialization: ['Kiswahili (Grades 1–6)', 'Mathematics (Grade 2)', 'Environmental Activities (Grades 1–3)'],
    phone: '0714 567890',
    email: 'liz@littleroses.ac.ke',
    joinedYear: 2019,
    status: 'Active'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-601',
    admissionNumber: 'LRA-2021-084',
    name: 'Brian Ochieng',
    gender: 'Male',
    grade: 'Grade 6',
    avatarUrl: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=200&auto=format&fit=crop&q=80',
    parentName: 'Mr. David Ochieng',
    parentPhone: '0712 345678',
    emergencyContact: '0722 987654',
    dob: '2014-05-12',
    attendanceRate: 98,
    teacherRemarks: 'Brian is an enthusiastic learner with excellent problem-solving skills in Mathematics and Science.',
    headteacherRemarks: 'Promising young scholar. Recommended for Junior School preparatory track.',
    catMarks: {
      'Mathematics': { cat1: 26, cat2: 28, endTerm: 88 },
      'English': { cat1: 24, cat2: 25, endTerm: 82 },
      'Kiswahili': { cat1: 22, cat2: 24, endTerm: 76 },
      'Science': { cat1: 27, cat2: 29, endTerm: 92 },
      'Agriculture': { cat1: 23, cat2: 26, endTerm: 80 },
      'Creative Arts': { cat1: 25, cat2: 27, endTerm: 85 },
      'Social Studies': { cat1: 22, cat2: 23, endTerm: 74 },
      'CRE': { cat1: 26, cat2: 28, endTerm: 90 },
    }
  },
  {
    id: 'std-602',
    admissionNumber: 'LRA-2021-091',
    name: 'Faith Wanjiku Mwangi',
    gender: 'Female',
    grade: 'Grade 6',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    parentName: 'Mrs. Grace Mwangi',
    parentPhone: '0720 112233',
    emergencyContact: '0733 445566',
    dob: '2014-08-23',
    attendanceRate: 100,
    teacherRemarks: 'Outstanding creative and linguistic expression. Very disciplined and cooperative in group activities.',
    headteacherRemarks: 'Exemplary leadership qualities demonstrated as head girl.',
    catMarks: {
      'Mathematics': { cat1: 27, cat2: 29, endTerm: 94 },
      'English': { cat1: 28, cat2: 29, endTerm: 96 },
      'Kiswahili': { cat1: 26, cat2: 28, endTerm: 89 },
      'Science': { cat1: 26, cat2: 27, endTerm: 88 },
      'Agriculture': { cat1: 25, cat2: 28, endTerm: 86 },
      'Creative Arts': { cat1: 29, cat2: 30, endTerm: 98 },
      'Social Studies': { cat1: 27, cat2: 28, endTerm: 91 },
      'CRE': { cat1: 28, cat2: 29, endTerm: 95 },
    }
  },
  {
    id: 'std-603',
    admissionNumber: 'LRA-2021-105',
    name: 'Kevin Kipchumba',
    gender: 'Male',
    grade: 'Grade 6',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    parentName: 'Mr. Emmanuel Kipchumba',
    parentPhone: '0711 778899',
    emergencyContact: '0728 334455',
    dob: '2014-02-17',
    attendanceRate: 94,
    teacherRemarks: 'Has great passion for practical Agriculture and Athletics. Improving in Kiswahili grammar.',
    headteacherRemarks: 'Hardworking pupil with steady positive trajectory.',
    catMarks: {
      'Mathematics': { cat1: 20, cat2: 22, endTerm: 70 },
      'English': { cat1: 21, cat2: 23, endTerm: 72 },
      'Kiswahili': { cat1: 18, cat2: 20, endTerm: 64 },
      'Science': { cat1: 24, cat2: 25, endTerm: 80 },
      'Agriculture': { cat1: 28, cat2: 29, endTerm: 93 },
      'Creative Arts': { cat1: 22, cat2: 24, endTerm: 75 },
      'Social Studies': { cat1: 20, cat2: 22, endTerm: 69 },
      'CRE': { cat1: 23, cat2: 25, endTerm: 78 },
    }
  },
  {
    id: 'std-501',
    admissionNumber: 'LRA-2022-042',
    name: 'Joy Njeri Kamau',
    gender: 'Female',
    grade: 'Grade 5',
    parentName: 'Mrs. Esther Kamau',
    parentPhone: '0722 334455',
    emergencyContact: '0721 998877',
    dob: '2015-09-14',
    attendanceRate: 96,
    teacherRemarks: 'Joy shows exemplary critical thinking during Science inquiry sessions.',
    headteacherRemarks: 'Active participant in school debate and music festival.',
    catMarks: {
      'Mathematics': { cat1: 25, cat2: 27, endTerm: 86 },
      'English': { cat1: 26, cat2: 27, endTerm: 88 },
      'Kiswahili': { cat1: 24, cat2: 25, endTerm: 82 },
      'Science': { cat1: 26, cat2: 28, endTerm: 90 },
      'Agriculture': { cat1: 22, cat2: 25, endTerm: 79 },
      'Creative Arts': { cat1: 27, cat2: 28, endTerm: 91 },
      'Social Studies': { cat1: 24, cat2: 26, endTerm: 83 },
      'CRE': { cat1: 27, cat2: 28, endTerm: 92 },
    }
  },
  {
    id: 'std-502',
    admissionNumber: 'LRA-2022-056',
    name: 'Samuel Ndung’u',
    gender: 'Male',
    grade: 'Grade 5',
    parentName: 'Mr. Patrick Ndung’u',
    parentPhone: '0700 445566',
    emergencyContact: '0715 667788',
    dob: '2015-11-03',
    attendanceRate: 95,
    teacherRemarks: 'Very attentive and helpful in classroom group projects.',
    headteacherRemarks: 'Good conduct and polite demeanor.',
    catMarks: {
      'Mathematics': { cat1: 23, cat2: 24, endTerm: 78 },
      'English': { cat1: 22, cat2: 24, endTerm: 76 },
      'Kiswahili': { cat1: 23, cat2: 25, endTerm: 80 },
      'Science': { cat1: 25, cat2: 26, endTerm: 84 },
      'Agriculture': { cat1: 24, cat2: 26, endTerm: 82 },
      'Creative Arts': { cat1: 21, cat2: 23, endTerm: 73 },
      'Social Studies': { cat1: 22, cat2: 24, endTerm: 77 },
      'CRE': { cat1: 24, cat2: 26, endTerm: 85 },
    }
  },
  {
    id: 'std-401',
    admissionNumber: 'LRA-2023-018',
    name: 'Amina Hassan Mohamed',
    gender: 'Female',
    grade: 'Grade 4',
    parentName: 'Mr. Hassan Mohamed',
    parentPhone: '0714 556677',
    emergencyContact: '0725 889900',
    dob: '2016-04-19',
    attendanceRate: 99,
    teacherRemarks: 'Brilliant student with high linguistic prowess and creative drawing flair.',
    headteacherRemarks: 'Consistently top of her class.',
    catMarks: {
      'Mathematics': { cat1: 28, cat2: 29, endTerm: 94 },
      'English': { cat1: 29, cat2: 30, endTerm: 98 },
      'Kiswahili': { cat1: 27, cat2: 28, endTerm: 92 },
      'Science': { cat1: 27, cat2: 29, endTerm: 93 },
      'Agriculture': { cat1: 26, cat2: 28, endTerm: 89 },
      'Creative Arts': { cat1: 28, cat2: 29, endTerm: 95 },
      'Social Studies': { cat1: 26, cat2: 28, endTerm: 90 },
      'CRE': { cat1: 28, cat2: 29, endTerm: 94 },
    }
  },
  {
    id: 'std-301',
    admissionNumber: 'LRA-2024-009',
    name: 'Ethan Mutua',
    gender: 'Male',
    grade: 'Grade 3',
    parentName: 'Dr. Joseph Mutua',
    parentPhone: '0723 998811',
    emergencyContact: '0719 332211',
    dob: '2017-06-11',
    attendanceRate: 97,
    teacherRemarks: 'Reads with clear diction and enjoys practical discovery in Science.',
    headteacherRemarks: 'Great talent and enthusiasm.',
    catMarks: {
      'Mathematics': { cat1: 26, cat2: 27, endTerm: 88 },
      'English': { cat1: 25, cat2: 27, endTerm: 87 },
      'Kiswahili': { cat1: 23, cat2: 25, endTerm: 80 },
      'Science': { cat1: 27, cat2: 28, endTerm: 91 },
      'Agriculture': { cat1: 24, cat2: 26, endTerm: 83 },
      'Creative Arts': { cat1: 26, cat2: 27, endTerm: 89 },
      'Social Studies': { cat1: 24, cat2: 25, endTerm: 82 },
      'CRE': { cat1: 25, cat2: 27, endTerm: 88 },
    }
  },
  {
    id: 'std-201',
    admissionNumber: 'LRA-2025-015',
    name: 'Precious Kerubo',
    gender: 'Female',
    grade: 'Grade 2',
    parentName: 'Mrs. Linet Kerubo',
    parentPhone: '0702 443322',
    emergencyContact: '0718 112233',
    dob: '2018-09-02',
    attendanceRate: 98,
    teacherRemarks: 'Precious loves singing, storytelling, and group games. Very disciplined.',
    headteacherRemarks: 'Delightful learner with strong foundation skills.',
    catMarks: {
      'Mathematics': { cat1: 27, cat2: 28, endTerm: 90 },
      'English': { cat1: 28, cat2: 29, endTerm: 93 },
      'Kiswahili': { cat1: 25, cat2: 27, endTerm: 86 },
      'Science': { cat1: 26, cat2: 28, endTerm: 89 },
      'Agriculture': { cat1: 24, cat2: 26, endTerm: 84 },
      'Creative Arts': { cat1: 29, cat2: 30, endTerm: 97 },
      'Social Studies': { cat1: 25, cat2: 27, endTerm: 87 },
      'CRE': { cat1: 27, cat2: 28, endTerm: 91 },
    }
  },
  {
    id: 'std-101',
    admissionNumber: 'LRA-2026-004',
    name: 'Liam Kiprotich',
    gender: 'Male',
    grade: 'Grade 1',
    parentName: 'Mr. Caleb Kiprotich',
    parentPhone: '0717 887766',
    emergencyContact: '0729 443322',
    dob: '2019-12-05',
    attendanceRate: 96,
    teacherRemarks: 'Active participant in early numeracy games and alphabet rhymes.',
    headteacherRemarks: 'Settled in wonderfully at Little Roses Academy.',
    catMarks: {
      'Mathematics': { cat1: 25, cat2: 26, endTerm: 84 },
      'English': { cat1: 26, cat2: 27, endTerm: 87 },
      'Kiswahili': { cat1: 24, cat2: 25, endTerm: 81 },
      'Science': { cat1: 26, cat2: 28, endTerm: 89 },
      'Agriculture': { cat1: 23, cat2: 25, endTerm: 80 },
      'Creative Arts': { cat1: 28, cat2: 29, endTerm: 94 },
      'Social Studies': { cat1: 24, cat2: 26, endTerm: 83 },
      'CRE': { cat1: 26, cat2: 27, endTerm: 88 },
    }
  }
];

export const INITIAL_SCHEMES: SchemeOfWork[] = [
  {
    id: 'sow-01',
    grade: 'Grade 6',
    subject: 'Science',
    term: 'Term 1',
    week: 1,
    lesson: 1,
    strand: 'Living Things and Their Environment',
    subStrand: 'Human Circulatory System',
    specificLearningOutcomes: 'By the end of the lesson, the learner should be able to: a) Identify the main components of blood. b) State the functions of red and white blood cells. c) Value healthy nutrition in blood maintenance.',
    keyInquiryQuestions: 'How does blood travel throughout the human body?',
    learningExperiences: 'Learners in small groups examine blood circulation charts and watch an animation of red and white blood cells.',
    learningResources: 'CBC Science Grade 6 Learner Book, 3D anatomical charts, digital projector',
    assessmentMethods: 'Oral questions, peer assessment, observation checklist',
    reflectionRemarks: '95% of learners successfully sketched and labeled the blood vessel functions.',
    attachments: [{ name: 'Circulatory_System_Guide.pdf', size: '1.4 MB' }],
    updatedAt: '2026-01-15'
  },
  {
    id: 'sow-02',
    grade: 'Grade 6',
    subject: 'Mathematics',
    term: 'Term 1',
    week: 2,
    lesson: 3,
    strand: 'Numbers and Operations',
    subStrand: 'Fractions, Decimals and Percentages',
    specificLearningOutcomes: 'Convert recurring decimals into common fractions; solve real-life word problems involving percentage profits and discounts.',
    keyInquiryQuestions: 'Why are discounts calculated in percentages at shopping centers?',
    learningExperiences: 'Learners set up a mini supermarket classroom stall and calculate discounted prices on items.',
    learningResources: 'Play money, price tags, Kenya currency charts, Mathematics Grade 6 Textbook',
    assessmentMethods: 'Written exercise, group presentation, practical rubric',
    reflectionRemarks: 'Pupils demonstrated high confidence in determining net selling prices.',
    attachments: [{ name: 'Math_Percentages_Worksheet.pdf', size: '820 KB' }],
    updatedAt: '2026-01-22'
  },
  {
    id: 'sow-03',
    grade: 'Grade 5',
    subject: 'Agriculture',
    term: 'Term 1',
    week: 3,
    lesson: 2,
    strand: 'Crop Production & Soil Care',
    subStrand: 'Organic Manure Preparation',
    specificLearningOutcomes: 'Describe the steps of constructing a compost heap; demonstrate safe handling of farm tools.',
    keyInquiryQuestions: 'How does organic compost enrich soil nutrients naturally?',
    learningExperiences: 'Hands-on practical session at the Little Roses school agricultural demo garden.',
    learningResources: 'Dry maize stalks, green leaves, topsoil, wheelbarrows, garden forks',
    assessmentMethods: 'Practical skill evaluation checklist, project portfolio',
    reflectionRemarks: 'Compost pit established successfully behind the science lab.',
    attachments: [{ name: 'Compost_Preparation_Guide.pdf', size: '2.1 MB' }],
    updatedAt: '2026-01-29'
  }
];

export const INITIAL_LESSON_PLANS: LessonPlan[] = [
  {
    id: 'lp-01',
    grade: 'Grade 6',
    subject: 'Science',
    term: 'Term 1',
    week: 3,
    lessonNumber: 2,
    date: '2026-02-04',
    durationMinutes: 40,
    strand: 'Matter and Energy',
    subStrand: 'Light: Reflection and Refraction',
    specificLearningOutcomes: 'By the end of the lesson, the learner should be able to: 1. Demonstrate reflection of light using plane mirrors. 2. Measure angle of incidence and angle of reflection.',
    keyInquiryQuestions: 'Why do we see our image upright in a bathroom mirror?',
    coreCompetencies: ['Critical thinking and problem solving', 'Collaboration', 'Digital literacy'],
    values: ['Respect', 'Responsibility', 'Integrity'],
    organizationOfLearning: 'Groups of four learners per science bench with apparatus kits.',
    introduction: 'Teacher shines a laser pointer onto a flat mirror to prompt discussion on light bouncing.',
    lessonDevelopment: 'Step 1: Groups set up ray boxes and plane mirrors. Step 2: Learners measure angles using protractors. Step 3: Tabulate results and formulate the law of reflection.',
    conclusion: 'Teacher summarizes findings with learners and assigns real-world reflection examples.',
    summaryRemarks: 'Excellent student engagement and accurate measurement observed.',
    attachments: [{ name: 'Light_Reflection_Practical.pdf', size: '1.1 MB' }]
  },
  {
    id: 'lp-02',
    grade: 'Grade 6',
    subject: 'English',
    term: 'Term 1',
    week: 4,
    lessonNumber: 1,
    date: '2026-02-09',
    durationMinutes: 40,
    strand: 'Reading & Comprehension',
    subStrand: 'Context Clues & Descriptive Vocabulary',
    specificLearningOutcomes: 'Infer the meaning of unfamiliar vocabulary using surrounding textual context clues; write descriptive paragraphs.',
    keyInquiryQuestions: 'How do adjectives bring a story to vivid life?',
    coreCompetencies: ['Communication and collaboration', 'Self-efficacy'],
    values: ['Empathy', 'Unity'],
    organizationOfLearning: 'Paired reading and whole-class discussion.',
    introduction: 'Read a captivating excerpt describing Lake Nakuru national park flamingos.',
    lessonDevelopment: 'Step 1: Highlight new adjectives. Step 2: Deduce definitions from context. Step 3: Peer-edit short 5-sentence descriptive passages.',
    conclusion: '3 learners volunteer to read their descriptions aloud to the class.',
    summaryRemarks: 'Vocabulary retention was high; homework assigned in workbook page 44.',
    attachments: [{ name: 'Descriptive_Writing_Guide.pdf', size: '650 KB' }]
  }
];

export const INITIAL_RECORDS_OF_WORK: RecordOfWork[] = [
  {
    id: 'row-01',
    grade: 'Grade 6',
    subject: 'Science',
    term: 'Term 1',
    week: 1,
    lesson: 1,
    workPlanned: 'Introduction to Human Organ Systems: Respiratory and Circulatory Overview.',
    workCovered: 'Covered fully according to scheme; students drew the heart and lungs in note books.',
    challengesEncountered: 'Limited time for in-depth model demonstration.',
    remedialAction: 'Scheduled 15 minutes in practical lab session on Thursday.',
    teacherSignature: 'Jane Wangari (Tr)',
    dateChecked: '2026-01-16'
  },
  {
    id: 'row-02',
    grade: 'Grade 6',
    subject: 'Mathematics',
    term: 'Term 1',
    week: 2,
    lesson: 2,
    workPlanned: 'Addition and Subtraction of Algebraic Expressions.',
    workCovered: 'All subtopics covered; learners solved 15 practice items correctly.',
    challengesEncountered: 'Confusion with negative integers in brackets for 3 learners.',
    remedialAction: 'Conducted morning remedial tutoring with extra visual number line aids.',
    teacherSignature: 'Jane Wangari (Tr)',
    dateChecked: '2026-01-23'
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-01',
    title: 'Science: Diagram of the Human Heart & Blood Flow',
    grade: 'Grade 6',
    subject: 'Science',
    term: 'Term 1',
    dueDate: '2026-03-12',
    totalMarks: 30,
    instructions: 'Draw and neatly color a cross-section of the human heart. Clearly label the 4 chambers (atria and ventricles) and draw arrows showing oxygenated and deoxygenated blood flow paths.',
    attachments: [{ name: 'Heart_Diagram_Rubric.pdf', size: '920 KB' }],
    submissionsCount: 18,
    createdAt: '2026-03-01'
  },
  {
    id: 'asg-02',
    title: 'Mathematics: Practical Budgeting & Percentage Discount Project',
    grade: 'Grade 6',
    subject: 'Mathematics',
    term: 'Term 1',
    dueDate: '2026-03-15',
    totalMarks: 25,
    instructions: 'Compile a realistic 1-month family grocery shopping list with prices. Calculate a 10% discount on cereals and 15% discount on dairy products. Submit your final tabular ledger.',
    attachments: [{ name: 'Budget_Project_Template.pdf', size: '540 KB' }],
    submissionsCount: 15,
    createdAt: '2026-03-02'
  },
  {
    id: 'asg-03',
    title: 'Creative Arts: Traditional Kenyan Folk Music Instruments',
    grade: 'Grade 5',
    subject: 'Creative Arts',
    term: 'Term 1',
    dueDate: '2026-03-18',
    totalMarks: 20,
    instructions: 'Research and sketch three traditional Kenyan musical instruments (e.g. Nyatiti, Isukuti drum, Wandindi). State the community of origin and materials used in crafting each.',
    attachments: [{ name: 'Traditional_Instruments_Sheet.pdf', size: '1.2 MB' }],
    submissionsCount: 12,
    createdAt: '2026-03-04'
  }
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-01',
    title: 'Grade 6 Science: Blood Circulation & Respiration Challenge',
    grade: 'Grade 6',
    subject: 'Science',
    timeLimitMinutes: 10,
    createdAt: '2026-02-10',
    questions: [
      {
        id: 'q1',
        question: 'Which component of blood is primarily responsible for carrying oxygen throughout the body?',
        options: ['Red Blood Cells (Hemoglobin)', 'White Blood Cells', 'Blood Plasma', 'Blood Platelets'],
        correctIndex: 0,
        explanation: 'Red blood cells contain hemoglobin which binds with oxygen in the lungs and transports it to all tissues.'
      },
      {
        id: 'q2',
        question: 'Which chamber of the human heart pumps oxygen-rich blood to the rest of the body?',
        options: ['Right Atrium', 'Left Ventricle', 'Right Ventricle', 'Left Atrium'],
        correctIndex: 1,
        explanation: 'The Left Ventricle has the thickest muscular wall and pumps oxygenated blood into the aorta for systemic distribution.'
      },
      {
        id: 'q3',
        question: 'What is the primary function of blood platelets in the human body?',
        options: ['Fight pathogens and viruses', 'Transport digested food nutrients', 'Facilitate blood clotting at wounds', 'Regulate body temperature'],
        correctIndex: 2,
        explanation: 'Platelets adhere together and form clots to stop excessive bleeding from damaged blood vessels.'
      },
      {
        id: 'q4',
        question: 'Which blood vessel carries deoxygenated blood from the heart to the lungs?',
        options: ['Aorta', 'Pulmonary Artery', 'Pulmonary Vein', 'Vena Cava'],
        correctIndex: 1,
        explanation: 'The Pulmonary Artery is unique among arteries because it carries deoxygenated blood to the lungs for oxygenation.'
      }
    ]
  },
  {
    id: 'quiz-02',
    title: 'Grade 6 Mathematics: Speed, Distance & Time Mastery',
    grade: 'Grade 6',
    subject: 'Mathematics',
    timeLimitMinutes: 8,
    createdAt: '2026-02-18',
    questions: [
      {
        id: 'qm1',
        question: 'A bus travels from Nakuru to Nairobi, a distance of 160 km, in 2 hours. What is its average speed?',
        options: ['60 km/h', '80 km/h', '100 km/h', '75 km/h'],
        correctIndex: 1,
        explanation: 'Speed = Distance ÷ Time = 160 km ÷ 2 hours = 80 km/h.'
      },
      {
        id: 'qm2',
        question: 'Convert 72 km/h into meters per second (m/s):',
        options: ['15 m/s', '20 m/s', '25 m/s', '30 m/s'],
        correctIndex: 1,
        explanation: 'Multiply by 5/18: 72 × (5/18) = 4 × 5 = 20 m/s.'
      },
      {
        id: 'qm3',
        question: 'If a cyclist rides at 15 km/h for 3 hours and 20 minutes, how far did they travel?',
        options: ['45 km', '50 km', '55 km', '60 km'],
        correctIndex: 1,
        explanation: '3 hrs 20 mins = 3 1/3 hours = 10/3 hrs. Distance = 15 × (10/3) = 50 km.'
      }
    ]
  },
  {
    id: 'quiz-03',
    title: 'Grade 5 Agriculture: Soil Conservation & Water Harvesting',
    grade: 'Grade 5',
    subject: 'Agriculture',
    timeLimitMinutes: 10,
    createdAt: '2026-02-25',
    questions: [
      {
        id: 'qa1',
        question: 'Which of the following is a physical method of conserving soil on a sloping hillside?',
        options: ['Overgrazing', 'Contour Terracing', 'Deforestation', 'Burning dry bushes'],
        correctIndex: 1,
        explanation: 'Contour terracing slows down runoff water and traps topsoil along slopes.'
      },
      {
        id: 'qa2',
        question: 'What is the main benefit of mulching around growing vegetable crops?',
        options: ['Attracts insects', 'Conserves soil moisture & suppresses weeds', 'Increases soil erosion', 'Cools plant leaves only'],
        correctIndex: 1,
        explanation: 'Mulch forms a protective layer that drastically cuts down evaporation and blocks sunlight from weed seeds.'
      }
    ]
  }
];

export const INITIAL_RESOURCES: ResourceItem[] = [
  {
    id: 'res-01',
    title: 'CBC Grade 6 Science & Technology Official Curriculum Guide',
    grade: 'Grade 6',
    subject: 'Science',
    category: 'Textbook',
    fileType: 'pdf',
    inputType: 'PDF_ATTACHMENT',
    fileName: 'CBC_Grade_6_Science_Official_Curriculum_Guide.pdf',
    fileSize: '4.8 MB',
    description: 'Official KICD approved Grade 6 CBC Science curriculum modules, experiments, and competency frameworks.',
    uploadedAt: '2026-01-10',
    authorRole: 'ADMIN'
  },
  {
    id: 'res-02',
    title: 'Grade 6 Mathematics Model Mid-Term & End-Term CAT Exam Papers',
    grade: 'Grade 6',
    subject: 'Mathematics',
    category: 'Revision Paper',
    fileType: 'pdf',
    inputType: 'PDF_ATTACHMENT',
    fileName: 'Grade_6_Mathematics_Term1_Term2_CAT_Papers.pdf',
    fileSize: '2.2 MB',
    description: 'Past examination papers with complete worked step-by-step marking schemes for Term 1 and 2.',
    uploadedAt: '2026-01-20',
    authorRole: 'ADMIN'
  },
  {
    id: 'res-03',
    title: 'CBE Science & Technology: Human Circulatory & Digestive System Notes',
    grade: 'Grade 6',
    subject: 'Science',
    category: 'Lesson Notes',
    fileType: 'markdown',
    inputType: 'RAW_TEXT_AI_COPY',
    fileSize: '18 KB',
    description: 'Comprehensive markdown formatted revision notes covering heart chambers, blood vessels, and dietary digestion pathways.',
    uploadedAt: '2026-02-02',
    authorRole: 'ADMIN',
    markdownContent: `# Human Circulatory & Respiratory Systems
**Subject**: Science & Technology • **Grade**: Grade 6 • **Term**: Term 1

---

### Core Competencies Addressed:
- *Critical thinking and problem solving* in distinguishing oxygenated and deoxygenated pathways.
- *Digital literacy and communication* in explaining biological processes.

---

## 1. The Human Heart Structure
The heart is a muscular organ that pumps blood throughout the body. It consists of four distinct chambers:
1. **Right Atrium**: Receives deoxygenated blood returning from bodily tissues via the *Vena Cava*.
2. **Right Ventricle**: Pumps deoxygenated blood into the *Pulmonary Artery* toward the lungs.
3. **Left Atrium**: Receives fresh, oxygenated blood from the lungs via the *Pulmonary Veins*.
4. **Left Ventricle**: The thickest muscular chamber; pumps oxygen-rich blood into the *Aorta* for systemic distribution.

> **Key Rule**: All arteries carry oxygenated blood away from the heart *except* the Pulmonary Artery. All veins carry deoxygenated blood toward the heart *except* the Pulmonary Vein.

---

## 2. Components of Human Blood

| Component | Primary Function | Distinct Characteristic |
| :--- | :--- | :--- |
| **Red Blood Cells (Erythrocytes)** | Carries oxygen bound to hemoglobin | Biconcave disc shape, no nucleus |
| **White Blood Cells (Leukocytes)** | Fights off pathogens and infections | Irregular shape, contains large nucleus |
| **Platelets (Thrombocytes)** | Essential for blood clotting at open wounds | Cellular fragments |
| **Blood Plasma** | Liquid medium transporting nutrients, hormones & urea | 90% water with dissolved proteins |

---

## 3. Class Inquiry Exercise
1. Why is the muscular wall of the left ventricle significantly thicker than that of the right ventricle?
2. Explain the vital role played by blood platelets when a learner grazes their knee on the sports pitch.`
  },
  {
    id: 'res-04',
    title: 'Agriculture & Environmental Conservation: Soil Erosion Control Handbook',
    grade: 'Grade 6',
    subject: 'Agriculture',
    category: 'Teaching Aid',
    fileType: 'markdown',
    inputType: 'RAW_TEXT_AI_COPY',
    fileSize: '24 KB',
    description: 'Formatted field guide on constructing contour terraces, trash lines, and gabions for soil conservation in Nakuru agricultural zones.',
    uploadedAt: '2026-02-12',
    authorRole: 'ADMIN',
    markdownContent: `# Soil Conservation & Water Harvesting Field Guide
**Subject**: Agriculture & Nutrition • **Grade**: Grade 6 • **Ecological Zone**: Rift Valley / Nakuru County

---

## 1. Major Causes of Soil Erosion
- **Water Runoff**: High velocity storm water carrying away loose topsoil on slopes.
- **Wind Velocity**: Dry season winds stripping fine organic particles from bare land.
- **Human Activities**: Overgrazing, burning crop residues, and improper plowing across contours.

---

## 2. Physical & Biological Conservation Methods
### A. Contour Terracing
- Excavating trenches along measured contour lines to slow down downhill water flow.
- Traps sediment while allowing moisture to infiltrate root zones.

### B. Trash Lines & Mulching
- Laying maize stalks and dry vegetative matter along field contours.
- Provides immediate organic ground cover and encourages earthworm activity.

### C. Check Dams & Gabions
- Wire mesh cages filled with stones positioned across active gullies.
- Traps soil silt during heavy downpours and re-levels eroded drainage ways.

---

## 3. Practical Field Assessment Checklist
- [x] Identify slope gradient using an A-frame level.
- [x] Dig vetiver grass planting furrows along contour ridges.
- [x] Record soil depth before and after heavy rainfall events.`
  },
  {
    id: 'res-05',
    title: 'Kiswahili Sarufi na Ushairi: Mwongozo wa Mwanafunzi Darasa la Sita',
    grade: 'Grade 6',
    subject: 'Kiswahili',
    category: 'Revision Paper',
    fileType: 'pdf',
    inputType: 'PDF_ATTACHMENT',
    fileName: 'Kiswahili_Sarufi_na_Ushairi_Mwongozo_G6.pdf',
    fileSize: '2.9 MB',
    description: 'Muhtasari wa ngeli za nomino, vitenzi, semi na methali zenye mifano kamili ya KPSEA.',
    uploadedAt: '2026-02-14',
    authorRole: 'ADMIN'
  }
];

export const INITIAL_TIMETABLE: TimetableSlot[] = [
  // Monday
  { id: 'tt-m1', grade: 'Grade 6', day: 'Monday', timeSlot: '08:00 - 08:30', periodNumber: 0, subject: 'Morning Assembly', teacherName: 'All Staff', room: 'Assembly Ground', isBreak: true },
  { id: 'tt-m2', grade: 'Grade 6', day: 'Monday', timeSlot: '08:30 - 09:10', periodNumber: 1, subject: 'Mathematics', teacherName: 'Tr. Jane Wangari', room: 'Room 6A' },
  { id: 'tt-m3', grade: 'Grade 6', day: 'Monday', timeSlot: '09:10 - 09:50', periodNumber: 2, subject: 'English', teacherName: 'Tr. Kelvin M.', room: 'Room 6A' },
  { id: 'tt-m4', grade: 'Grade 6', day: 'Monday', timeSlot: '09:50 - 10:20', periodNumber: 0, subject: 'Break', teacherName: 'Duty Teacher', room: 'Dining Hall / Field', isBreak: true },
  { id: 'tt-m5', grade: 'Grade 6', day: 'Monday', timeSlot: '10:20 - 11:00', periodNumber: 3, subject: 'Science', teacherName: 'Tr. Jane Wangari', room: 'Science Lab' },
  { id: 'tt-m6', grade: 'Grade 6', day: 'Monday', timeSlot: '11:00 - 11:40', periodNumber: 4, subject: 'Kiswahili', teacherName: 'Tr. Mwangi S.', room: 'Room 6A' },
  { id: 'tt-m7', grade: 'Grade 6', day: 'Monday', timeSlot: '11:40 - 12:20', periodNumber: 5, subject: 'Social Studies', teacherName: 'Tr. Otieno B.', room: 'Room 6A' },
  { id: 'tt-m8', grade: 'Grade 6', day: 'Monday', timeSlot: '12:20 - 01:20', periodNumber: 0, subject: 'Lunch', teacherName: 'Catering Team', room: 'Dining Hall', isBreak: true },
  { id: 'tt-m9', grade: 'Grade 6', day: 'Monday', timeSlot: '01:20 - 02:00', periodNumber: 6, subject: 'Agriculture', teacherName: 'Tr. Kibet J.', room: 'Agri Plot / Room 6A' },
  { id: 'tt-m10', grade: 'Grade 6', day: 'Monday', timeSlot: '02:00 - 02:40', periodNumber: 7, subject: 'Creative Arts', teacherName: 'Tr. Alice N.', room: 'Arts Studio' },
  { id: 'tt-m11', grade: 'Grade 6', day: 'Monday', timeSlot: '02:40 - 03:20', periodNumber: 8, subject: 'Games / Clubs', teacherName: 'Sports Master', room: 'Sports Field', isBreak: true },

  // Tuesday
  { id: 'tt-t1', grade: 'Grade 6', day: 'Tuesday', timeSlot: '08:00 - 08:40', periodNumber: 1, subject: 'English', teacherName: 'Tr. Kelvin M.', room: 'Room 6A' },
  { id: 'tt-t2', grade: 'Grade 6', day: 'Tuesday', timeSlot: '08:40 - 09:20', periodNumber: 2, subject: 'Mathematics', teacherName: 'Tr. Jane Wangari', room: 'Room 6A' },
  { id: 'tt-t3', grade: 'Grade 6', day: 'Tuesday', timeSlot: '09:20 - 10:00', periodNumber: 3, subject: 'Science', teacherName: 'Tr. Jane Wangari', room: 'Science Lab' },
  { id: 'tt-t4', grade: 'Grade 6', day: 'Tuesday', timeSlot: '10:00 - 10:30', periodNumber: 0, subject: 'Break', teacherName: 'Duty Teacher', room: 'Dining Hall / Field', isBreak: true },
  { id: 'tt-t5', grade: 'Grade 6', day: 'Tuesday', timeSlot: '10:30 - 11:10', periodNumber: 4, subject: 'CRE', teacherName: 'Tr. Mary W.', room: 'Room 6A' },
  { id: 'tt-t6', grade: 'Grade 6', day: 'Tuesday', timeSlot: '11:10 - 11:50', periodNumber: 5, subject: 'Kiswahili', teacherName: 'Tr. Mwangi S.', room: 'Room 6A' },
  { id: 'tt-t7', grade: 'Grade 6', day: 'Tuesday', timeSlot: '11:50 - 12:30', periodNumber: 6, subject: 'Agriculture', teacherName: 'Tr. Kibet J.', room: 'Agri Plot' },
  { id: 'tt-t8', grade: 'Grade 6', day: 'Tuesday', timeSlot: '12:30 - 01:30', periodNumber: 0, subject: 'Lunch', teacherName: 'Catering Team', room: 'Dining Hall', isBreak: true },
  { id: 'tt-t9', grade: 'Grade 6', day: 'Tuesday', timeSlot: '01:30 - 02:10', periodNumber: 7, subject: 'Social Studies', teacherName: 'Tr. Otieno B.', room: 'Room 6A' },
  { id: 'tt-t10', grade: 'Grade 6', day: 'Tuesday', timeSlot: '02:10 - 02:50', periodNumber: 8, subject: 'Creative Arts', teacherName: 'Tr. Alice N.', room: 'Arts Studio' },
  { id: 'tt-t11', grade: 'Grade 6', day: 'Tuesday', timeSlot: '02:50 - 03:30', periodNumber: 0, subject: 'Pastoral / Guidance', teacherName: 'Counselor', room: 'Room 6A', isBreak: true },

  // Wednesday
  { id: 'tt-w1', grade: 'Grade 6', day: 'Wednesday', timeSlot: '08:00 - 08:40', periodNumber: 1, subject: 'Mathematics', teacherName: 'Tr. Jane Wangari', room: 'Room 6A' },
  { id: 'tt-w2', grade: 'Grade 6', day: 'Wednesday', timeSlot: '08:40 - 09:20', periodNumber: 2, subject: 'Science', teacherName: 'Tr. Jane Wangari', room: 'Science Lab' },
  { id: 'tt-w3', grade: 'Grade 6', day: 'Wednesday', timeSlot: '09:20 - 10:00', periodNumber: 3, subject: 'English', teacherName: 'Tr. Kelvin M.', room: 'Room 6A' },
  { id: 'tt-w4', grade: 'Grade 6', day: 'Wednesday', timeSlot: '10:00 - 10:30', periodNumber: 0, subject: 'Break', teacherName: 'Duty Teacher', room: 'Dining Hall', isBreak: true },
  { id: 'tt-w5', grade: 'Grade 6', day: 'Wednesday', timeSlot: '10:30 - 11:10', periodNumber: 4, subject: 'Kiswahili', teacherName: 'Tr. Mwangi S.', room: 'Room 6A' },
  { id: 'tt-w6', grade: 'Grade 6', day: 'Wednesday', timeSlot: '11:10 - 11:50', periodNumber: 5, subject: 'CRE', teacherName: 'Tr. Mary W.', room: 'Room 6A' },
  { id: 'tt-w7', grade: 'Grade 6', day: 'Wednesday', timeSlot: '11:50 - 12:30', periodNumber: 6, subject: 'Creative Arts', teacherName: 'Tr. Alice N.', room: 'Arts Studio' },
  { id: 'tt-w8', grade: 'Grade 6', day: 'Wednesday', timeSlot: '12:30 - 01:30', periodNumber: 0, subject: 'Lunch', teacherName: 'Catering Team', room: 'Dining Hall', isBreak: true },
  { id: 'tt-w9', grade: 'Grade 6', day: 'Wednesday', timeSlot: '01:30 - 02:10', periodNumber: 7, subject: 'Social Studies', teacherName: 'Tr. Otieno B.', room: 'Room 6A' },
  { id: 'tt-w10', grade: 'Grade 6', day: 'Wednesday', timeSlot: '02:10 - 03:20', periodNumber: 8, subject: 'Games / Clubs', teacherName: 'Club Patrons', room: 'School Grounds', isBreak: true },

  // Thursday
  { id: 'tt-th1', grade: 'Grade 6', day: 'Thursday', timeSlot: '08:00 - 08:40', periodNumber: 1, subject: 'Science', teacherName: 'Tr. Jane Wangari', room: 'Science Lab' },
  { id: 'tt-th2', grade: 'Grade 6', day: 'Thursday', timeSlot: '08:40 - 09:20', periodNumber: 2, subject: 'Mathematics', teacherName: 'Tr. Jane Wangari', room: 'Room 6A' },
  { id: 'tt-th3', grade: 'Grade 6', day: 'Thursday', timeSlot: '09:20 - 10:00', periodNumber: 3, subject: 'Kiswahili', teacherName: 'Tr. Mwangi S.', room: 'Room 6A' },
  { id: 'tt-th4', grade: 'Grade 6', day: 'Thursday', timeSlot: '10:00 - 10:30', periodNumber: 0, subject: 'Break', teacherName: 'Duty Teacher', room: 'Dining Hall', isBreak: true },
  { id: 'tt-th5', grade: 'Grade 6', day: 'Thursday', timeSlot: '10:30 - 11:10', periodNumber: 4, subject: 'English', teacherName: 'Tr. Kelvin M.', room: 'Room 6A' },
  { id: 'tt-th6', grade: 'Grade 6', day: 'Thursday', timeSlot: '11:10 - 11:50', periodNumber: 5, subject: 'Agriculture', teacherName: 'Tr. Kibet J.', room: 'Agri Plot' },
  { id: 'tt-th7', grade: 'Grade 6', day: 'Thursday', timeSlot: '11:50 - 12:30', periodNumber: 6, subject: 'Social Studies', teacherName: 'Tr. Otieno B.', room: 'Room 6A' },
  { id: 'tt-th8', grade: 'Grade 6', day: 'Thursday', timeSlot: '12:30 - 01:30', periodNumber: 0, subject: 'Lunch', teacherName: 'Catering Team', room: 'Dining Hall', isBreak: true },
  { id: 'tt-th9', grade: 'Grade 6', day: 'Thursday', timeSlot: '01:30 - 02:10', periodNumber: 7, subject: 'CRE', teacherName: 'Tr. Mary W.', room: 'Room 6A' },
  { id: 'tt-th10', grade: 'Grade 6', day: 'Thursday', timeSlot: '02:10 - 02:50', periodNumber: 8, subject: 'Creative Arts', teacherName: 'Tr. Alice N.', room: 'Arts Studio' },
  { id: 'tt-th11', grade: 'Grade 6', day: 'Thursday', timeSlot: '02:50 - 03:30', periodNumber: 0, subject: 'Games / Clubs', teacherName: 'Scouts / Girl Guides', room: 'School Grounds', isBreak: true },

  // Friday
  { id: 'tt-f1', grade: 'Grade 6', day: 'Friday', timeSlot: '08:00 - 08:40', periodNumber: 1, subject: 'English', teacherName: 'Tr. Kelvin M.', room: 'Room 6A' },
  { id: 'tt-f2', grade: 'Grade 6', day: 'Friday', timeSlot: '08:40 - 09:20', periodNumber: 2, subject: 'Mathematics', teacherName: 'Tr. Jane Wangari', room: 'Room 6A' },
  { id: 'tt-f3', grade: 'Grade 6', day: 'Friday', timeSlot: '09:20 - 10:00', periodNumber: 3, subject: 'Agriculture', teacherName: 'Tr. Kibet J.', room: 'Agri Plot' },
  { id: 'tt-f4', grade: 'Grade 6', day: 'Friday', timeSlot: '10:00 - 10:30', periodNumber: 0, subject: 'Break', teacherName: 'Duty Teacher', room: 'Dining Hall', isBreak: true },
  { id: 'tt-f5', grade: 'Grade 6', day: 'Friday', timeSlot: '10:30 - 11:10', periodNumber: 4, subject: 'Science', teacherName: 'Tr. Jane Wangari', room: 'Science Lab' },
  { id: 'tt-f6', grade: 'Grade 6', day: 'Friday', timeSlot: '11:10 - 11:50', periodNumber: 5, subject: 'Kiswahili', teacherName: 'Tr. Mwangi S.', room: 'Room 6A' },
  { id: 'tt-f7', grade: 'Grade 6', day: 'Friday', timeSlot: '11:50 - 12:30', periodNumber: 6, subject: 'Social Studies', teacherName: 'Tr. Otieno B.', room: 'Room 6A' },
  { id: 'tt-f8', grade: 'Grade 6', day: 'Friday', timeSlot: '12:30 - 01:30', periodNumber: 0, subject: 'Lunch', teacherName: 'Catering Team', room: 'Dining Hall', isBreak: true },
  { id: 'tt-f9', grade: 'Grade 6', day: 'Friday', timeSlot: '01:30 - 02:10', periodNumber: 7, subject: 'CRE', teacherName: 'Tr. Mary W.', room: 'Room 6A' },
  { id: 'tt-f10', grade: 'Grade 6', day: 'Friday', timeSlot: '02:10 - 03:30', periodNumber: 8, subject: 'Games / Clubs', teacherName: 'All House Masters', room: 'Main Stadium', isBreak: true }
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  // 2026 Official Calendar (Active Year)
  {
    id: 'ev-01',
    title: 'Term 1 Opening Day',
    date: '2026-01-05',
    category: 'Term Date',
    description: 'Official start of Term 1 2026 academic calendar. School assembly and syllabus rollout.',
    term: 'Term 1',
    academicYear: 2026
  },
  {
    id: 'ev-02',
    title: 'CAT 1 Continuous Assessments Week',
    date: '2026-02-09',
    endDate: '2026-02-13',
    category: 'Exams / CAT',
    description: 'First continuous assessment test across all CBC subjects for Grade 1 through 6.',
    term: 'Term 1',
    academicYear: 2026
  },
  {
    id: 'ev-03',
    title: 'Term 1 Official Mid-Term Break',
    date: '2026-02-25',
    endDate: '2026-03-01',
    category: 'Holiday',
    description: 'Ministry of Education Official Term 1 Mid-Term Break (2026-02-25 to 2026-03-01).',
    term: 'Term 1',
    academicYear: 2026
  },
  {
    id: 'ev-04',
    title: 'Annual Inter-School Athletics & Sports Gala',
    date: '2026-03-06',
    category: 'Co-Curricular',
    description: 'Track and field events at the school grounds. Parents and guardians warmly invited.',
    term: 'Term 1',
    academicYear: 2026
  },
  {
    id: 'ev-05',
    title: 'Term 1 End-Term Final Evaluations',
    date: '2026-03-23',
    endDate: '2026-04-01',
    category: 'Exams / CAT',
    description: 'Targeter & Jesma evaluation papers administered across all grades.',
    term: 'Term 1',
    academicYear: 2026
  },
  {
    id: 'ev-06',
    title: 'Term 1 Official Closing Day',
    date: '2026-04-02',
    category: 'Term Date',
    description: 'Official conclusion of Term 1 per 2026 Academic Calendar. Report cards released.',
    term: 'Term 1',
    academicYear: 2026
  },
  {
    id: 'ev-07',
    title: 'Academic Consultation & PTA Consultation Day',
    date: '2026-04-09',
    category: 'PTA Meeting',
    description: 'Parents meet class teachers individually to collect official CBC progress reports.',
    term: 'Term 1',
    academicYear: 2026
  },
  // 2026 Term 2
  {
    id: 'ev-08',
    title: 'Term 2 Official Opening Day',
    date: '2026-04-27',
    category: 'Term Date',
    description: 'Commencement of Term 2 classes and National Music Festival preparations.',
    term: 'Term 2',
    academicYear: 2026
  },
  {
    id: 'ev-09',
    title: 'KNEC Projects Portal Opens (CBA Sync Engine)',
    date: '2026-05-15',
    category: 'Exams / CAT',
    description: 'Official opening of the KNEC CBA Projects Portal (https://cba.knec.ac.ke) for Grades 3, 4, 5, 6.',
    term: 'Term 2',
    academicYear: 2026
  },
  {
    id: 'ev-10',
    title: 'Term 2 Official Mid-Term Break',
    date: '2026-06-24',
    endDate: '2026-06-28',
    category: 'Holiday',
    description: 'Official Ministry of Education Term 2 Mid-Term Break (2026-06-24 to 2026-06-28).',
    term: 'Term 2',
    academicYear: 2026
  },
  {
    id: 'ev-11',
    title: 'Term 2 Official Closing Day',
    date: '2026-07-31',
    category: 'Term Date',
    description: 'Official end of Term 2 per 2026 Academic Calendar.',
    term: 'Term 2',
    academicYear: 2026
  },
  // 2026 Term 3 (Active Term)
  {
    id: 'ev-12',
    title: 'Term 3 Opening Day (Active Term)',
    date: '2026-08-24',
    category: 'Term Date',
    description: 'Active Term 3 commencement. Targeter Opener assessments and Grade 6 KPSEA final rehearsal series.',
    term: 'Term 3',
    academicYear: 2026
  },
  {
    id: 'ev-13',
    title: 'Term 3 End-Term Comprehensive Evaluations',
    date: '2026-10-12',
    endDate: '2026-10-22',
    category: 'Exams / CAT',
    description: 'End-term evaluation papers administered in accordance with auto-schedule rules (final 2 weeks).',
    term: 'Term 3',
    academicYear: 2026
  },
  {
    id: 'ev-14',
    title: 'Term 3 Official Closing Day',
    date: '2026-10-23',
    category: 'Term Date',
    description: 'Official closing of Term 3 2026 for non-candidate classes.',
    term: 'Term 3',
    academicYear: 2026
  },
  {
    id: 'ev-15',
    title: 'KPSEA National Examination Dates (Grade 6)',
    date: '2026-10-26',
    endDate: '2026-10-28',
    category: 'Exams / CAT',
    description: 'Kenya Primary School Education Assessment (KPSEA) National Examination window: 2026-10-26 to 2026-10-28.',
    term: 'Term 3',
    academicYear: 2026
  },
  // 2027 Projected Milestones
  {
    id: 'ev-proj-27-01',
    title: '2027 Term 1 Projected Opening & Opener Series',
    date: '2027-01-04',
    category: 'Term Date',
    description: 'Projected start of 2027 Term 1. Opener Assessment, Mid-Term Evaluation, and Term 1 Targeter/Jesma Series.',
    term: 'Term 1',
    academicYear: 2027
  },
  {
    id: 'ev-proj-27-02',
    title: '2027 Term 1 Mid-Term Break (Projected)',
    date: '2027-02-24',
    endDate: '2027-02-28',
    category: 'Holiday',
    description: 'Projected 2027 Term 1 Mid-Term Break (2027-02-24 to 2027-02-28).',
    term: 'Term 1',
    academicYear: 2027
  },
  {
    id: 'ev-proj-27-03',
    title: '2027 Term 2 KNEC CBA Auto-Sync Opens',
    date: '2027-05-17',
    category: 'Exams / CAT',
    description: 'Projected opening of KNEC Projects Portal Auto-Sync Engine (https://cba.knec.ac.ke).',
    term: 'Term 2',
    academicYear: 2027
  },
  {
    id: 'ev-proj-27-04',
    title: '2027 KPSEA National Window (Projected)',
    date: '2027-10-25',
    endDate: '2027-10-28',
    category: 'Exams / CAT',
    description: 'Projected Grade 6 KPSEA National Examination window: 2027-10-25 to 2027-10-28.',
    term: 'Term 3',
    academicYear: 2027
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'not-01',
    title: '📢 Term 1 Mid-Term Assessments and Academic Progress Tracking',
    date: '2026-02-15',
    author: 'Mr. Kelvin (Headteacher)',
    priority: 'High',
    targetAudience: 'All',
    content: 'Dear Parents, Teachers, and Learners, all CAT 1 scores have been compiled in the EduHub portal. Please check individual learner profiles for updated progress percentages and personalized remarks.'
  },
  {
    id: 'not-02',
    title: '🏆 Little Roses Academy Annual Sports Day Schedule',
    date: '2026-02-28',
    author: 'Sports Master - Tr. Kibet',
    priority: 'Normal',
    targetAudience: 'All',
    content: 'Our inter-house sports competitions (Simba, Chui, Ndovu, Kifaru) will take place this Friday. Learners should report in their official physical education tracksuits.'
  },
  {
    id: 'not-03',
    title: '🌱 Grade 6 Practical Agriculture Demonstration Plot',
    date: '2026-03-02',
    author: 'Tr. Jane Wangari',
    priority: 'Normal',
    targetAudience: 'Learners',
    content: 'Grade 6 learners are reminded to bring their project notebooks and gloves for the organic composting session scheduled for Thursday afternoon.'
  },
  {
    id: 'not-04',
    title: '💳 Fee Balance Advisory for Term 1',
    date: '2026-03-05',
    author: 'School Accounts Office',
    priority: 'Urgent',
    targetAudience: 'Parents',
    content: 'Kindly note that all outstanding Term 1 fees should be cleared before the commencement of the End-Term examination series on March 30th.'
  }
];

export const CBC_SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  'Mathematics': { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800', accent: 'bg-blue-600' },
  'English': { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800', accent: 'bg-amber-600' },
  'Kiswahili': { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800', accent: 'bg-emerald-600' },
  'Science': { bg: 'bg-teal-50 dark:bg-teal-950/40', text: 'text-teal-700 dark:text-teal-300', border: 'border-teal-200 dark:border-teal-800', accent: 'bg-teal-600' },
  'Science and Technology': { bg: 'bg-teal-50 dark:bg-teal-950/40', text: 'text-teal-700 dark:text-teal-300', border: 'border-teal-200 dark:border-teal-800', accent: 'bg-teal-600' },
  'Agriculture': { bg: 'bg-green-50 dark:bg-green-950/40', text: 'text-green-700 dark:text-green-300', border: 'border-green-200 dark:border-green-800', accent: 'bg-green-600' },
  'Agriculture and Nutrition': { bg: 'bg-green-50 dark:bg-green-950/40', text: 'text-green-700 dark:text-green-300', border: 'border-green-200 dark:border-green-800', accent: 'bg-green-600' },
  'Creative Arts': { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800', accent: 'bg-rose-600' },
  'Creative Activities': { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800', accent: 'bg-rose-600' },
  'Social Studies': { bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800', accent: 'bg-purple-600' },
  'CRE': { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800', accent: 'bg-indigo-600' },
  'Religious Education': { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800', accent: 'bg-indigo-600' },
  'Religious Education Activities': { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800', accent: 'bg-indigo-600' },
  'Mathematical Activities': { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800', accent: 'bg-blue-600' },
  'English Language Activities': { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800', accent: 'bg-amber-600' },
  'Kiswahili Language Activities': { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800', accent: 'bg-emerald-600' },
  'Indigenous Language Activities': { bg: 'bg-orange-50 dark:bg-orange-950/40', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800', accent: 'bg-orange-600' },
  'Environmental Activities': { bg: 'bg-cyan-50 dark:bg-cyan-950/40', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-200 dark:border-cyan-800', accent: 'bg-cyan-600' }
};

export function getSubjectColor(subject: string) {
  return CBC_SUBJECT_COLORS[subject] || {
    bg: 'bg-slate-50 dark:bg-slate-800',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-700',
    accent: 'bg-slate-600'
  };
}

export function calculateStudentOverallPercentage(student: Student): number {
  const subjects = Object.keys(student.catMarks) as SubjectName[];
  if (subjects.length === 0) return 0;
  
  let totalPct = 0;
  subjects.forEach(sub => {
    const m = student.catMarks[sub];
    // CAT 1 out of 30, CAT 2 out of 30, End term out of 100
    // Weighted: (CAT1/30 * 20) + (CAT2/30 * 20) + (EndTerm/100 * 60)
    const subPct = (m.cat1 / 30) * 20 + (m.cat2 / 30) * 20 + (m.endTerm / 100) * 60;
    totalPct += Math.min(100, Math.max(0, subPct));
  });
  
  return Math.round(totalPct / subjects.length);
}

export function getCBCRating(score: number): { code: string; label: string; color: string; bg: string } {
  if (score >= 80) return { code: 'EE', label: 'Exceeding Expectations (4)', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500' };
  if (score >= 65) return { code: 'ME', label: 'Meeting Expectations (3)', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500' };
  if (score >= 50) return { code: 'AE', label: 'Approaching Expectations (2)', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500' };
  return { code: 'BE', label: 'Below Expectations (1)', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500' };
}
