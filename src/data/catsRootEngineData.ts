import { CATSRootEngine, CBCRating } from '../types';

export const INITIAL_CATS_ROOT_ENGINE: CATSRootEngine = {
  module_description: "Global CBE Evaluation Module for Primary Level",
  classes: [
    {
      class_level: "Grade 1",
      subjects: [
        {
          subject_name: "Mathematical Activities",
          strands: [
            {
              strand_name: "1.0 Numbers",
              sub_strands: [
                {
                  sub_strand_name: "1.1 Number Concept & Counting",
                  cat_score: 0.0,
                  max_score: 100.0,
                  status: "NOT_ATTEMPTED",
                  cat_content: {
                    instructions: "Count the items and choose the correct answer.",
                    questions: [
                      {
                        q_id: 1,
                        question: "Count the dots: ●●●●",
                        options: ["3", "4", "5", "6"],
                        correct_answer: "4",
                        score: 0.0,
                        explanation: "There are four dots in the group: 1, 2, 3, 4."
                      },
                      {
                        q_id: 2,
                        question: "Which number comes directly after 7?",
                        options: ["6", "8", "9", "5"],
                        correct_answer: "8",
                        score: 0.0,
                        explanation: "In natural order: 6, 7, 8."
                      },
                      {
                        q_id: 3,
                        question: "Count the stars: ★★★★★",
                        options: ["4", "5", "6", "7"],
                        correct_answer: "5",
                        score: 0.0,
                        explanation: "There are exactly 5 stars."
                      },
                      {
                        q_id: 4,
                        question: "Which number is smaller: 3 or 9?",
                        options: ["3", "9", "Both are equal", "None"],
                        correct_answer: "3",
                        score: 0.0,
                        explanation: "3 is less than 9."
                      },
                      {
                        q_id: 5,
                        question: "What is 2 plus 3?",
                        options: ["4", "5", "6", "7"],
                        correct_answer: "5",
                        score: 0.0,
                        explanation: "2 + 3 = 5."
                      }
                    ]
                  }
                }
              ]
            }
          ]
        },
        {
          subject_name: "Environmental Activities",
          strands: [
            {
              strand_name: "1.0 Social Environment",
              sub_strands: [
                {
                  sub_strand_name: "1.1 Myself and My Body",
                  cat_score: 0.0,
                  max_score: 100.0,
                  status: "NOT_ATTEMPTED",
                  cat_content: {
                    instructions: "Answer basic questions about personal health and body parts.",
                    questions: [
                      {
                        q_id: 1,
                        question: "We use our eyes to _____.",
                        options: ["hear", "see", "smell", "taste"],
                        correct_answer: "see",
                        score: 0.0,
                        explanation: "Our eyes are the sense organs for sight."
                      },
                      {
                        q_id: 2,
                        question: "We wash our hands with clean water and _____.",
                        options: ["sand", "soap", "oil", "soil"],
                        correct_answer: "soap",
                        score: 0.0,
                        explanation: "Soap kills germs when washing hands."
                      },
                      {
                        q_id: 3,
                        question: "Which body part is used for listening to music?",
                        options: ["Nose", "Ears", "Tongue", "Skin"],
                        correct_answer: "Ears",
                        score: 0.0,
                        explanation: "Ears are the sense organs for hearing."
                      },
                      {
                        q_id: 4,
                        question: "How many fingers do we have on one hand?",
                        options: ["4", "5", "6", "10"],
                        correct_answer: "5",
                        score: 0.0,
                        explanation: "Each normal human hand has five fingers."
                      }
                    ]
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      class_level: "Grade 2",
      subjects: [
        {
          subject_name: "English Language Activities",
          strands: [
            {
              strand_name: "1.0 Reading & Phonics",
              sub_strands: [
                {
                  sub_strand_name: "1.1 Two and Three Letter Words",
                  cat_score: 0.0,
                  max_score: 100.0,
                  status: "NOT_ATTEMPTED",
                  cat_content: {
                    instructions: "Select the correctly spelled word.",
                    questions: [
                      {
                        q_id: 1,
                        question: "Which word names a pet animal?",
                        options: ["Cat", "Cut", "Cot", "Car"],
                        correct_answer: "Cat",
                        score: 0.0,
                        explanation: "A cat is a common domestic pet animal."
                      },
                      {
                        q_id: 2,
                        question: "Complete the rhyming word: Hen, Pen, _____.",
                        options: ["Ten", "Tin", "Tan", "Tub"],
                        correct_answer: "Ten",
                        score: 0.0,
                        explanation: "Hen, Pen, and Ten share the '-en' sound."
                      },
                      {
                        q_id: 3,
                        question: "Which word is an action word (verb)?",
                        options: ["Run", "Red", "Rat", "Rug"],
                        correct_answer: "Run",
                        score: 0.0,
                        explanation: "'Run' describes an action."
                      },
                      {
                        q_id: 4,
                        question: "Choose the correct spelling:",
                        options: ["Sun", "Snn", "Snu", "Soun"],
                        correct_answer: "Sun",
                        score: 0.0,
                        explanation: "The heavenly body is spelled 'Sun'."
                      }
                    ]
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      class_level: "Grade 3",
      subjects: [
        {
          subject_name: "Creative Activities",
          strands: [
            {
              strand_name: "1.0 Visual Arts",
              sub_strands: [
                {
                  sub_strand_name: "1.1 Modeling with Clay",
                  cat_score: 0.0,
                  max_score: 100.0,
                  status: "NOT_ATTEMPTED",
                  cat_content: {
                    instructions: "Practical and theory evaluation on modeling.",
                    questions: [
                      {
                        q_id: 1,
                        question: "What liquid do we add to soil to make modeling clay?",
                        options: ["Water", "Oil", "Milk", "Kerosene"],
                        correct_answer: "Water",
                        score: 0.0,
                        explanation: "Water is added to clay soil to give it plasticity for molding."
                      },
                      {
                        q_id: 2,
                        question: "Which type of soil is most suitable for modeling pots?",
                        options: ["Sandy soil", "Clay soil", "Loam soil", "Gravel"],
                        correct_answer: "Clay soil",
                        score: 0.0,
                        explanation: "Clay soil has fine particles that stick together firmly."
                      },
                      {
                        q_id: 3,
                        question: "The process of kneading clay with hands before modeling is called _____.",
                        options: ["Wedging", "Painting", "Glazing", "Carving"],
                        correct_answer: "Wedging",
                        score: 0.0,
                        explanation: "Wedging removes trapped air bubbles from the clay."
                      },
                      {
                        q_id: 4,
                        question: "Where should freshly modeled clay items be dried to prevent cracking?",
                        options: ["Under direct hot sun", "In the shade", "Inside water", "In the freezer"],
                        correct_answer: "In the shade",
                        score: 0.0,
                        explanation: "Drying in the shade allows slow, uniform moisture loss without cracking."
                      }
                    ]
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      class_level: "Grade 4",
      subjects: [
        {
          subject_name: "Science and Technology",
          strands: [
            {
              strand_name: "1.0 Living Things",
              sub_strands: [
                {
                  sub_strand_name: "1.1 Human Teeth and Care",
                  cat_score: 0.0,
                  max_score: 100.0,
                  status: "NOT_ATTEMPTED",
                  cat_content: {
                    instructions: "Answer questions on types of teeth and hygiene.",
                    questions: [
                      {
                        q_id: 1,
                        question: "Which type of teeth is used for biting and cutting food?",
                        options: ["Incisors", "Canines", "Premolars", "Molars"],
                        correct_answer: "Incisors",
                        score: 0.0,
                        explanation: "Incisors are sharp chisel-shaped front teeth for biting and cutting."
                      },
                      {
                        q_id: 2,
                        question: "Which teeth are pointed and used for tearing meat or tough food?",
                        options: ["Canines", "Incisors", "Premolars", "Molars"],
                        correct_answer: "Canines",
                        score: 0.0,
                        explanation: "Canines have sharp pointed cusps specialized for tearing."
                      },
                      {
                        q_id: 3,
                        question: "Tooth decay (dental caries) is mainly caused by _____.",
                        options: ["Sugary foods and bacteria", "Drinking pure water", "Eating green vegetables", "Chewing carrots"],
                        correct_answer: "Sugary foods and bacteria",
                        score: 0.0,
                        explanation: "Bacteria feed on sugars producing acids that erode tooth enamel."
                      },
                      {
                        q_id: 4,
                        question: "How many milk (deciduous) teeth does a child have in a complete set?",
                        options: ["20", "28", "32", "16"],
                        correct_answer: "20",
                        score: 0.0,
                        explanation: "A complete set of primary (milk) teeth consists of 20 teeth."
                      }
                    ]
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      class_level: "Grade 5",
      subjects: [
        {
          subject_name: "Agriculture and Nutrition",
          strands: [
            {
              strand_name: "1.0 Agricultural Practices",
              sub_strands: [
                {
                  sub_strand_name: "1.1 Soil Conservation",
                  cat_score: 0.0,
                  max_score: 100.0,
                  status: "NOT_ATTEMPTED",
                  cat_content: {
                    instructions: "Soil erosion control assessment.",
                    questions: [
                      {
                        q_id: 1,
                        question: "Covering soil using dry plant materials to retain moisture is called _____.",
                        options: ["Mulching", "Weeding", "Pruning", "Tilling"],
                        correct_answer: "Mulching",
                        score: 0.0,
                        explanation: "Mulching preserves moisture, suppresses weeds, and reduces splash erosion."
                      },
                      {
                        q_id: 2,
                        question: "Which type of soil erosion creates deep, wide channels on sloped land?",
                        options: ["Gully erosion", "Splash erosion", "Sheet erosion", "Rill erosion"],
                        correct_answer: "Gully erosion",
                        score: 0.0,
                        explanation: "Gully erosion forms wide and deep trenches caused by high-volume runoff."
                      },
                      {
                        q_id: 3,
                        question: "Planting trees to restore a cleared forest area is called _____.",
                        options: ["Reforestation", "Deforestation", "Overgrazing", "Mono-cropping"],
                        correct_answer: "Reforestation",
                        score: 0.0,
                        explanation: "Reforestation re-establishes forest cover to bind soil."
                      },
                      {
                        q_id: 4,
                        question: "Stone lines and trash lines are constructed along _____ to slow down runoff.",
                        options: ["Contours", "Riverbeds", "Road centers", "Fences"],
                        correct_answer: "Contours",
                        score: 0.0,
                        explanation: "Contour bunds break the speed of water traveling down slopes."
                      }
                    ]
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      class_level: "Grade 6",
      subjects: [
        {
          subject_name: "Mathematics",
          strands: [
            {
              strand_name: "1.0 Numbers",
              sub_strands: [
                {
                  sub_strand_name: "1.1 Place Value and Whole Numbers",
                  cat_score: 0.0,
                  max_score: 100.0,
                  status: "NOT_ATTEMPTED",
                  cat_content: {
                    instructions: "Evaluate position values and arithmetic.",
                    questions: [
                      {
                        q_id: 1,
                        question: "What is the place value of 8 in 854,321?",
                        options: ["Hundred Thousands", "Ten Thousands", "Thousands", "Millions"],
                        correct_answer: "Hundred Thousands",
                        score: 0.0,
                        explanation: "Counting from right: ones (1), tens (2), hundreds (3), thousands (4), ten thousands (5), hundred thousands (8)."
                      },
                      {
                        q_id: 2,
                        question: "What is the total value of digit 5 in 854,321?",
                        options: ["50,000", "5,000", "500,000", "500"],
                        correct_answer: "50,000",
                        score: 0.0,
                        explanation: "The digit 5 is in the ten thousands position, so 5 × 10,000 = 50,000."
                      },
                      {
                        q_id: 3,
                        question: "Round off 47,865 to the nearest thousand:",
                        options: ["48,000", "47,000", "47,900", "50,000"],
                        correct_answer: "48,000",
                        score: 0.0,
                        explanation: "The hundreds digit is 8 (>= 5), so round thousands digit 7 up to 8: 48,000."
                      },
                      {
                        q_id: 4,
                        question: "Find the sum of the prime numbers between 10 and 20:",
                        options: ["60", "45", "52", "65"],
                        correct_answer: "60",
                        score: 0.0,
                        explanation: "The prime numbers between 10 and 20 are 11, 13, 17, and 19. 11 + 13 + 17 + 19 = 60."
                      }
                    ]
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// Helper function to evaluate score rating
export function getCBCRatingFromScore(score: number, maxScore: number = 100): { code: CBCRating; label: string; color: string; bg: string } {
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  if (percentage >= 80) {
    return { code: 'EE', label: 'Exceeding Expectations (Level 4)', color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-100 dark:bg-emerald-950/70 border-emerald-300' };
  } else if (percentage >= 65) {
    return { code: 'ME', label: 'Meeting Expectations (Level 3)', color: 'text-blue-700 dark:text-blue-300', bg: 'bg-blue-100 dark:bg-blue-950/70 border-blue-300' };
  } else if (percentage >= 50) {
    return { code: 'AE', label: 'Approaching Expectations (Level 2)', color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-100 dark:bg-amber-950/70 border-amber-300' };
  } else {
    return { code: 'BE', label: 'Below Expectations (Level 1)', color: 'text-rose-700 dark:text-rose-300', bg: 'bg-rose-100 dark:bg-rose-950/70 border-rose-300' };
  }
}
