import { 
  SystemConfig, 
  AcademicCalendarsConfig, 
  KNECProjectModule, 
  ExamSeriesPaper 
} from '../types';

export const INITIAL_SYSTEM_CONFIG: SystemConfig = {
  appName: "Little Roses EduHub",
  version: "2.0.0",
  clockSettings: {
    displaySeconds: true,
    format: "HH:MM:SS",
    syncSource: "device_local_time"
  },
  rolesAndPermissions: {
    ADMIN: {
      password: "[PROTECTED_HASH]",
      permissions: {
        textbooksAndResources: "WRITE",
        timetableOverrides: "WRITE",
        systemSettings: "WRITE"
      }
    },
    TEACHERS: {
      passwords: {
        elvis: "[PROTECTED_HASH]",
        fresiah: "[PROTECTED_HASH]",
        kelvin: "[PROTECTED_HASH]",
        liz: "[PROTECTED_HASH]"
      },
      permissions: {
        textbooksAndResources: "READ_ONLY",
        timetableOverrides: "READ_ONLY",
        personalDashboard: "READ_WRITE"
      }
    }
  },
  resourceInputTypes: [
    {
      type: "PDF_ATTACHMENT",
      allowedExtensions: [".pdf"],
      maxFileSizeMB: 50
    },
    {
      type: "RAW_TEXT_AI_COPY",
      format: "markdown",
      supportFormattedNotes: true
    }
  ],
  framework: "Revised / Rationalized Competency-Based Education (CBE)",
  current_date: "2026-09-02T19:23:00",
  academic_year: 2026,
  active_academic_year: 2026,
  active_term: 'Term 3',
  school_metadata: {
    school_name: 'Little Roses Academy',
    head_teacher_name: 'Mr. Kelvin (Headteacher)',
    school_code_number: 'LRA-NAK-2026-001',
    is_code_editable: true,
    po_box: 'P.O. Box 3443 NAKURU',
    phone: '0798 193966',
    email: 'roseslittle3@gmail.com',
    motto: 'Much from Little',
    county: 'Nakuru County'
  },
};

export const OFFICIAL_ACADEMIC_CALENDARS: AcademicCalendarsConfig = {
  year_2026: {
    term_1: {
      start: '2026-01-05',
      mid_term: '2026-02-25 to 2026-03-01',
      end: '2026-04-02',
    },
    term_2: {
      start: '2026-04-27',
      mid_term: '2026-06-24 to 2026-06-28',
      knec_projects_portal_opens: '2026-05-15',
      end: '2026-07-31',
    },
    term_3: {
      start: '2026-08-24',
      kpsea_exam_dates: '2026-10-26 to 2026-10-28',
      end: '2026-10-23',
    },
  },
  year_2027_projected: {
    term_1: {
      start: '2027-01-04',
      mid_term_break: '2027-02-24 to 2027-02-28',
      end: '2027-04-02',
      exam_series: [
        'Opener Assessment',
        'Mid-Term Evaluation',
        'Term 1 Targeter/Jesma Series',
      ],
    },
    term_2: {
      start: '2027-04-26',
      mid_term_break: '2027-06-23 to 2027-06-27',
      knec_projects_portal_auto_sync: '2027-05-17',
      end: '2027-07-30',
      exam_series: [
        'Term 2 Predictors Series',
        'Jesma Evaluation Sets',
        'Spotlight Trial Papers',
      ],
    },
    term_3: {
      start: '2027-08-23',
      kpsea_national_window: '2027-10-25 to 2027-10-28',
      end: '2027-10-22',
    },
  },
};

export const KNEC_SYNC_ENGINE_CONFIG = {
  sync_schedule: 'AUTOMATIC_EVERY_YEAR_TERM_2',
  target_portal: 'https://cba.knec.ac.ke',
  applicable_grades: ['Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'] as const,
  ai_assistant_agent: {
    role: 'Fetch, analyze, and generate project task guidelines and score rubrics based on official KNEC CBA Term 2 uploads.',
    auto_generate_modules: [
      'Project Task Instructions for Learners',
      'Teacher Marking Guidelines & Performance Levels (1-4)',
      'CBCE Portfolio Upload Format',
    ],
  },
};

