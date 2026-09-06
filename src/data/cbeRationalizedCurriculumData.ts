import { 
  GradeLevel, 
  TermName, 
  SchemeOfWork, 
  BlankLessonPlanSheet,
  SystemConfig
} from '../types';

export interface GradeCoverageDefinition {
  lower_primary: Array<{
    grade: GradeLevel;
    subjects: string[];
  }>;
  upper_primary: Array<{
    grade: GradeLevel;
    subjects: string[];
  }>;
}

export const CBE_GRADE_COVERAGE: GradeCoverageDefinition = {
  lower_primary: [
    {
      grade: 'Grade 1',
      subjects: [
        'Indigenous Language Activities',
        'English Language Activities',
        'Kiswahili Language Activities',
        'Mathematical Activities',
        'Religious Education Activities',
        'Environmental Activities',
        'Creative Activities'
      ]
    },
    {
      grade: 'Grade 2',
      subjects: [
        'Indigenous Language Activities',
        'English Language Activities',
        'Kiswahili Language Activities',
        'Mathematical Activities',
        'Religious Education Activities',
        'Environmental Activities',
        'Creative Activities'
      ]
    },
    {
      grade: 'Grade 3',
      subjects: [
        'Indigenous Language Activities',
        'English Language Activities',
        'Kiswahili Language Activities',
        'Mathematical Activities',
        'Religious Education Activities',
        'Environmental Activities',
        'Creative Activities'
      ]
    }
  ],
  upper_primary: [
    {
      grade: 'Grade 4',
      subjects: [
        'English',
        'Kiswahili',
        'Mathematics',
        'Science and Technology',
        'Agriculture and Nutrition',
        'Social Studies',
        'Creative Arts',
        'Religious Education'
      ]
    },
    {
      grade: 'Grade 5',
      subjects: [
        'English',
        'Kiswahili',
        'Mathematics',
        'Science and Technology',
        'Agriculture and Nutrition',
        'Social Studies',
        'Creative Arts',
        'Religious Education'
      ]
    },
    {
      grade: 'Grade 6',
      subjects: [
        'English',
        'Kiswahili',
        'Mathematics',
        'Science and Technology',
        'Agriculture and Nutrition',
        'Social Studies',
        'Creative Arts',
        'Religious Education'
      ]
    }
  ]
};

// 10 Structural Columns for Schemes of Work Engine
export const SCHEMES_OF_WORK_COLUMNS = [
  'Week',
  'Lesson',
  'Strand',
  'SubStrand',
  'Specific Learning Outcomes (SLOs)',
  'Key Inquiry Questions (KIQs)',
  'Learning Experiences',
  'Learning Resources',
  'Assessment Methods',
  'Reflection'
] as const;

export const CBE_CORE_COMPETENCIES = [
  'Communication and Collaboration',
  'Critical Thinking and Problem Solving',
  'Creativity and Imagination',
  'Digital Literacy',
  'Self-Efficacy',
  'Learning to Learn',
  'Citizenship'
];

export const CBE_VALUES = [
  'Love',
  'Responsibility',
  'Respect',
  'Unity',
  'Peace',
  'Patriotism',
  'Social Justice',
  'Integrity'
];

export const CBE_PCIS_SUGGESTIONS = [
  'Environmental Conservation & Tree Planting',
  'Health & Hygiene Promotion',
  'Child Protection, Personal Safety & Rights',
  'Financial Literacy & Savings Awareness',
  'Disaster Risk Reduction & Fire Safety',
  'Peace Education & Social Cohesion',
  'Life Skills & Decision Making'
];

export const CBE_DEFAULT_LEARNING_RESOURCES = [
  "Learner's Book",
  "Teacher's Guide",
  "Real Objects / Realia",
  "Digital Charts",
  "Manila Cards & Markers",
  "Flashcards & Audio Clips"
];

// Helper to get subjects by grade
export function getRationalizedSubjectsForGrade(grade: GradeLevel): string[] {
  const lower = CBE_GRADE_COVERAGE.lower_primary.find(g => g.grade === grade);
  if (lower) return lower.subjects;
  const upper = CBE_GRADE_COVERAGE.upper_primary.find(g => g.grade === grade);
  if (upper) return upper.subjects;
  return [
    'English',
    'Kiswahili',
    'Mathematics',
    'Science and Technology',
    'Agriculture and Nutrition',
    'Social Studies',
    'Creative Arts',
    'Religious Education'
  ];
}

