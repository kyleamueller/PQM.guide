import Prism from "prismjs";

Prism.languages.powerquery = {
  comment: [
    { pattern: /\/\/.*/, greedy: true },
    { pattern: /\/\*[\s\S]*?\*\//, greedy: true },
  ],
  "quoted-identifier": {
    pattern: /#"[^"]*"/,
    greedy: true,
    alias: "variable",
  },
  string: {
    pattern: /"(?:[^"\\]|\\.)*"/,
    greedy: true,
  },
  keyword:
    /\b(?:and|as|each|else|error|false|if|in|is|let|meta|not|null|or|otherwise|section|shared|then|true|try|type)\b/,
  type: /\b(?:any|anynonnull|binary|date|datetime|datetimezone|duration|function|list|logical|none|null|number|record|table|text|time|type|action)\b/,
  builtin:
    /\b(?:Table|List|Record|Text|Number|Date|DateTime|DateTimeZone|Time|Duration|Binary|Combiner|Comparer|Error|Expression|Function|Lines|Logical|Replacer|Splitter|Type|Uri|Value|Diagnostics|DirectQueryCapabilities|Embedded|Excel|Exchange|Hdfs|Identity|ItemExpression|Json|MQ|Mysql|Odbc|OleDb|Oracle|Pdf|PostgreSQL|RData|Sap|SharePoint|Sql|Sybase|Teradata|Web|Xml)\.[A-Z]\w*/,
  number: /\b(?:0x[\da-fA-F]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b/,
  operator: /=>|<>|\.\.\.?|[<>]=?|[+\-*/&=@!?]/,
  punctuation: /[()[\]{},;.]/,
  function: /\b[A-Z]\w*(?=\s*\()/,
};

Prism.languages.pq = Prism.languages.powerquery;
Prism.languages.m = Prism.languages.powerquery;