export const EXAM_SERIES_CONFIG = {
  supported_publishers: [
    'Targeter Series (Opener, Midterm, Endterm)',
    'Jesma Exams Series',
    'Predictors Series',
    'Signal & Spotlight Evaluation Papers',
  ] as const,
  auto_schedule_rules: {
    opener_exams: 'Week 1 to Week 2 of every term',
    midterm_series: 'Week 6 to Week 7 of Term 1 and Term 2',
    endterm_evaluations: 'Final 2 weeks of Term 1, Term 2, and Term 3',
  },
};

export const INITIAL_KNEC_PROJECTS: KNECProjectModule[] = [
  {
    id: 'knec-g6-agri-01',
    grade: 'Grade 6',
    subject: 'Agriculture',
    title: 'Innovative Organic Farming: Drip Irrigation & Composting Project',
    term: 'Term 2',
    cbaCode: 'CBA-2026-G6-AGR-094',
    durationWeeks: 4,
    status: 'Ready',
    taskInstructions: {
      objective: 'Design and assemble a micro-drip irrigation system using recycled plastic containers and prepare a standard organic compost pit/heap.',
      learnerGuidelines: [
        'Select at least 4 discarded 2-litre plastic bottles or containers.',
        'Perforate small pin-holes at the base and attach a wick or regulated dropper mechanism.',
        'Install the drip container alongside 3 chosen vegetable seedlings (kale, spinach, or indigenous vegetables).',
        'Maintain a 14-day daily irrigation log recording soil moisture, vegetative vigor, and water volume conserved.',
        'Assemble a 1m x 1m compost pile with alternating green waste, dry foliage, farmyard manure, and topsoil.',
      ],
      materialsRequired: [
        '4x Recycled 2L PET plastic bottles',
        'Needle or small nail with heat source for perforation',
        'String/sticks for staking support',
        'Kitchen/garden organic waste (green matter & dry brown foliage)',
        'Moisture observation journal and ruler',
      ],
      safetyPrecautions: [
        'Always handle piercing tools under adult/teacher supervision.',
        'Wear protective gloves when turning or layering organic compost matter.',
        'Wash hands thoroughly with clean running water and soap after field tasks.',
      ],
      keyInquiryQuestions: [
        'How does drip bottle irrigation prevent soil water evaporation compared to open splashing?',
        'What indicators show active microbial decomposition inside the compost heap?',
      ],
      submissionEvidence: [
        'Photographic evidence of installed drip bottle apparatus.',
        '14-Day Learner Observation Journal signed by parent/guardian.',
        'Mini-sample or diagram of the finished organic compost layers.',
      ],
    },
    markingGuidelines: {
      rubrics: [
        {
          level: 4,
          ratingCode: 'EE',
          name: 'Exceeding Expectations',
          scoreRange: 'Score 4 (80% - 100%)',
          description: 'Flawlessly constructs drip irrigation unit with innovative flow regulator, maintains meticulous daily observation log, and demonstrates exceptional mastery of organic compost thermophilic phases.',
          criteria: [
            'All drip bottles functional with calibrated seepage',
            'Full 14-day log with moisture metrics & growth measurements',
            'Compost heap maintains correct C:N layering & moisture',
            'Demonstrates creative reuse of recycled plastics',
          ],
        },
        {
          level: 3,
          ratingCode: 'ME',
          name: 'Meeting Expectations',
          scoreRange: 'Score 3 (65% - 79%)',
          description: 'Successfully builds working drip apparatus and layered compost pile with complete records and accurate answers to inquiry questions.',
          criteria: [
            'Drip bottle irrigates target seedlings adequately',
            'Observation log completed for at least 10 days',
            'Compost layers clearly organized with organic waste',
            'Active participation during teacher inspection',
          ],
        },
        {
          level: 2,
          ratingCode: 'AE',
          name: 'Approaching Expectations',
          scoreRange: 'Score 2 (50% - 64%)',
          description: 'Constructs the drip container with occasional leakage or irregular flow; observation log is partially filled; requires guidance on compost layering.',
          criteria: [
            'Apparatus functions with teacher assistance',
            'Log contains sporadic entries (5-9 days)',
            'Compost pile lacks adequate dry/green ratio',
          ],
        },
        {
          level: 1,
          ratingCode: 'BE',
          name: 'Below Expectations',
          scoreRange: 'Score 1 (0% - 49%)',
          description: 'Unable to assemble functioning drip unit without extensive direct intervention; log is incomplete or missing; compost heap not established.',
          criteria: [
            'Incomplete apparatus setup',
            'Less than 5 days of recorded observations',
            'Unable to explain basic irrigation principles',
          ],
        },
      ],
      teacherNotes: 'Scores must be uploaded to https://cba.knec.ac.ke portal with photographic proof of learner actively tending to the drip irrigation apparatus.',
    },
    portfolioUpload: {
      portalUrl: 'https://cba.knec.ac.ke',
      expectedFormat: 'CSV',
      fields: ['LearnerUPI', 'AssessmentNumber', 'ProjectCode', 'Task1_Apparatus', 'Task2_Journal', 'Task3_Compost', 'OverallLevel', 'UploadedDate'],
      sampleRecord: {
        LearnerUPI: 'LRA2026001',
        AssessmentNumber: 'KNEC-CBA-001',
        ProjectCode: 'CBA-2026-G6-AGR-094',
        Task1_Apparatus: 4,
        Task2_Journal: 4,
        Task3_Compost: 3,
        OverallLevel: 'EE (Level 4)',
        UploadedDate: '2026-05-18',
      },
    },
  },
  {
    id: 'knec-g6-science-02',
    grade: 'Grade 6',
    subject: 'Science',
    title: 'Water Filtration & Purification Column Construction',
    term: 'Term 2',
    cbaCode: 'CBA-2026-G6-SCI-112',
    durationWeeks: 3,
    status: 'Ready',
    taskInstructions: {
      objective: 'Construct a multi-layer physical water filtration column using natural materials (gravel, coarse sand, fine sand, and activated charcoal) and test turbidity reduction.',
      learnerGuidelines: [
        'Take an inverted 1.5L clear plastic bottle with the bottom severed.',
        'Place a cotton ball or clean cloth at the bottleneck nozzle.',
        'Layer materials in ascending order: crushed charcoal, fine sand, coarse sand, and small pebbles.',
        'Pour a measured sample of muddy pond/turbid runoff water through the filtration apparatus.',
        'Observe and record clarity, sediment retention, and flow rate.',
      ],
      materialsRequired: [
        '1.5L Clear plastic bottle',
        'Clean cotton wool or fine mesh fabric',
        'Crushed wood charcoal',
        'Fine river sand (washed and dried)',
        'Coarse sand and small pebbles',
        'Turbid water sample in a transparent jar',
      ],
      safetyPrecautions: [
        'Treated water from physical filtration is NOT potable until boiled or chemically disinfected.',
        'Carefully trim the bottle rim under teacher/guardian supervision.',
      ],
      keyInquiryQuestions: [
        'Why is activated charcoal placed near the bottom outlet of the filtration column?',
        'Does physical filtration eliminate microscopic biological pathogens?',
      ],
      submissionEvidence: [
        'Before & after comparison photo of turbid water vs filtrate.',
        'Labeled schematic cross-section of the filtration column.',
        'Completed KNEC scientific inquiry worksheet.',
      ],
    },
    markingGuidelines: {
      rubrics: [
        {
          level: 4,
          ratingCode: 'EE',
          name: 'Exceeding Expectations',
          scoreRange: 'Score 4 (80% - 100%)',
          description: 'Constructs an immaculate filtration column with distinct sediment layering; produces crystal-clear filtrate and provides insightful scientific reasoning on adsorption and filtration.',
          criteria: [
            'Clear separation of 4 distinct filtering media',
            'Filtrate shows remarkable turbidity reduction (>90%)',
            'Correctly identifies need for boiling/chlorination',
            'Exemplary scientific diagram and portfolio report',
          ],
        },
        {
          level: 3,
          ratingCode: 'ME',
          name: 'Meeting Expectations',
          scoreRange: 'Score 3 (65% - 79%)',
          description: 'Constructs functioning column; effectively filters particulate matter; explains correct layer ordering.',
          criteria: [
            'All layers present in proper sequence',
            'Filtrate is noticeably clearer than input water',
            'Accurate schematic diagram labeled correctly',
          ],
        },
        {
          level: 2,
          ratingCode: 'AE',
          name: 'Approaching Expectations',
          scoreRange: 'Score 2 (50% - 64%)',
          description: 'Column constructed but layers mix due to lack of mesh separation; filtration rate is either clogged or too fast.',
          criteria: [
            'Partial layer distinction',
            'Modest reduction in turbidity',
            'Requires guidance to complete inquiry worksheet',
          ],
        },
        {
          level: 1,
          ratingCode: 'BE',
          name: 'Below Expectations',
          scoreRange: 'Score 1 (0% - 49%)',
          description: 'Inability to assemble layers correctly; filtrate remains cloudy or column fails to drain; incomplete worksheet.',
          criteria: [
            'Incorrect ordering of filter media',
            'Incomplete or missing documentation',
          ],
        },
      ],
      teacherNotes: 'Validate that learners understand the distinction between physical filtration and microbiological disinfection.',
    },
    portfolioUpload: {
      portalUrl: 'https://cba.knec.ac.ke',
      expectedFormat: 'CSV',
      fields: ['LearnerUPI', 'AssessmentNumber', 'ProjectCode', 'Column_Setup', 'Clarity_Analysis', 'Written_Report', 'OverallLevel', 'UploadedDate'],
      sampleRecord: {
        LearnerUPI: 'LRA2026002',
        AssessmentNumber: 'KNEC-CBA-002',
        ProjectCode: 'CBA-2026-G6-SCI-112',
        Column_Setup: 4,
        Clarity_Analysis: 3,
        Written_Report: 4,
        OverallLevel: 'EE (Level 4)',
        UploadedDate: '2026-05-19',
      },
    },
  },
  {
    id: 'knec-g5-art-03',
    grade: 'Grade 5',
    subject: 'Creative Arts',
    title: 'Kenyan Indigenous Weaving & Cultural Folk Song Performance',
    term: 'Term 2',
    cbaCode: 'CBA-2026-G5-ART-043',
    durationWeeks: 4,
    status: 'Ready',
    taskInstructions: {
      objective: 'Weave a 20cm x 20cm functional mat or coaster using locally sourced sisal/banana fiber and perform a traditional cultural Kenyan folk song with acoustic accompaniment.',
      learnerGuidelines: [
        'Harvest and prepare natural sisal fibers or clean dry banana plant stalks.',
        'Construct a simple cardboard loom with slotted warp notches spaced 1cm apart.',
        'Interlace the weft fibers using alternating plain tabby weave or twill pattern.',
        'Sing a traditional community folk song in Kenyan indigenous language or Kiswahili, demonstrating rhythm, pitch, and cultural expressive body movements.',
      ],
      materialsRequired: [
        'Stiff corrugated cardboard (25cm x 25cm)',
        'Dyed or natural sisal cords, banana fiber strips, or twine',
        'Large blunt tapestry needle or ruler shed stick',
        'Traditional percussion rattle or shakers (kayamba, chivoti, or improvised shakers)',
      ],
      safetyPrecautions: [
        'Avoid sharp knife blades when peeling plant stalks; use blunt scissors.',
      ],
      keyInquiryQuestions: [
        'How does tension in the warp threads determine the durability of woven fabric?',
        'What cultural values and historical narratives are preserved through indigenous folk songs?',
      ],
      submissionEvidence: [
        'Finished woven fiber mat with neat edge selvedge bindings.',
        'Teacher observation scoring sheet for the musical performance.',
        'Learner reflection card describing the chosen cultural folk song.',
      ],
    },
    markingGuidelines: {
      rubrics: [
        {
          level: 4,
          ratingCode: 'EE',
          name: 'Exceeding Expectations',
          scoreRange: 'Score 4 (80% - 100%)',
          description: 'Flawlessly tensioned weaving with intricate decorative fiber pattern; outstanding musicality, rhythm, and expressive authenticity during cultural performance.',
          criteria: [
            'Uniform selvedges with no loose warp loops',
            'Creative blending of dyed and natural fibers',
            'Strong vocal pitch, dynamic rhythm, and cultural attire',
          ],
        },
        {
          level: 3,
          ratingCode: 'ME',
          name: 'Meeting Expectations',
          scoreRange: 'Score 3 (65% - 79%)',
          description: 'Well-executed weaving project meeting size requirements; confident performance of cultural folk song with clear beat.',
          criteria: [
            'Complete woven mat with intact borders',
            'Consistent rhythmic accompaniment with percussion',
            'Clear understanding of folk song meaning',
          ],
        },
        {
          level: 2,
          ratingCode: 'AE',
          name: 'Approaching Expectations',
          scoreRange: 'Score 2 (50% - 64%)',
          description: 'Weaving has irregular edges or uneven tension; musical performance shows hesitation or missed lyrical phrases.',
          criteria: [
            'Incomplete selvedge finish',
            'Requires prompting during the musical performance',
          ],
        },
        {
          level: 1,
          ratingCode: 'BE',
          name: 'Below Expectations',
          scoreRange: 'Score 1 (0% - 49%)',
          description: 'Unfinished woven piece; unable to demonstrate basic weaving weave technique; difficulty following musical rhythm.',
          criteria: [
            'Unraveled weaving structure',
            'Incomplete musical participation',
          ],
        },
      ],
      teacherNotes: 'Record video or audio snippet for learner digital CBA evidence repository.',
    },
    portfolioUpload: {
      portalUrl: 'https://cba.knec.ac.ke',
      expectedFormat: 'CSV',
      fields: ['LearnerUPI', 'AssessmentNumber', 'ProjectCode', 'Weaving_Craft', 'Music_Vocal', 'Cultural_Expression', 'OverallLevel', 'UploadedDate'],
      sampleRecord: {
        LearnerUPI: 'LRA2026003',
        AssessmentNumber: 'KNEC-CBA-003',
        ProjectCode: 'CBA-2026-G5-ART-043',
        Weaving_Craft: 3,
        Music_Vocal: 4,
        Cultural_Expression: 4,
        OverallLevel: 'ME (Level 3)',
        UploadedDate: '2026-05-20',
      },
    },
  },
  {
    id: 'knec-g4-agri-04',
    grade: 'Grade 4',
    subject: 'Agriculture',
    title: 'Soil Erosion Control: Mini-Gabion & Grass Strip Model',
    term: 'Term 2',
    cbaCode: 'CBA-2026-G4-AGR-019',
    durationWeeks: 3,
    status: 'Ready',
    taskInstructions: {
      objective: 'Model soil conservation methods by creating a miniature stone gabion and vegetative grass strip on an inclined soil tray to arrest runoff water velocity.',
      learnerGuidelines: [
        'Prepare an inclined wooden or plastic tray filled with loam soil to simulate a hillside gradient.',
        'Construct a wire mesh box (15cm x 8cm) packed tightly with small river stones (gabion model).',
        'Plant a contour strip of star grass or vetiver cuttings across the mid-section.',
        'Simulate rainfall using a watering can and measure sediment runoff captured at the base.',
      ],
      materialsRequired: [
        'Soil tray or garden plot slope',
        'Pliable chicken wire or plastic mesh netting',
        'River pebbles / stones',
        'Grass runners or leafy cuttings',
        'Watering can with sprinkler nozzle',
      ],
      safetyPrecautions: [
        'Watch for sharp wire cut edges; bend wire ends inwards.',
      ],
      keyInquiryQuestions: [
        'How does a porous stone gabion reduce water erosion without collapsing?',
        'Why are grass root networks vital on sloping farmlands?',
      ],
      submissionEvidence: [
        'Visual model demonstration during school open day.',
        'Illustrated poster showing 3 major types of soil erosion in Kenya.',
      ],
    },
    markingGuidelines: {
      rubrics: [
        {
          level: 4,
          ratingCode: 'EE',
          name: 'Exceeding Expectations',
          scoreRange: 'Score 4 (80% - 100%)',
          description: 'Skillfully constructs robust mini-gabion with dense grass strip that successfully traps sediment; articulates erosion mitigation mechanisms with fluency.',
          criteria: [
            'Sturdy wire mesh construction filled with graded stones',
            'Sediment capture visibly demonstrates erosion control',
            'Excellent oral explanation of gulley erosion prevention',
          ],
        },
        {
          level: 3,
          ratingCode: 'ME',
          name: 'Meeting Expectations',
          scoreRange: 'Score 3 (65% - 79%)',
          description: 'Constructs functional model showing clear reduction in soil loss; poster correctly labels splash, sheet, and gulley erosion.',
          criteria: [
            'Gabion stays intact under simulated rainfall',
            'Grass strip positioned accurately on contour line',
            'Accurate poster drawing of Kenyan topography',
          ],
        },
        {
          level: 2,
          ratingCode: 'AE',
          name: 'Approaching Expectations',
          scoreRange: 'Score 2 (50% - 64%)',
          description: 'Model is partially constructed; stones spill from mesh under water flow; poster is sketchy or missing labels.',
          criteria: [
            'Gabion requires structural reinforcement',
            'Partial soil retention observed',
          ],
        },
        {
          level: 1,
          ratingCode: 'BE',
          name: 'Below Expectations',
          scoreRange: 'Score 1 (0% - 49%)',
          description: 'Fails to model functional gabion or grass strip; cannot explain the role of soil conservation.',
          criteria: [
            'Unassembled materials',
            'Incomplete project submission',
          ],
        },
      ],
      teacherNotes: 'Correlate with official KNEC Grade 4 Agriculture curriculum strands.',
    },
    portfolioUpload: {
      portalUrl: 'https://cba.knec.ac.ke',
      expectedFormat: 'CSV',
      fields: ['LearnerUPI', 'AssessmentNumber', 'ProjectCode', 'Model_Build', 'Simulation_Test', 'Poster_Work', 'OverallLevel', 'UploadedDate'],
      sampleRecord: {
        LearnerUPI: 'LRA2026004',
        AssessmentNumber: 'KNEC-CBA-004',
        ProjectCode: 'CBA-2026-G4-AGR-019',
        Model_Build: 4,
        Simulation_Test: 4,
        Poster_Work: 3,
        OverallLevel: 'EE (Level 4)',
        UploadedDate: '2026-05-21',
      },
    },
  },
  {
    id: 'knec-g3-math-05',
    grade: 'Grade 3',
    subject: 'Mathematics',
    title: 'Community Market Survey & Recycled Waste Weighing Project',
    term: 'Term 2',
    cbaCode: 'CBA-2026-G3-MAT-008',
    durationWeeks: 2,
    status: 'Ready',
    taskInstructions: {
      objective: 'Collect, classify, and measure the mass of recyclable materials (paper, plastic bottles, tins) in kilograms using a balance scale and calculate simple revenue estimates.',
      learnerGuidelines: [
        'Collect clean discarded household waste items over 5 school days.',
        'Classify items into Paper, Plastics, and Metals.',
        'Use an improvised or standard beam balance to determine mass in kilograms and grams.',
        'Construct a tally sheet and bar graph displaying the total mass collected per category.',
        'Calculate mock proceeds using given market rates per kilogram.',
      ],
      materialsRequired: [
        'Clean recyclables (cartons, plastic bottles, food cans)',
        'Beam balance scale and calibrated 500g/1kg standard weights',
        'Graph sheet / grid paper and crayons',
      ],
      safetyPrecautions: [
        'Ensure all metal cans are inspected for sharp edges or burrs.',
        'Wash and sanitize hands after handling recyclable collections.',
      ],
      keyInquiryQuestions: [
        'Which recyclable material has the highest volume-to-weight ratio?',
        'How does weighing accuracy support fair trade in local Kenyan markets?',
      ],
      submissionEvidence: [
        'Completed waste classification tally chart.',
        'Hand-drawn bar graph showing mass per material.',
        'Arithmetic computation sheet for market revenue.',
      ],
    },
    markingGuidelines: {
      rubrics: [
        {
          level: 4,
          ratingCode: 'EE',
          name: 'Exceeding Expectations',
          scoreRange: 'Score 4 (80% - 100%)',
          description: 'Accurately weighs all items with zero error; constructs neatly scaled bar chart with clear titles and legends; calculates financial totals without mistake.',
          criteria: [
            'Precision measurement of kilograms and grams',
            'Exemplary graphical bar graph presentation',
            'Demonstrates environmental stewardship awareness',
          ],
        },
        {
          level: 3,
          ratingCode: 'ME',
          name: 'Meeting Expectations',
          scoreRange: 'Score 3 (65% - 79%)',
          description: 'Weighs recyclables correctly; draws readable bar graph; completes revenue calculations with minor guidance.',
          criteria: [
            'Correct categorization of waste items',
            'Bar chart correctly corresponds to tally totals',
            'Answers inquiry questions accurately',
          ],
        },
        {
          level: 2,
          ratingCode: 'AE',
          name: 'Approaching Expectations',
          scoreRange: 'Score 2 (50% - 64%)',
          description: 'Requires assistance reading balance scale; bar graph is disproportional or mislabeled.',
          criteria: [
            'Partial data recorded on tally sheet',
            'Arithmetic mistakes in revenue sums',
          ],
        },
        {
          level: 1,
          ratingCode: 'BE',
          name: 'Below Expectations',
          scoreRange: 'Score 1 (0% - 49%)',
          description: 'Unable to classify items or operate beam scale; bar graph incomplete.',
          criteria: [
            'Incomplete weight records',
            'Missing final submission',
          ],
        },
      ],
      teacherNotes: 'Foundation numeracy project assessing CBC Grade 3 measurement and data handling strands.',
    },
    portfolioUpload: {
      portalUrl: 'https://cba.knec.ac.ke',
      expectedFormat: 'CSV',
      fields: ['LearnerUPI', 'AssessmentNumber', 'ProjectCode', 'Tally_Accuracy', 'Graph_Display', 'Arithmetic_Total', 'OverallLevel', 'UploadedDate'],
      sampleRecord: {
        LearnerUPI: 'LRA2026005',
        AssessmentNumber: 'KNEC-CBA-005',
        ProjectCode: 'CBA-2026-G3-MAT-008',
        Tally_Accuracy: 4,
        Graph_Display: 3,
        Arithmetic_Total: 4,
        OverallLevel: 'ME (Level 3)',
        UploadedDate: '2026-05-22',
      },
    },
  },
];

