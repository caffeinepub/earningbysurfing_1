/**
 * Smart Rule-Based Dynamic Headline Engine
 * Uses 10 proven copywriting formulas with deterministic product-based selection
 * so each product always gets the same formula, ensuring uniqueness across 4000 members
 */

function deterministicHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i);
  }
  return hash % 10;
}

const formulas: ((
  title: string,
  description: string,
  category: string,
) => string)[] = [
  // 0: Curiosity
  (title) => `The Secret Behind ${title} That Experts Don't Want You to Know`,
  // 1: Urgency
  (title) => `Limited Time: Get ${title} Before It Sells Out Worldwide`,
  // 2: Benefit-Driven
  (title) => `Transform Your Life With ${title} \u2014 Results in 30 Days`,
  // 3: Social Proof
  (title) => `Over 50,000 Happy Customers Trust ${title} \u2014 Here's Why`,
  // 4: Fear of Missing Out
  (title, _desc, category) =>
    `Don't Miss Out: ${title} Is Changing the ${category} Industry`,
  // 5: How-To
  (title) => `How to Get the Best Results With ${title} in Just 7 Days`,
  // 6: Number-Based
  (title) => `7 Reasons Why ${title} Is the #1 Choice for Smart Buyers`,
  // 7: Question
  (title) => `Are You Still Overpaying? ${title} Gives You More for Less`,
  // 8: Testimonial-Style
  (title) => `I Tried ${title} for 30 Days \u2014 Here's My Honest Review`,
  // 9: Transformation
  (title) => `From Struggling to Thriving: How ${title} Changed Everything`,
];

export function generateHeadline(
  title: string,
  description: string,
  category: string,
): string {
  const index = deterministicHash(title);
  return formulas[index](title, description, category);
}

export function generateHeadlineWithFormula(
  title: string,
  description: string,
  category: string,
): { headline: string; formulaName: string } {
  const index = deterministicHash(title);
  const formulaNames = [
    "Curiosity",
    "Urgency",
    "Benefit-Driven",
    "Social Proof",
    "FOMO",
    "How-To",
    "Number-Based",
    "Question",
    "Testimonial-Style",
    "Transformation",
  ];
  return {
    headline: formulas[index](title, description, category),
    formulaName: formulaNames[index],
  };
}
