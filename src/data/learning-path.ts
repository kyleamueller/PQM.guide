// The ordered Start Here path shown on /learn.
export const learningPath = [
  {
    step: 1,
    href: "/concepts/getting-started",
    title: "Getting Started with M Code",
    description:
      "Find the M code that Power Query has been generating behind the UI all along. Learn to open the Advanced Editor, read a generated query, and make your first hand edit.",
    time: "8 min",
  },
  {
    step: 2,
    href: "/concepts/ui-to-m-bridge",
    title: "From the UI to M Code",
    description:
      "A translation guide: the ten most common Power Query UI operations — filter rows, add column, merge queries, group by — and the exact M code each one generates.",
    time: "12 min",
  },
  {
    step: 3,
    href: "/concepts/m-paradigm",
    title: "The M Paradigm",
    description:
      "Now that you've seen M code in the wild, understand what kind of language it is. M is functional, immutable, and lazy — three properties that explain most of its surprising behaviors.",
    time: "10 min",
  },
  {
    step: 4,
    href: "/concepts/let-in-expressions",
    title: "let/in Expressions",
    description:
      "The let/in block is M's fundamental building block. Every query you write is a let expression. Learn how named steps compose into a pipeline and why step order isn't execution order.",
    time: "8 min",
  },
  {
    step: 5,
    href: "/concepts/structured-data",
    title: "Records, Lists & Tables",
    description:
      "M has three container types: records (rows), lists (columns), and tables (grids). Understanding how they relate to each other is the key to reading and writing most M code.",
    time: "10 min",
  },
  {
    step: 6,
    href: "/concepts/each-keyword",
    title: "The each Keyword",
    description:
      "each is shorthand for a single-argument function. It appears in every Table.AddColumn, Table.SelectRows, and List.Transform call. Understanding it unlocks the whole standard library.",
    time: "8 min",
  },
  {
    step: 7,
    href: "/concepts/type-system",
    title: "The Type System",
    description:
      "M is strongly typed. Learn the primitive types, how nullable types work, and why type annotations on Table.AddColumn matter for performance.",
    time: "10 min",
  },
  {
    step: 8,
    href: "/concepts/null-handling",
    title: "Null Handling",
    description:
      "Null propagates silently through M expressions. Learn how null flows through comparisons, arithmetic, and function calls — and how to defend against it with the ?? operator.",
    time: "8 min",
  },
  {
    step: 9,
    href: "/concepts/control-structures",
    title: "Control Structures",
    description:
      "if/then/else, logical operators, and how conditional logic works in a language where everything is an expression. The building block for conditional columns and branching transformations.",
    time: "8 min",
  },
  {
    step: 10,
    href: "/concepts/error-handling",
    title: "Error Handling",
    description:
      "Errors in M are values, not exceptions. Learn try/otherwise, how to catch errors cell-by-cell in a table, and when to let errors propagate versus recover from them.",
    time: "10 min",
  },
];