// Function to create a fresh Blank Lesson Plan Sheet matching the user specification
export function createBlankLessonPlanTemplate(
  config?: Partial<SystemConfig>,
  overrides?: Partial<BlankLessonPlanSheet>
): BlankLessonPlanSheet {
  const schoolName = config?.school_metadata?.school_name || 'Editable School Name';
  const schoolCode = config?.school_metadata?.school_code_number || 'EDITABLE_SCHOOL_NO_001';
  const activeTerm = config?.active_term || 'Term 3';

  return {
    id: `lps-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    administrative_details: {
      school_name: overrides?.administrative_details?.school_name ?? schoolName,
      school_code: overrides?.administrative_details?.school_code ?? schoolCode,
      teacher_name: overrides?.administrative_details?.teacher_name ?? 'Tr. M. Wanjiku',
      tsc_number: overrides?.administrative_details?.tsc_number ?? 'TSC/892341/KE',
      date: overrides?.administrative_details?.date ?? '2026-09-02',
      time: overrides?.administrative_details?.time ?? '35 mins',
      roll_enrolment: {
        boys: overrides?.administrative_details?.roll_enrolment?.boys ?? 0,
        girls: overrides?.administrative_details?.roll_enrolment?.girls ?? 0,
        total: overrides?.administrative_details?.roll_enrolment?.total ?? 0
      },
      grade_level: overrides?.administrative_details?.grade_level ?? 'Grade 1',
      learning_area_subject: overrides?.administrative_details?.learning_area_subject ?? 'Mathematical Activities',
      term: overrides?.administrative_details?.term ?? activeTerm,
      week: overrides?.administrative_details?.week ?? 1,
      lesson_number: overrides?.administrative_details?.lesson_number ?? 1
    },
    curriculum_alignment: {
      strand: overrides?.curriculum_alignment?.strand ?? '',
      sub_strand: overrides?.curriculum_alignment?.sub_strand ?? '',
      specific_learning_outcomes: {
        knowledge_understanding: overrides?.curriculum_alignment?.specific_learning_outcomes?.knowledge_understanding ?? 'By the end of the lesson, the learner should be able to...',
        skills: overrides?.curriculum_alignment?.specific_learning_outcomes?.skills ?? 'By the end of the lesson, the learner should be able to...',
        attitudes_values: overrides?.curriculum_alignment?.specific_learning_outcomes?.attitudes_values ?? 'By the end of the lesson, the learner should be able to...'
      },
      key_inquiry_questions: overrides?.curriculum_alignment?.key_inquiry_questions?.length ? overrides.curriculum_alignment.key_inquiry_questions : [''],
      core_competencies_to_develop: overrides?.curriculum_alignment?.core_competencies_to_develop ?? [
        'Communication and Collaboration',
        'Critical Thinking and Problem Solving',
        'Creativity and Imagination',
        'Digital Literacy',
        'Self-Efficacy',
        'Learning to Learn',
        'Citizenship'
      ],
      values: overrides?.curriculum_alignment?.values ?? [
        'Love',
        'Responsibility',
        'Respect',
        'Unity',
        'Peace',
        'Patriotism',
        'Social Justice',
        'Integrity'
      ],
      pertinent_and_contemporary_issues_pcis: overrides?.curriculum_alignment?.pertinent_and_contemporary_issues_pcis ?? [''],
      learning_resources: overrides?.curriculum_alignment?.learning_resources ?? [
        "Learner's Book",
        "Teacher's Guide",
        "Real Objects / Realia",
        "Digital Charts"
      ]
    },
    lesson_development_steps: overrides?.lesson_development_steps ?? [
      {
        step_number: 1,
        step_name: 'Introduction',
        duration: '5 minutes',
        teacher_activity: '',
        learner_activity: '',
        assessment_mode: 'Observation / Questioning'
      },
      {
        step_number: 2,
        step_name: 'Lesson Development - Step 1 (Concept Acquisition)',
        duration: '7 minutes',
        teacher_activity: '',
        learner_activity: '',
        assessment_mode: 'Oral check'
      },
      {
        step_number: 3,
        step_name: 'Lesson Development - Step 2 (Guided Practice & Group Work)',
        duration: '8 minutes',
        teacher_activity: '',
        learner_activity: '',
        assessment_mode: 'Peer assessment / Rubric observation'
      },
      {
        step_number: 4,
        step_name: 'Lesson Development - Step 3 (Individual Practice / Task)',
        duration: '8 minutes',
        teacher_activity: '',
        learner_activity: '',
        assessment_mode: 'Written exercise check'
      },
      {
        step_number: 5,
        step_name: 'Conclusion & Extended Learning',
        duration: '5 minutes',
        teacher_activity: '',
        learner_activity: '',
        assessment_mode: 'Summary check'
      }
    ],
    post_lesson_reflection: {
      successes_and_strengths: overrides?.post_lesson_reflection?.successes_and_strengths ?? '',
      challenges_observed: overrides?.post_lesson_reflection?.challenges_observed ?? '',
      remedial_and_next_steps: overrides?.post_lesson_reflection?.remedial_and_next_steps ?? ''
    },
    createdAt: new Date().toISOString()
  };
}

// Initial Comprehensive Rationalized Schemes of Work for Grade 1-6 (All 10 columns)
export const RATIONALIZED_INITIAL_SCHEMES: SchemeOfWork[] = [
  // LOWER PRIMARY - Grade 1
  {
    id: 'sow-cbe-g1-math-t3',
    grade: 'Grade 1',
    subject: 'Mathematical Activities' as any,
    term: 'Term 3',
    week: 1,
    lesson: 1,
    strand: 'Numbers',
    subStrand: 'Addition and Subtraction of Whole Numbers up to 20',
    specificLearningOutcomes: 'By the end of the sub-strand, the learner should be able to: a) Add single digit numbers up to a sum of 20 using concrete counters. b) Relate addition to real-life pooling of items. c) Appreciate cooperative teamwork in counting activities.',
    keyInquiryQuestions: 'How do we find the total number of items when groups are put together?',
    learningExperiences: 'Learners in pairs count bottle tops and wooden beads, combine sets, and write addition sentences on mini chalkboards.',
    learningResources: 'Counters (bottle tops, pebbles), ten-frames, number flashcards 1-20, Grade 1 Math Activities Learner Book pg. 64-67',
    assessmentMethods: 'Observation checklist, oral questions, practical demonstration',
    reflectionRemarks: 'All 24 learners in Grade 1 demonstrated correct grouping with counters; 4 learners required guidance with ten-frame alignment.',
    attachments: [{ name: 'G1_Math_Addition_Counters_Guide.pdf', size: '1.2 MB' }],
    updatedAt: '2026-09-02'
  },
  {
    id: 'sow-cbe-g1-env-t3',
    grade: 'Grade 1',
    subject: 'Environmental Activities' as any,
    term: 'Term 3',
    week: 1,
    lesson: 2,
    strand: 'Natural Environment',
    subStrand: 'Weather Conditions and Clean Water Sources',
    specificLearningOutcomes: 'By the end of the lesson, the learner should be able to: a) Identify sunny, rainy, windy, and cloudy weather symbols. b) State safe ways of storing clean drinking water. c) Show responsibility in not wasting domestic water.',
    keyInquiryQuestions: 'How does changes in weather affect what we wear and drink?',
    learningExperiences: 'Learners step outside to observe clouds and wind movement, draw weather symbols on drawing sheets, and discuss boiled clean drinking water.',
    learningResources: 'Weather chart, rain gauge model, clean water storage jerrycan, Environmental Activities Learner Book pg. 42',
    assessmentMethods: 'Oral questioning, drawing portfolio rubric, observational check',
    reflectionRemarks: 'Learners actively pointed out cumulus clouds and explained why boiling water prevents stomach illnesses.',
    attachments: [{ name: 'Weather_Symbols_Worksheet.pdf', size: '890 KB' }],
    updatedAt: '2026-09-02'
  },
  {
    id: 'sow-cbe-g2-eng-t3',
    grade: 'Grade 2',
    subject: 'English Language Activities' as any,
    term: 'Term 3',
    week: 2,
    lesson: 1,
    strand: 'Listening and Speaking',
    subStrand: 'Pronunciation and Phonic Blends (sh, ch, th)',
    specificLearningOutcomes: 'By the end of the lesson, the learner should be able to: a) Articulate words with initial and final digraphs /sh/ and /ch/. b) Use polite courtesies in classroom dialogue. c) Express joy in reading aloud.',
    keyInquiryQuestions: 'How do different letter combinations create new sounds in English words?',
    learningExperiences: 'Learners listen to teacher modeling phonetic sounds, chant digraph poems, and match word cards to illustrated pictures.',
    learningResources: 'Phonic flashcards, pictorial charts (shoe, chair, shell), digital audio reader',
    assessmentMethods: 'Oral pronunciation test, peer reading observation checklist',
    reflectionRemarks: 'Pronunciation of /sh/ versus /ch/ greatly improved through call-and-response choral exercises.',
    attachments: [{ name: 'Phonics_Digraphs_Grade2.pdf', size: '1.1 MB' }],
    updatedAt: '2026-09-02'
  },
  {
    id: 'sow-cbe-g3-cre-t3',
    grade: 'Grade 3',
    subject: 'Creative Activities' as any,
    term: 'Term 3',
    week: 2,
    lesson: 3,
    strand: 'Visual Arts and Crafts',
    subStrand: 'Paper Folding and Origami Animals',
    specificLearningOutcomes: 'By the end of the sub-strand, the learner should be able to: a) Fold square paper along symmetry lines to make paper birds and frogs. b) Display neatness and aesthetic harmony. c) Clean up work stations after crafting.',
    keyInquiryQuestions: 'How can flat sheets of paper be transformed into 3D geometric shapes?',
    learningExperiences: 'Learners follow step-by-step origami folds projected on the screen, paste eyes with non-toxic glue, and curate a class display shelf.',
    learningResources: 'Colored origami paper, child-safe scissors, ruler, glue stick, Creative Activities Teacher Guide pg. 78',
    assessmentMethods: 'Portfolio evaluation, self-assessment rubric, dexterity check',
    reflectionRemarks: 'Origami frogs hopped successfully; learners displayed exceptional patience and motor coordination.',
    attachments: [{ name: 'Origami_Craft_Grade3.pdf', size: '2.3 MB' }],
    updatedAt: '2026-09-02'
  },
  // UPPER PRIMARY - Grade 4, 5, 6
  {
    id: 'sow-cbe-g4-scitech-t3',
    grade: 'Grade 4',
    subject: 'Science and Technology' as any,
    term: 'Term 3',
    week: 1,
    lesson: 2,
    strand: 'Computing and Digital Devices',
    subStrand: 'Input and Output Devices in Learning',
    specificLearningOutcomes: 'By the end of the lesson, the learner should be able to: a) Distinguish between input devices (mouse, keyboard) and output devices (monitor, printer). b) Demonstrate safe handling of school tablets and laptops. c) Value digital technology in problem solving.',
    keyInquiryQuestions: 'How does information enter into a computer and come out for us to see?',
    learningExperiences: 'Learners visit the computer lab, test typing prompts using keyboard, navigate with optical mouse, and print a 1-page class certificate.',
    learningResources: 'Tablets, desktop PCs, projector, Science & Technology Learner Book pg. 102-106',
    assessmentMethods: 'Practical laboratory task, oral check, short written quiz',
    reflectionRemarks: 'Learners correctly sorted 8 hardware items into Input vs Output columns without errors.',
    attachments: [{ name: 'Hardware_Input_Output_Lab.pdf', size: '1.5 MB' }],
    updatedAt: '2026-09-02'
  },
  {
    id: 'sow-cbe-g5-agrinutr-t3',
    grade: 'Grade 5',
    subject: 'Agriculture and Nutrition' as any,
    term: 'Term 3',
    week: 2,
    lesson: 1,
    strand: 'Food Production & Preservation',
    subStrand: 'Sun Drying and Smoking Methods for Vegetable & Fish Preservation',
    specificLearningOutcomes: 'By the end of the sub-strand, the learner should be able to: a) Explain principles of moisture removal in sun drying kales and indigenous vegetables. b) Practice hygienic food handling during preservation. c) Appreciate food security in avoiding harvest wastage.',
    keyInquiryQuestions: 'Why does removing water from fresh food make it last for months without spoiling?',
    learningExperiences: 'Learners wash sukuma wiki and indigenous herbs, blanch in warm salted water, spread on wire mesh drying racks under sunlight in the demo garden.',
    learningResources: 'Fresh green vegetables, solar dryer trays, clean muslin cloths, Agriculture & Nutrition Grade 5 Book pg. 88',
    assessmentMethods: 'Demonstration rubric, project journal entry, question checklist',
    reflectionRemarks: 'Solar drying demo set up cleanly behind the dining hall; moisture reduction monitored daily.',
    attachments: [{ name: 'Food_Preservation_Guide.pdf', size: '1.9 MB' }],
    updatedAt: '2026-09-02'
  },
  {
    id: 'sow-cbe-g6-math-t3',
    grade: 'Grade 6',
    subject: 'Mathematics' as any,
    term: 'Term 3',
    week: 3,
    lesson: 2,
    strand: 'Measurement & Geometry',
    subStrand: 'Surface Area and Volume of Cylinders and Prisms',
    specificLearningOutcomes: 'By the end of the sub-strand, the learner should be able to: a) Calculate the curved and total surface area of closed and open cylinders using formula 2*pi*r*h. b) Solve KPSEA-style word problems involving liquid storage tanks. c) Appreciate accuracy in construction measurements.',
    keyInquiryQuestions: 'How do engineers calculate the volume of rainwater storage tanks in schools?',
    learningExperiences: 'Learners measure cylindrical tins using tape measures, calculate radius and height, and verify volume capacity with calibrated water jugs.',
    learningResources: 'Cylindrical containers, measuring tapes, calibrated cylinders, Grade 6 Mathematics Textbook pg. 142-146',
    assessmentMethods: 'Written examination problems, peer calculation check, KPSEA past question review',
    reflectionRemarks: '92% of learners derived total surface area accurately; remedial tutorial planned for cross-sectional diameter conversion.',
    attachments: [{ name: 'Grade6_Cylinders_Geometry_Paper.pdf', size: '1.4 MB' }],
    updatedAt: '2026-09-02'
  },
  {
    id: 'sow-cbe-g6-social-t3',
    grade: 'Grade 6',
    subject: 'Social Studies' as any,
    term: 'Term 3',
    week: 3,
    lesson: 4,
    strand: 'Governance and Citizenship',
    subStrand: 'Structure of the National Government of Kenya',
    specificLearningOutcomes: 'By the end of the lesson, the learner should be able to: a) Describe the roles of the Executive, Legislature, and Judiciary. b) Explain the importance of checks and balances in democracy. c) Foster patriotism and respect for constitutional order.',
    keyInquiryQuestions: 'Why does Kenya divide state power between three distinct arms of government?',
    learningExperiences: 'Learners conduct a mock parliamentary debate and presidential assent simulation in groups, drawing an organizational chart in notebooks.',
    learningResources: 'Constitution of Kenya 2010 summary charts, Social Studies Learner Book pg. 120-125, projector',
    assessmentMethods: 'Role play rubric, structured workbook questions, reflective exit tickets',
    reflectionRemarks: 'Enthusiastic debate on legislative vetting of bills; high civic awareness demonstrated.',
    attachments: [{ name: 'Kenya_Governance_Arms.pdf', size: '1.8 MB' }],
    updatedAt: '2026-09-02'
  }
];

// Pre-seeded Blank Lesson Plan Sheets adhering to the exact 4-part CBE specification
export const INITIAL_BLANK_LESSON_PLAN_SHEETS: BlankLessonPlanSheet[] = [
  {
    id: 'lps-seed-01',
    administrative_details: {
      school_name: 'Editable School Name',
      school_code: 'EDITABLE_SCHOOL_NO_001',
      teacher_name: 'Tr. M. Wanjiku',
      tsc_number: 'TSC/892341/KE',
      date: '2026-09-02',
      time: '35 mins',
      roll_enrolment: {
        boys: 14,
        girls: 16,
        total: 30
      },
      grade_level: 'Grade 1',
      learning_area_subject: 'Mathematical Activities',
      term: 'Term 3',
      week: 1,
      lesson_number: 1
    },
    curriculum_alignment: {
      strand: 'Numbers',
      sub_strand: 'Addition of Numbers up to 20',
      specific_learning_outcomes: {
        knowledge_understanding: 'By the end of the lesson, the learner should be able to identify that adding two groups yields a greater total count.',
        skills: 'By the end of the lesson, the learner should be able to physically group counters and write correct addition sentences (e.g. 7 + 5 = 12).',
        attitudes_values: 'By the end of the lesson, the learner should be able to appreciate sharing and taking turns with counting counters.'
      },
      key_inquiry_questions: [
        'How do we find the total when we put two sets of items together?'
      ],
      core_competencies_to_develop: [
        'Communication and Collaboration',
        'Critical Thinking and Problem Solving',
        'Self-Efficacy',
        'Learning to Learn'
      ],
      values: [
        'Respect',
        'Responsibility',
        'Unity'
      ],
      pertinent_and_contemporary_issues_pcis: [
        'Environmental Conservation (reusing bottle tops as counters)'
      ],
      learning_resources: [
        "Learner's Book",
        "Teacher's Guide",
        "Real Objects / Realia (clean bottle caps, wooden sticks)",
        "Digital Charts"
      ]
    },
    lesson_development_steps: [
      {
        step_number: 1,
        step_name: 'Introduction',
        duration: '5 minutes',
        teacher_activity: 'Teacher leads the class in singing a counting number song ("One, Two, Buckle My Shoe") and reviews numbers 1 to 20 on the board.',
        learner_activity: 'Learners sing along enthusiastically, clap in rhythm, and point out numbers called out by the teacher.',
        assessment_mode: 'Observation / Questioning'
      },
      {
        step_number: 2,
        step_name: 'Lesson Development - Step 1 (Concept Acquisition)',
        duration: '7 minutes',
        teacher_activity: 'Teacher places 6 red beads in one transparent cup and 4 blue beads in another. Demonstrates pouring both cups together and counting the combined sum (10).',
        learner_activity: 'Learners observe closely, count aloud with the teacher, and state the addition sentence: "6 and 4 makes 10".',
        assessment_mode: 'Oral check'
      },
      {
        step_number: 3,
        step_name: 'Lesson Development - Step 2 (Guided Practice & Group Work)',
        duration: '8 minutes',
        teacher_activity: 'Teacher distributes ten-frame trays and colored bottle caps to 5 small groups. Gives task: combine 8 yellow caps and 5 green caps.',
        learner_activity: 'Learners work in pairs, place caps on the ten-frame, count up to 13, and write 8 + 5 = 13 on small slates.',
        assessment_mode: 'Peer assessment / Rubric observation'
      },
      {
        step_number: 4,
        step_name: 'Lesson Development - Step 3 (Individual Practice / Task)',
        duration: '8 minutes',
        teacher_activity: 'Teacher walks round the room supporting slower learners while pupils complete 3 sums in their exercise books: 9+3, 7+6, 11+4.',
        learner_activity: 'Each learner works independently with counters, writing clear sums and answers in their Grade 1 numeracy book.',
        assessment_mode: 'Written exercise check'
      },
      {
        step_number: 5,
        step_name: 'Conclusion & Extended Learning',
        duration: '5 minutes',
        teacher_activity: 'Teacher reviews key solutions on the chalkboard, praises neat handwriting and accuracy, and assigns an at-home counting task.',
        learner_activity: 'Learners exchange books for quick peer check, celebrate achievements, and pack counters responsibly.',
        assessment_mode: 'Summary check'
      }
    ],
    post_lesson_reflection: {
      successes_and_strengths: '28 out of 30 learners achieved 100% accuracy in combining counters up to sum of 20 with enthusiastic cooperation.',
      challenges_observed: 'Two learners struggled initially with carrying over beyond ten on the ten-frame card.',
      remedial_and_next_steps: 'Provide paired peer buddy support with tangible bead strings during morning remedial slot.'
    },
    createdAt: '2026-09-02T08:00:00.000Z'
  },
  {
    id: 'lps-seed-02',
    administrative_details: {
      school_name: 'Editable School Name',
      school_code: 'EDITABLE_SCHOOL_NO_001',
      teacher_name: 'Tr. J. Omari',
      tsc_number: 'TSC/764910/KE',
      date: '2026-09-02',
      time: '35 mins',
      roll_enrolment: {
        boys: 15,
        girls: 17,
        total: 32
      },
      grade_level: 'Grade 4',
      learning_area_subject: 'Science and Technology',
      term: 'Term 3',
      week: 1,
      lesson_number: 2
    },
    curriculum_alignment: {
      strand: 'Computing and Digital Devices',
      sub_strand: 'Computer Input and Output Hardware Devices',
      specific_learning_outcomes: {
        knowledge_understanding: 'By the end of the lesson, the learner should be able to identify at least 3 input and 3 output computer devices.',
        skills: 'By the end of the lesson, the learner should be able to correctly connect a USB optical mouse and type simple commands on a keyboard.',
        attitudes_values: 'By the end of the lesson, the learner should be able to demonstrate care, cleanliness, and safety when handling school electronic gadgets.'
      },
      key_inquiry_questions: [
        'How does data get fed into a computer and how do we see the resulting information?'
      ],
      core_competencies_to_develop: [
        'Digital Literacy',
        'Critical Thinking and Problem Solving',
        'Communication and Collaboration'
      ],
      values: [
        'Responsibility',
        'Respect',
        'Integrity'
      ],
      pertinent_and_contemporary_issues_pcis: [
        'Cyber Safety and Proper Posture / Ergonomics'
      ],
      learning_resources: [
        "Learner's Book",
        "Teacher's Guide",
        "Real Objects / Realia (desktop keyboard, optical mouse, display monitor, printer)",
        "Digital Charts"
      ]
    },
    lesson_development_steps: [
      {
        step_number: 1,
        step_name: 'Introduction',
        duration: '5 minutes',
        teacher_activity: 'Teacher holds up an optical mouse and asks learners what human body part it mimics in guiding hand motions.',
        learner_activity: 'Learners brainstorm ideas and discuss previous experiences seeing computers in banks, supermarkets, and schools.',
        assessment_mode: 'Observation / Questioning'
      },
      {
        step_number: 2,
        step_name: 'Lesson Development - Step 1 (Concept Acquisition)',
        duration: '7 minutes',
        teacher_activity: 'Teacher explains the definition of Input (entering data) versus Output (displaying or printing results) using a digital diagram.',
        learner_activity: 'Learners repeat terminology, take concise notes, and categorize keyboard, webcam, and scanner under Input.',
        assessment_mode: 'Oral check'
      },
      {
        step_number: 3,
        step_name: 'Lesson Development - Step 2 (Guided Practice & Group Work)',
        duration: '8 minutes',
        teacher_activity: 'Teacher groups learners into bench squads with physical peripherals. Challenges each group to sort 6 items into Input vs Output boxes.',
        learner_activity: 'Learners examine realia devices, discuss their function collaboratively, and sort them into designated baskets.',
        assessment_mode: 'Peer assessment / Rubric observation'
      },
      {
        step_number: 4,
        step_name: 'Lesson Development - Step 3 (Individual Practice / Task)',
        duration: '8 minutes',
        teacher_activity: 'Teacher administers a short pictorial matching worksheet with 5 hardware icons and prompts written definitions.',
        learner_activity: 'Learners complete the worksheet independently, drawing connection lines and labeling functions.',
        assessment_mode: 'Written exercise check'
      },
      {
        step_number: 5,
        step_name: 'Conclusion & Extended Learning',
        duration: '5 minutes',
        teacher_activity: 'Teacher summarizes core distinctions and instructs pupils to identify digital output devices found at home.',
        learner_activity: 'Learners ask clarifying questions, recite key takeaways, and pack materials safely in the lab storage cabinet.',
        assessment_mode: 'Summary check'
      }
    ],
    post_lesson_reflection: {
      successes_and_strengths: 'Learners showed tremendous excitement handling real mice and keyboards; 100% distinguished monitor from CPU tower.',
      challenges_observed: 'Some pupils confused speakers (output) with microphones (input).',
      remedial_and_next_steps: 'Start tomorrow with an audio test playing sounds to clarify microphone sound input versus speaker sound output.'
    },
    createdAt: '2026-09-02T09:15:00.000Z'
  }
];
