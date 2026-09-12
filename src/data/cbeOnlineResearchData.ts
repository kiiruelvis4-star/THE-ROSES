import { GradeLevel, TermName } from '../types';

export interface CBESubjectResearchProfile {
  subject: string;
  gradeTier: 'lower' | 'upper' | 'both';
  applicableGrades: GradeLevel[];
  curriculumDesignRef: string;
  description: string;
  onlineResearchPortals: Array<{
    title: string;
    organization: string;
    url: string;
    focus: string;
    pedagogyNotes: string;
  }>;
  researchStrands: Array<{
    strand: string;
    subStrand: string;
    specificLearningOutcomes: string;
    keyInquiryQuestions: string;
    learningProcess: string;
    suggestedWorkPlanned: string;
    suggestedWorkCovered: string;
    commonChallenges: string;
    evidenceBasedRemedialAction: string;
    onlineResearchSource: string;
  }>;
}

export const CBE_ONLINE_RESEARCH_DATABASE: CBESubjectResearchProfile[] = [
  // =========================================================================
  // LOWER PRIMARY (GRADES 1 - 3): 7 FOUNDATIONAL LEARNING AREAS
  // NOTE: Social Studies and Science & Tech are EXCLUDED from Grades 1 to 3
  // =========================================================================
  {
    subject: 'Mathematical Activities',
    gradeTier: 'lower',
    applicableGrades: ['Grade 1', 'Grade 2', 'Grade 3'],
    curriculumDesignRef: 'KICD/CURR/DES/L-PRI/MATH-01',
    description: 'Foundation numeracy, early spatial sense, patterns, measurement using non-standard and standard units, and realia-based concrete operations.',
    onlineResearchPortals: [
      {
        title: 'Kenya Education Cloud (KEC) Primary Mathematics Repository',
        organization: 'Kenya Institute of Curriculum Development (KICD)',
        url: 'https://kec.ac.ke/primary/mathematics',
        focus: 'Interactive digital number lines, counting manipulatives, and realia exercises.',
        pedagogyNotes: 'Bruner’s Concrete-Pictorial-Abstract (CPA) framework for foundational numeracy.'
      },
      {
        title: 'NRICH Early Years Mathematics Inquiry Hub',
        organization: 'University of Cambridge NRICH Math Project',
        url: 'https://nrich.maths.org/early-years',
        focus: 'Problem-solving games, spatial puzzles, and grouping strategies.',
        pedagogyNotes: 'Emphasizes child-led inquiry through physical tactile sorting and pattern creation.'
      }
    ],
    researchStrands: [
      {
        strand: 'Numbers',
        subStrand: 'Addition with regrouping using place value blocks',
        specificLearningOutcomes: 'By end of lesson, learner can: 1. Represent two-digit numbers using bundles of tens and units. 2. Add two numbers with regrouping up to 99. 3. Appreciate collaboration in pairs.',
        keyInquiryQuestions: 'How can bundling tens help us add larger numbers accurately?',
        learningProcess: 'Learners work in pairs using bottle tops and rubber bands to form tens. Learners bundle 10 ones into 1 ten, record on place value abacus, and solve guided peer problems.',
        suggestedWorkPlanned: 'Adding two-digit numbers with regrouping using concrete counting counters and abacus.',
        suggestedWorkCovered: 'Learners modeled 8 regrouping problems using physical sticks/bottle-tops; 92% solved workbook items accurately.',
        commonChallenges: 'Some learners forgot to carry over the grouped ten to the tens column.',
        evidenceBasedRemedialAction: 'Used dual-color place value chart (blue for units, red for tens) for tactile visual grounding.',
        onlineResearchSource: 'KICD KEC Numeracy Module G2-NUM-04 & NRICH Early Math Spatial Grouping'
      },
      {
        strand: 'Measurement',
        subStrand: 'Mass and capacity estimation using beam balances',
        specificLearningOutcomes: 'By end of lesson, learner can: 1. Compare mass of classroom objects using a simple beam balance. 2. Record heavier and lighter items. 3. Demonstrate curiosity.',
        keyInquiryQuestions: 'How do we find out which object has more mass when sizes look similar?',
        learningProcess: 'Learners handle real objects (chalk, stone, eraser, cup) and predict heavier vs lighter before placing on beam balance scales.',
        suggestedWorkPlanned: 'Comparison of mass of common classroom objects using improvised beam balances.',
        suggestedWorkCovered: 'Hands-on weighing station conducted; pupils classified 10 everyday objects in 3-tier comparative tables.',
        commonChallenges: 'Confusion between physical volume size and actual mass weight.',
        evidenceBasedRemedialAction: 'Guided paired weighing of a large sponge vs a small pebble to clarify density vs size.',
        onlineResearchSource: 'UNESCO Global Primary Science & Numeracy Toolkit / KEC Math Portal'
      }
    ]
  },

  {
    subject: 'English Language Activities',
    gradeTier: 'lower',
    applicableGrades: ['Grade 1', 'Grade 2', 'Grade 3'],
    curriculumDesignRef: 'KICD/CURR/DES/L-PRI/ENG-02',
    description: 'Oral listening skills, synthetic phonics blending, decodable graded readers, and early print handwriting.',
    onlineResearchPortals: [
      {
        title: 'Tusome National Early Grade Reading Portal',
        organization: 'USAID Kenya & Ministry of Education',
        url: 'https://tusome.education.go.ke',
        focus: 'Phonological awareness, letter-sound correspondence, and decodable leveled texts.',
        pedagogyNotes: 'Direct instruction model: I Do (teacher model), We Do (guided practice), You Do (independent mastery).'
      },
      {
        title: 'British Council LearnEnglish Early Literacy Research',
        organization: 'British Council Education Hub',
        url: 'https://learnenglishkids.britishcouncil.org',
        focus: 'Phonics songs, interactive dialogue games, and contextual vocabulary acquisition.',
        pedagogyNotes: 'Multimodal storytelling to reinforce listening and expressive speech.'
      }
    ],
    researchStrands: [
      {
        strand: 'Reading & Phonics',
        subStrand: 'Consonant blends /bl/ and /cl/ in decodable sentences',
        specificLearningOutcomes: 'By end of lesson, learner can: 1. Identify sound patterns /bl/ and /cl/ in printed words. 2. Blend sounds to read 6 unfamiliar words. 3. Read aloud with fluency.',
        keyInquiryQuestions: 'What sound do we hear when letters b and l join together at the start of a word?',
        learningProcess: 'Teacher demonstrates mouth positioning; learners mirror sounds with finger-tapping phoneme cards. In pairs, learners read decodable micro-stories.',
        suggestedWorkPlanned: 'Phonics decoding of /bl/ (black, blow, blanket) and /cl/ (clap, clean, cloud) in sentence contexts.',
        suggestedWorkCovered: 'Learners read decodable text "The Clean Black Blanket"; achieved 88% word recognition fluency on spot-check.',
        commonChallenges: 'Inserting an extra vowel sound between consonants (e.g. pronouncing "b-e-lack").',
        evidenceBasedRemedialAction: 'Rapid phoneme sliding finger gesture across letter cards to enforce smooth blending.',
        onlineResearchSource: 'Kenya National Tusome Benchmark Guide & Oxford Owl Early Phonics Corpus'
      },
      {
        strand: 'Listening and Speaking',
        subStrand: 'Polite requests and responsive greetings in social contexts',
        specificLearningOutcomes: 'By end of lesson, learner can: 1. Use "Please", "Excuse me", and "Thank you" in role play. 2. Listen attentively to peer dialogue. 3. Display courtesy.',
        keyInquiryQuestions: 'Why are polite words important when we need help in school or at home?',
        learningProcess: 'Learners conduct mini drama role plays: borrowing a pencil, asking for water, and expressing gratitude.',
        suggestedWorkPlanned: 'Role-play dialogues using polite expressions in classroom and home scenarios.',
        suggestedWorkCovered: 'All learners participated in three structured social role-plays; demonstrated polite vocabulary naturally.',
        commonChallenges: 'Shy pupils hesitant to speak aloud in front of peers.',
        evidenceBasedRemedialAction: 'Paired whispering practice followed by small table presentation before whole-class sharing.',
        onlineResearchSource: 'KICD Early Language Framework KEC-ENG-03 & Tusome Oral Language Protocols'
      }
    ]
  },

  {
    subject: 'Kiswahili Language Activities',
    gradeTier: 'lower',
    applicableGrades: ['Grade 1', 'Grade 2', 'Grade 3'],
    curriculumDesignRef: 'KICD/CURR/DES/L-PRI/KIS-03',
    description: 'Kusikiliza na kuongea, kusoma silabi na maneno, msamiati wa mazingira, na kuandika sentensi sahili.',
    onlineResearchPortals: [
      {
        title: 'Maktaba ya Dijitali ya KICD - Kiswahili Gredi 1-3',
        organization: 'Taasisi ya Ukuzaji Mtaala Kenya (KICD)',
        url: 'https://kec.ac.ke/kiswahili-msingi',
        focus: 'Utambuzi wa sauti za herufi, silabi, na hadithi fupi za kusikiliza.',
        pedagogyNotes: 'Mbinu shirikishi ya ufundishaji wa kusoma kwa kutumia michoro na vitendo halisi.'
      },
      {
        title: 'Tusome Kiswahili Early Literacy Repository',
        organization: 'Wizara ya Elimu Kenya',
        url: 'https://tusome.education.go.ke/kiswahili',
        focus: 'Kusoma kwa ufasaha, utambuzi wa sarufi ya ngeli msingi, na msamiati wa nyumbani.',
        pedagogyNotes: 'Mpangilio wa sauti, silabi, neno, sentensi (S-S-N-S).'
      }
    ],
    researchStrands: [
      {
        strand: 'Kusoma',
        subStrand: 'Kuunda na kusoma maneno yenye silabi za sauti tata /ch/ na /sh/',
        specificLearningOutcomes: 'Kufikia mwisho wa somo, mwanafunzi aweze: 1. Kutofautisha sauti /ch/ na /sh/. 2. Kusoma maneno kama "chaki", "chakula", "shule", "shati". 3. Kuthamini lugha ya Kiswahili.',
        keyInquiryQuestions: 'Tunawezaje kutofautisha sauti za maneno "chaki" na "shati" tunaposoma?',
        learningProcess: 'Wanafunzi wanasikiliza na kuimba wimbo wa sauti za silabi. Wanapanga kadi za silabi mezani (cha-ki, sha-ti) na kusoma kwa sauti.',
        suggestedWorkPlanned: 'Kusoma silabi na maneno yenye sauti /ch/ na /sh/ katika vitabu vya kiada.',
        suggestedWorkCovered: 'Wanafunzi wote 34 walisoma maneno 12 kwa ufasaha; walinakili sentensi 4 kwenye madaftari yao.',
        commonChallenges: 'Kuchanganya matamshi ya sauti /sh/ na /s/ kwa baadhi ya wanafunzi.',
        evidenceBasedRemedialAction: 'Mwalimu kuonyesha jinsi mdomo unavyosogezwa mbele kwa sauti /sh/ na kuweka kidole mbele ya mdomo.',
        onlineResearchSource: 'KICD Mwongozo wa Mtaala wa Kiswahili Gredi 2 & Mpango wa Kitaifa wa Tusome'
      }
    ]
  },

  {
    subject: 'Environmental Activities',
    gradeTier: 'lower',
    applicableGrades: ['Grade 1', 'Grade 2', 'Grade 3'],
    curriculumDesignRef: 'KICD/CURR/DES/L-PRI/ENV-04',
    description: 'Integrated early enquiry combining social environment, living things, weather, safety, hygiene, and sustainable care. (Serves as the foundational bridge before Science and Social Studies diverge in Grade 4).',
    onlineResearchPortals: [
      {
        title: 'UNESCO Early Childhood Education for Sustainable Development',
        organization: 'UNESCO Education Sector',
        url: 'https://en.unesco.org/themes/education-sustainable-development',
        focus: 'Nature walks, waste recycling, clean water hygiene, and community conservation.',
        pedagogyNotes: 'Experiential place-based learning in the immediate school compound and local community.'
      },
      {
        title: 'NEMA Kenya Schools Green Horizon Portal',
        organization: 'National Environment Management Authority Kenya',
        url: 'https://nema.go.ke/junior-environmentalists',
        focus: 'Tree planting, weather chart recording, soil conservation, and clean water preservation.',
        pedagogyNotes: 'Direct observation, daily weather recording tables, and sensory exploration.'
      }
    ],
    researchStrands: [
      {
        strand: 'Our Environment & Weather',
        subStrand: 'Observing and recording daily weather conditions using symbols',
        specificLearningOutcomes: 'By end of lesson, learner can: 1. Identify four types of weather (sunny, rainy, windy, cloudy). 2. Draw weather symbols on a weekly chart. 3. Care for personal clothing suitable for weather.',
        keyInquiryQuestions: 'How does weather change what we wear and the activities we do outside?',
        learningProcess: 'Learners go outdoors for 5 minutes, observe cloud cover, wind direction (using improvised ribbon), and record findings on class weather chart.',
        suggestedWorkPlanned: 'Observing weather elements outdoors and recording daily indicators on classroom weather board.',
        suggestedWorkCovered: 'Outdoor observation conducted safely; learners drew sunny/cloudy weather symbols and matched clothing items.',
        commonChallenges: 'Differentiating between a windy day and a stormy/rainy day.',
        evidenceBasedRemedialAction: 'Constructed simple paper pinwheels to visually test and measure wind intensity on calm vs windy days.',
        onlineResearchSource: 'NEMA Kenya Junior Ecology & KICD Environmental Activities Design G1-ENV-02'
      },
      {
        strand: 'Hygiene and Nutrition',
        subStrand: 'Proper handwashing steps using running clean water and soap',
        specificLearningOutcomes: 'By end of lesson, learner can: 1. Demonstrate the 7 steps of handwashing. 2. Explain why soap removes unseen germs. 3. Promote hygiene habits at home.',
        keyInquiryQuestions: 'Why is washing hands with plain water not enough to stop illnesses?',
        learningProcess: 'Glitter or flour simulation on hands to demonstrate how "germs" transfer; learners practice 7-step handwashing at school water taps.',
        suggestedWorkPlanned: 'Demonstration and practice of 7-step handwashing with running water and soap.',
        suggestedWorkCovered: 'All learners executed 7-step handwashing technique; composed short reminder rhyme.',
        commonChallenges: 'Leaving water taps running unnecessarily during lathering.',
        evidenceBasedRemedialAction: 'Introduced tippy-tap water conservation technique to prevent clean water wastage.',
        onlineResearchSource: 'WHO/UNICEF WASH in Schools Curriculum & KICD Health Education Modules'
      }
    ]
  },

  {
    subject: 'Creative Activities',
    gradeTier: 'lower',
    applicableGrades: ['Grade 1', 'Grade 2', 'Grade 3'],
    curriculumDesignRef: 'KICD/CURR/DES/L-PRI/CRE-05',
    description: 'Imaginative expression, indigenous music, rhythm, collage, modeling with clay, and motor coordination.',
    onlineResearchPortals: [
      {
        title: 'Kenya Music Festival (KMF) Indigenous Arts Archive',
        organization: 'Ministry of Education Kenya',
        url: 'https://kicd.ac.ke/creative-arts',
        focus: 'Folk songs, singing games, body percussion, and improvised rhythmic instruments.',
        pedagogyNotes: 'Dalcroze Eurhythmics and Orff Schulwerk active music-making methodology.'
      }
    ],
    researchStrands: [
      {
        strand: 'Art & Craft',
        subStrand: 'Collage making using natural materials (leaves, sand, seeds)',
        specificLearningOutcomes: 'By end of lesson, learner can: 1. Collect natural fallen leaves and seeds without destroying plants. 2. Glue materials to create a bird or fish collage. 3. Express pride in creative work.',
        keyInquiryQuestions: 'How can fallen leaves and waste materials become artwork instead of trash?',
        learningProcess: 'Learners collect dry fallen leaves in school compound, sort by colors, sketch animal outline, and paste carefully.',
        suggestedWorkPlanned: 'Designing textured animal collages using locally gathered fallen leaves and seeds.',
        suggestedWorkCovered: 'Class gallery walk completed; 30 collages mounted on wall display boards with individual titles.',
        commonChallenges: 'Using excessive liquid glue causing paper tearing.',
        evidenceBasedRemedialAction: 'Demonstrated cotton bud applicator method to control glue dots precisely.',
        onlineResearchSource: 'National Museums of Kenya Heritage Arts & KICD Creative Activities Design'
      }
    ]
  },

  {
    subject: 'Religious Education Activities',
    gradeTier: 'lower',
    applicableGrades: ['Grade 1', 'Grade 2', 'Grade 3'],
    curriculumDesignRef: 'KICD/CURR/DES/L-PRI/CRE-06',
    description: 'Moral values, gratitude, sharing, respecting parents and teachers, and biblical/moral narratives.',
    onlineResearchPortals: [
      {
        title: 'Kenya Bible Society & KICD Christian Religious Education',
        organization: 'Bible Society of Kenya / KICD CRE Panel',
        url: 'https://kec.ac.ke/religious-education',
        focus: 'Moral reasoning, community service, gratitude, and storytelling.',
        pedagogyNotes: 'Narrative empathy and values clarification through guided discussion.'
      }
    ],
    researchStrands: [
      {
        strand: 'Creation and Sharing',
        subStrand: 'Sharing resources and kindness in the classroom family',
        specificLearningOutcomes: 'By end of lesson, learner can: 1. Give examples of sharing with classmates. 2. Relate the story of the boy with 5 loaves and 2 fish. 3. Practice unconditional kindness.',
        keyInquiryQuestions: 'What happens when we choose to share what we have with someone who has none?',
        learningProcess: 'Storytelling circle followed by small group sharing of color pencils to complete a collective poster.',
        suggestedWorkPlanned: 'Discussion of biblical narrative on sharing and practical application during art exercises.',
        suggestedWorkCovered: 'Learners illustrated acts of kindness; 100% engaged in cooperative sharing session.',
        commonChallenges: 'Reluctance by some learners to lend favorite stationery.',
        evidenceBasedRemedialAction: 'Created a classroom "Kindness Jar" where positive peer sharing is celebrated daily.',
        onlineResearchSource: 'KICD CRE Curriculum Design G2-CRE-01 & Character Education Research'
      }
    ]
  },

  // =========================================================================
  // UPPER PRIMARY (GRADES 4 - 6): 8 BROAD LEARNING AREAS
  // NOTE: Social Studies and Science & Tech START here in Grade 4
  // =========================================================================
  {
    subject: 'Social Studies',
    gradeTier: 'upper',
    applicableGrades: ['Grade 4', 'Grade 5', 'Grade 6'],
    curriculumDesignRef: 'KICD/CURR/DES/U-PRI/SS-06',
    description: 'Kenya regional geography, county governance, historical heroes, citizenship, economic activities, and environmental conservation. (Starts in Grade 4; strictly absent in Grades 1 to 3).',
    onlineResearchPortals: [
      {
        title: 'Kenya National Archives & KICD Social Studies Portal',
        organization: 'Kenya National Archives & Documentation Service / KICD',
        url: 'https://kec.ac.ke/upper/social-studies',
        focus: 'Kenya county maps, trade routes, freedom fighters, and cultural heritage.',
        pedagogyNotes: 'Inquiry-based historical documents analysis and map-work cartography.'
      },
      {
        title: 'Kenya National Bureau of Statistics (KNBS) Junior Census Hub',
        organization: 'KNBS Kenya',
        url: 'https://knbs.or.ke/education-resources',
        focus: 'Population density, county administrative boundaries, physical features, and climate zones.',
        pedagogyNotes: 'Data literacy, map scale reading, and cardinal compass direction navigation.'
      }
    ],
    researchStrands: [
      {
        strand: 'Physical Environment',
        subStrand: 'Relief features and drainage systems of our county and country',
        specificLearningOutcomes: 'By end of lesson, learner can: 1. Identify major mountains, plateaus, and rivers in Kenya. 2. Read physical features using contour and relief maps. 3. Value conservation of river basins.',
        keyInquiryQuestions: 'How do physical features like mountains and rivers influence settlement and agriculture in Kenya?',
        learningProcess: 'Learners study relief atlas maps of the Great Rift Valley, trace river courses (Tana, Athi, Nyando), and sketch cross-sections in study notebooks.',
        suggestedWorkPlanned: 'Identification of major relief and drainage features on Kenyan physical wall map and atlas.',
        suggestedWorkCovered: 'Learners mapped 5 drainage basins on outline maps of Kenya; correctly annotated elevation zones.',
        commonChallenges: 'Confusing tributaries with distributaries on river delta maps.',
        evidenceBasedRemedialAction: 'Drew river tree branch analogy on chalkboard with arrows indicating downhill flow direction.',
        onlineResearchSource: 'KNBS Kenya Geographical Atlas & KICD Social Studies Curriculum Design G5-SS-02'
      },
      {
        strand: 'Governance & Citizenship',
        subStrand: 'Structure and functions of County Government in Kenya',
        specificLearningOutcomes: 'By end of lesson, learner can: 1. Outline roles of County Governor and County Assembly. 2. Explain how citizens participate in public barazas. 3. Demonstrate democratic respect.',
        keyInquiryQuestions: 'How does devolution bring government services closer to the people in our county?',
        learningProcess: 'Mock County Assembly session where learners act as Members of County Assembly (MCAs) debating a community health clinic bill.',
        suggestedWorkPlanned: 'Study of devolved governance structure in Kenya under the 2010 Constitution.',
        suggestedWorkCovered: 'Mock legislative debate conducted; learners identified 4 devolved sectors (health, agriculture, county roads).',
        commonChallenges: 'Differentiating national government roles (e.g. security) from devolved county roles (e.g. clinics).',
        evidenceBasedRemedialAction: 'Two-column sorting card game: National Security vs County Agriculture/Early Childhood.',
        onlineResearchSource: 'Constitution of Kenya Devolution Guide & KICD Social Studies Design G6-SS-04'
      }
    ]
  },

  {
    subject: 'Science and Technology',
    gradeTier: 'upper',
    applicableGrades: ['Grade 4', 'Grade 5', 'Grade 6'],
    curriculumDesignRef: 'KICD/CURR/DES/U-PRI/SCI-04',
    description: 'Living things, digital computing devices, energy, matter, human organ systems, and scientific inquiry experimentation.',
    onlineResearchPortals: [
      {
        title: 'PhET Interactive Science Simulations (Elementary STEM)',
        organization: 'University of Colorado Boulder',
        url: 'https://phet.colorado.edu',
        focus: 'Circuit construction, states of matter, light refraction, and digestive system models.',
        pedagogyNotes: 'Interactive visual simulations that make invisible microscopic and energy concepts visible.'
      },
      {
        title: 'STEM Kenya & KICD Digital Literacy Repository',
        organization: 'Centre for Mathematics, Science & Technology Education in Africa (CEMASTEA)',
        url: 'https://cemastea.ac.ke',
        focus: 'ASEI-PDSI (Activity, Student-centred, Experiment, Improvisation - Plan, Do, See, Improve) teaching approach.',
        pedagogyNotes: 'Improvisation of laboratory apparatus using safe everyday materials.'
      }
    ],
    researchStrands: [
      {
        strand: 'Human Body Systems',
        subStrand: 'Structure and functions of the Human Circulatory and Respiratory Systems',
        specificLearningOutcomes: 'By end of lesson, learner can: 1. Identify the 4 chambers of the heart. 2. Trace blood flow through pulmonary and systemic loops. 3. Value physical exercise for cardiovascular health.',
        keyInquiryQuestions: 'How does blood deliver oxygen from our lungs to all muscles in our body?',
        learningProcess: 'Learners build a simple working heart model using plastic bottles, straws, and red water to demonstrate one-way pumping valve action.',
        suggestedWorkPlanned: 'Examination of human heart cross-section model and demonstration of valve mechanisms.',
        suggestedWorkCovered: 'Heart pumping model demonstrated; learners labeled cross-section diagrams and measured pulse rates before and after skipping.',
        commonChallenges: 'Understanding why blood in the right side of the heart is deoxygenated while the left is oxygenated.',
        evidenceBasedRemedialAction: 'Color-coded pathway diagrams (blue chalk for deoxygenated, red for oxygenated blood).',
        onlineResearchSource: 'PhET Circulatory Simulation / CEMASTEA Upper Primary STEM Module G6-SCI-01'
      }
    ]
  },

  {
    subject: 'Agriculture and Nutrition',
    gradeTier: 'upper',
    applicableGrades: ['Grade 4', 'Grade 5', 'Grade 6'],
    curriculumDesignRef: 'KICD/CURR/DES/U-PRI/AGR-05',
    description: 'Crop establishment, organic manure composting, domestic animal care, food preservation, and balanced nutrition.',
    onlineResearchPortals: [
      {
        title: 'KALRO Junior Agricultural Knowledge Hub',
        organization: 'Kenya Agricultural & Livestock Research Organization (KALRO)',
        url: 'https://kalro.org/junior-farming',
        focus: 'Kitchen gardening, drip irrigation, sack gardening, and soil fertility management.',
        pedagogyNotes: 'School farm practical inquiry and hands-on agricultural enterprise projects.'
      }
    ],
    researchStrands: [
      {
        strand: 'Crop Production & Soil Conservation',
        subStrand: 'Preparation and maintenance of an organic compost heap',
        specificLearningOutcomes: 'By end of lesson, learner can: 1. Identify organic materials suitable for composting. 2. Layer dry matter, green matter, and manure. 3. Demonstrate environmental responsibility.',
        keyInquiryQuestions: 'How can vegetable scraps and dry weeds be converted into rich plant food without chemical fertilizers?',
        learningProcess: 'Learners assemble in school agricultural plot, dig a shallow compost pit, add twigs for drainage, layer green grass and dry maize stalks, sprinkle topsoil and water.',
        suggestedWorkPlanned: 'Constructing a multi-layered compost heap in the school agricultural demo plot.',
        suggestedWorkCovered: 'Compost pit fully layered with drainage twigs, green matter, ash, and soil; temperature stick inserted.',
        commonChallenges: 'Over-watering compost causing foul smell and anaerobic decomposition.',
        evidenceBasedRemedialAction: 'Taught the "fist squeeze test" to gauge optimal moisture (like a damp wrung-out sponge).',
        onlineResearchSource: 'KALRO School Farming Guidelines & FAO Junior Farmer Field Schools'
      }
    ]
  },

  {
    subject: 'Creative Arts',
    gradeTier: 'upper',
    applicableGrades: ['Grade 4', 'Grade 5', 'Grade 6'],
    curriculumDesignRef: 'KICD/CURR/DES/U-PRI/CA-07',
    description: 'Integrated creative arts combining visual arts, crafts, indigenous Kenyan music instruments, performing arts, and physical education.',
    onlineResearchPortals: [
      {
        title: 'Kenya National Drama and Film Festival & KICD Arts',
        organization: 'Ministry of Education Kenya',
        url: 'https://kicd.ac.ke/creative-arts-sports',
        focus: 'Traditional Kenyan instruments (Nyatiti, Isukuti, Wandindi), pottery, weaving, and puppetry.',
        pedagogyNotes: 'Preservation of indigenous Kenyan cultural traditions through practical fabrication and performance.'
      }
    ],
    researchStrands: [
      {
        strand: 'Visual & Applied Arts',
        subStrand: 'Clay sculpture and coil pottery techniques with indigenous motifs',
        specificLearningOutcomes: 'By end of lesson, learner can: 1. Knead clay to remove air bubbles. 2. Form pots using coil method. 3. Decorate surfaces using incised geometric patterns.',
        keyInquiryQuestions: 'How did traditional Kenyan potters build strong clay vessels without modern machinery?',
        learningProcess: 'Learners knead local clay, roll uniform clay snakes/coils, build cylindrical pots on flat clay bases, smooth seams with wet gourds, and incise traditional patterns.',
        suggestedWorkPlanned: 'Fabrication of coiled clay pottery and traditional surface decoration.',
        suggestedWorkCovered: 'All learners molded clay vessels; air-drying rack set up in art corner; 100% completed.',
        commonChallenges: 'Clay cracking during drying due to uneven coil thickness or trapped air bubbles.',
        evidenceBasedRemedialAction: 'Guided 5-minute pre-kneading exercise to eliminate air pockets; placed damp cloth over pots for slow uniform drying.',
        onlineResearchSource: 'National Museums of Kenya Pottery Archive & KICD Creative Arts Design G5-CA-03'
      }
    ]
  }
];

// Helper to look up profile by subject name
export function getSubjectResearchProfile(subject: string): CBESubjectResearchProfile | undefined {
  return CBE_ONLINE_RESEARCH_DATABASE.find(
    p => p.subject.toLowerCase() === subject.toLowerCase() ||
         subject.toLowerCase().includes(p.subject.toLowerCase())
  );
}

// Helper to get subjects by tier
export function getSubjectsForTier(tier: 'lower' | 'upper'): CBESubjectResearchProfile[] {
  return CBE_ONLINE_RESEARCH_DATABASE.filter(p => p.gradeTier === tier || p.gradeTier === 'both');
}
