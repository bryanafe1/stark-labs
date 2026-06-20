// ---------------------------------------------------------------------------
//  Safe arithmetic expression evaluator.
//
//  Recursive-descent parser for a small math grammar — used by interactive
//  lesson sandboxes so a formula can be stored as a plain string (DB-friendly,
//  serializable across the server/client boundary) and evaluated on the client
//  with user-supplied variable values. NO eval / Function — only the operators,
//  functions, and constants whitelisted below are reachable.
//
//  Grammar:
//    expr   := term (("+" | "-") term)*
//    term   := power (("*" | "/" | "%") power)*
//    power  := unary ("^" power)?        // right-associative
//    unary  := ("-" | "+") unary | atom
//    atom   := number | ident | ident "(" args ")" | "(" expr ")"
// ---------------------------------------------------------------------------

const FUNCS: Record<string, (...a: number[]) => number> = {
  sqrt: Math.sqrt,
  cbrt: Math.cbrt,
  abs: Math.abs,
  exp: Math.exp,
  ln: Math.log,
  log10: Math.log10,
  log: Math.log10,
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round,
  pow: (a, b) => Math.pow(a, b),
  min: (...a) => Math.min(...a),
  max: (...a) => Math.max(...a),
};

const CONSTS: Record<string, number> = {
  pi: Math.PI,
  tau: Math.PI * 2,
  e: Math.E,
};

export function evalExpr(input: string, scope: Record<string, number> = {}): number {
  let i = 0;

  const skipWs = () => {
    while (i < input.length && /\s/.test(input[i]!)) i++;
  };

  function parseExpr(): number {
    let value = parseTerm();
    for (;;) {
      skipWs();
      const op = input[i];
      if (op === "+" || op === "-") {
        i++;
        const rhs = parseTerm();
        value = op === "+" ? value + rhs : value - rhs;
      } else break;
    }
    return value;
  }

  function parseTerm(): number {
    let value = parsePower();
    for (;;) {
      skipWs();
      const op = input[i];
      if (op === "*" || op === "/" || op === "%") {
        i++;
        const rhs = parsePower();
        value = op === "*" ? value * rhs : op === "/" ? value / rhs : value % rhs;
      } else break;
    }
    return value;
  }

  function parsePower(): number {
    const base = parseUnary();
    skipWs();
    if (input[i] === "^") {
      i++;
      return Math.pow(base, parsePower()); // right-associative
    }
    return base;
  }

  function parseUnary(): number {
    skipWs();
    if (input[i] === "-") {
      i++;
      return -parseUnary();
    }
    if (input[i] === "+") {
      i++;
      return parseUnary();
    }
    return parseAtom();
  }

  function parseAtom(): number {
    skipWs();
    const ch = input[i];

    if (ch === "(") {
      i++;
      const v = parseExpr();
      skipWs();
      if (input[i] !== ")") throw new Error("Expected )");
      i++;
      return v;
    }

    // number
    if (ch !== undefined && (/[0-9.]/.test(ch))) {
      const start = i;
      while (i < input.length && /[0-9.eE+\-]/.test(input[i]!)) {
        // allow scientific notation but stop if +/- isn't part of an exponent
        const c = input[i]!;
        if ((c === "+" || c === "-") && !/[eE]/.test(input[i - 1] ?? "")) break;
        i++;
      }
      const num = Number(input.slice(start, i));
      if (Number.isNaN(num)) throw new Error(`Bad number near ${start}`);
      return num;
    }

    // identifier (variable, constant, or function call)
    if (ch !== undefined && /[a-zA-Z_]/.test(ch)) {
      const start = i;
      while (i < input.length && /[a-zA-Z0-9_]/.test(input[i]!)) i++;
      const name = input.slice(start, i);
      skipWs();
      if (input[i] === "(") {
        const fn = FUNCS[name];
        if (!fn) throw new Error(`Unknown function: ${name}`);
        i++;
        const args: number[] = [];
        skipWs();
        if (input[i] !== ")") {
          args.push(parseExpr());
          skipWs();
          while (input[i] === ",") {
            i++;
            args.push(parseExpr());
            skipWs();
          }
        }
        if (input[i] !== ")") throw new Error("Expected )");
        i++;
        return fn(...args);
      }
      if (name in scope) return scope[name]!;
      if (name in CONSTS) return CONSTS[name]!;
      throw new Error(`Unknown variable: ${name}`);
    }

    throw new Error(`Unexpected token at ${i}`);
  }

  const result = parseExpr();
  skipWs();
  if (i < input.length) throw new Error(`Unexpected trailing input at ${i}`);
  return result;
}

/** Safe wrapper — returns null instead of throwing on malformed input. */
export function tryEval(
  input: string,
  scope: Record<string, number> = {},
): number | null {
  try {
    const v = evalExpr(input, scope);
    return Number.isFinite(v) ? v : null;
  } catch {
    return null;
  }
}
