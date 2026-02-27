import { Category } from "@/lib/types";

export const categories: Category[] = [
  { slug: "accessing-data", name: "Accessing Data", description: "Functions for connecting to and reading from data sources." },
  { slug: "binary", name: "Binary", description: "Functions for working with binary data." },
  { slug: "combiner", name: "Combiner", description: "Functions that combine multiple values into a single value." },
  { slug: "comparer", name: "Comparer", description: "Functions for comparing values with customizable comparison logic." },
  { slug: "date", name: "Date", description: "Functions for creating, manipulating, and extracting parts of date values." },
  { slug: "datetime", name: "DateTime", description: "Functions for working with combined date and time values." },
  { slug: "datetimezone", name: "DateTimeZone", description: "Functions for date/time values with timezone information." },
  { slug: "duration", name: "Duration", description: "Functions for working with time duration values." },
  { slug: "error-handling", name: "Error Handling", description: "Functions for handling and recovering from errors." },
  { slug: "expression", name: "Expression", description: "Functions for evaluating and working with expressions." },
  { slug: "function", name: "Function", description: "Functions for working with function values." },
  { slug: "lines", name: "Lines", description: "Functions for converting text to and from lists of lines." },
  { slug: "list", name: "List", description: "Functions for creating, manipulating, and transforming lists." },
  { slug: "logical", name: "Logical", description: "Functions for logical (boolean) operations." },
  { slug: "number", name: "Number", description: "Functions for numeric calculations, conversions, and formatting." },
  { slug: "record", name: "Record", description: "Functions for creating, accessing, and transforming records." },
  { slug: "replacer", name: "Replacer", description: "Functions used as replacer arguments in other functions." },
  { slug: "splitter", name: "Splitter", description: "Functions used to split text values." },
  { slug: "table", name: "Table", description: "Functions for creating, transforming, and querying tables." },
  { slug: "text", name: "Text", description: "Functions for working with text (string) values." },
  { slug: "time", name: "Time", description: "Functions for creating and manipulating time values." },
  { slug: "type", name: "Type", description: "Functions for working with the M type system." },
  { slug: "uri", name: "URI", description: "Functions for encoding and decoding URI components." },
  { slug: "value", name: "Value", description: "Functions for inspecting and comparing values of any type." },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