export const INITIAL_EXAM_SERIES: ExamSeriesPaper[] = [
  // Term 3 (Active Term: 2026)
  {
    id: 'exam-2026-t3-tgt-end',
    title: 'Targeter Series Term 3 End-Term Comprehensive Evaluation',
    publisher: 'Targeter Series (Opener, Midterm, Endterm)',
    publisherShort: 'Targeter',
    seriesType: 'Endterm',
    grade: 'Grade 6',
    subject: 'Mathematics',
    term: 'Term 3',
    year: 2026,
    autoScheduleRule: 'Final 2 weeks of Term 1, Term 2, and Term 3',
    scheduledWeeks: 'Week 8 to Week 9 (Oct 12 - Oct 23, 2026)',
    totalMarks: 100,
    durationMinutes: 90,
    paperCode: 'TGT-2026-T3-G6-MATH',
    hasMarkingScheme: true,
    status: 'Ready',
  },
  {
    id: 'exam-2026-t3-jesma-kpsea',
    title: 'Jesma Exams Series KPSEA National Model Rehearsal Set 1',
    publisher: 'Jesma Exams Series',
    publisherShort: 'Jesma',
    seriesType: 'KPSEA Trial',
    grade: 'Grade 6',
    subject: 'Science',
    term: 'Term 3',
    year: 2026,
    autoScheduleRule: 'Final 2 weeks of Term 1, Term 2, and Term 3',
    scheduledWeeks: 'Week 9 (Oct 19 - Oct 23, 2026)',
    totalMarks: 100,
    durationMinutes: 80,
    paperCode: 'JES-2026-KPSEA-SET1-SCI',
    hasMarkingScheme: true,
    status: 'Ready',
  },
  {
    id: 'exam-2026-t3-pred-eng',
    title: 'Predictors Series Term 3 Language Mastery & Composition Trial',
    publisher: 'Predictors Series',
    publisherShort: 'Predictors',
    seriesType: 'Endterm',
    grade: 'Grade 6',
    subject: 'English',
    term: 'Term 3',
    year: 2026,
    autoScheduleRule: 'Final 2 weeks of Term 1, Term 2, and Term 3',
    scheduledWeeks: 'Week 8 (Oct 12 - Oct 16, 2026)',
    totalMarks: 100,
    durationMinutes: 90,
    paperCode: 'PRED-2026-T3-G6-ENG',
    hasMarkingScheme: true,
    status: 'Ready',
  },
  {
    id: 'exam-2026-t3-spot-soc',
    title: 'Signal & Spotlight Term 3 National Evaluation Papers',
    publisher: 'Signal & Spotlight Evaluation Papers',
    publisherShort: 'Signal & Spotlight',
    seriesType: 'Endterm',
    grade: 'Grade 5',
    subject: 'Social Studies',
    term: 'Term 3',
    year: 2026,
    autoScheduleRule: 'Final 2 weeks of Term 1, Term 2, and Term 3',
    scheduledWeeks: 'Week 8 to Week 9 (Oct 12 - Oct 23, 2026)',
    totalMarks: 100,
    durationMinutes: 75,
    paperCode: 'SPOT-2026-T3-G5-SST',
    hasMarkingScheme: true,
    status: 'Ready',
  },
  // Opener Exams
  {
    id: 'exam-2026-t3-tgt-open',
    title: 'Targeter Series Term 3 Opener Readiness Diagnostic Assessment',
    publisher: 'Targeter Series (Opener, Midterm, Endterm)',
    publisherShort: 'Targeter',
    seriesType: 'Opener',
    grade: 'Grade 6',
    subject: 'Kiswahili',
    term: 'Term 3',
    year: 2026,
    autoScheduleRule: 'Week 1 to Week 2 of every term',
    scheduledWeeks: 'Week 1 to Week 2 (Aug 24 - Sep 04, 2026)',
    totalMarks: 50,
    durationMinutes: 60,
    paperCode: 'TGT-2026-T3-G6-KISW-OPN',
    hasMarkingScheme: true,
    status: 'Completed',
  },
  // 2027 Projected Series
  {
    id: 'exam-2027-t1-open',
    title: '2027 Projected Term 1 Opener Assessment Series',
    publisher: 'Targeter Series (Opener, Midterm, Endterm)',
    publisherShort: 'Targeter',
    seriesType: 'Opener',
    grade: 'Grade 6',
    subject: 'Mathematics',
    term: 'Term 1',
    year: 2027,
    autoScheduleRule: 'Week 1 to Week 2 of every term',
    scheduledWeeks: 'Week 1 to Week 2 (Jan 04 - Jan 15, 2027)',
    totalMarks: 100,
    durationMinutes: 90,
    paperCode: 'TGT-2027-T1-G6-MATH-OPN',
    hasMarkingScheme: true,
    status: 'Scheduled',
  },
  {
    id: 'exam-2027-t2-pred',
    title: '2027 Term 2 Predictors Series National Preparation Sets',
    publisher: 'Predictors Series',
    publisherShort: 'Predictors',
    seriesType: 'Midterm',
    grade: 'Grade 6',
    subject: 'Science',
    term: 'Term 2',
    year: 2027,
    autoScheduleRule: 'Week 6 to Week 7 of Term 1 and Term 2',
    scheduledWeeks: 'Week 6 to Week 7 (Jun 01 - Jun 12, 2027)',
    totalMarks: 100,
    durationMinutes: 80,
    paperCode: 'PRED-2027-T2-G6-SCI-MID',
    hasMarkingScheme: true,
    status: 'Scheduled',
  },
];
