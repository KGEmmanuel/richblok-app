/**
 * Richblok MVP challenge content
 * 5 skills × 20 questions = 100 total
 * Each question: single-answer multiple choice, 4 options, 60s duration.
 * Pass mark (note) = 12/20 = 60%.
 */

interface SeedAnswer {
  text: string;
  istrue: 'yes' | 'no';
}

interface SeedQuestion {
  question: string;
  reponseType: 'CU';      // choix unique
  reposesPossible: SeedAnswer[];
  reponseKeyWord: string[];
  keywordsRation: string;
  duration: number;        // seconds
}

interface SeedChallenge {
  slug: string;
  titre: string;
  skills: string[];
  description: string;
  objectif: string;
  objectifEtape: string;
  conditionValidaation: string;
  question: string;
  language: 'EN';
  type: 'SKILL' | 'AI_PAIR';
  creatorType: 'SYS';
  duree: number;
  note: number;
  questions: SeedQuestion[];
  image: string;
  // v3 additions
  competencyTags?: string[];
  challengeFormat?: 'solo_capstone' | 'team' | 'hackathon' | 'pivot' | 'review' | 'oss' | 'ai_pair';
  estimatedDuration?: string;
  // v4 F17 additions — AI-pair fields
  brief?: string;
  starterRepoUrl?: string;
  successCriteria?: string;
  timerSeconds?: number;
  aiAllowed?: boolean;
}

const D = 60;             // default 60s per question
const ok = (text: string): SeedAnswer => ({ text, istrue: 'yes' });
const no = (text: string): SeedAnswer => ({ text, istrue: 'no' });

// =========================== REACT / JS ===========================
const REACT_JS: SeedQuestion[] = [
  { question: 'What hook lets you perform side effects in a functional React component?',
    reponseType: 'CU', reposesPossible: [ok('useEffect'), no('useState'), no('useMemo'), no('useRef')],
    reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Which statement about React keys is correct?',
    reponseType: 'CU', reposesPossible: [
      ok('Keys should be stable and unique among siblings'),
      no('Keys should be the array index whenever possible'),
      no('Keys must be globally unique across the entire app'),
      no('React ignores keys when rendering lists')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'What is the output of: console.log(typeof null) ?',
    reponseType: 'CU', reposesPossible: [ok('"object"'), no('"null"'), no('"undefined"'), no('"boolean"')],
    reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Which syntax correctly declares a React component with props?',
    reponseType: 'CU', reposesPossible: [
      ok('function Hello({ name }) { return <h1>Hi {name}</h1>; }'),
      no('function Hello(name) { return <h1>Hi {name}</h1>; }'),
      no('class Hello { render() { return <h1>Hi</h1>; } }'),
      no('const Hello = name => <h1>Hi {name.name}</h1>')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'What does "state lifting" mean in React?',
    reponseType: 'CU', reposesPossible: [
      ok('Moving state up to the nearest common ancestor of components that need it'),
      no('Using useState inside a custom hook'),
      no('Persisting state to localStorage'),
      no('Passing state through Context directly')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'What does `useMemo(() => expensive(), [dep])` return after first render?',
    reponseType: 'CU', reposesPossible: [
      ok('A memoized value recomputed only when `dep` changes'),
      no('A new value every render'),
      no('A memoized function reference'),
      no('A Promise resolving to expensive()')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Which JS value is NOT falsy?',
    reponseType: 'CU', reposesPossible: [ok('"0"'), no('0'), no('null'), no('undefined')],
    reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Inside useEffect, you return a function. What does React do with it?',
    reponseType: 'CU', reposesPossible: [
      ok('Runs it as cleanup before the next effect or on unmount'),
      no('Ignores it unless you export it'),
      no('Calls it once on mount only'),
      no('Calls it every render, then discards it')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'What does JSX `<div>{items.map(i => <Row i={i} />)}</div>` warn about?',
    reponseType: 'CU', reposesPossible: [
      ok('Each child in a list needs a unique `key` prop'),
      no('You cannot map inside JSX'),
      no('`items` must be a Set not an Array'),
      no('`<Row>` must be default-exported')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Given `const [x, setX] = useState(0); setX(x+1); setX(x+1);` — after render, x is:',
    reponseType: 'CU', reposesPossible: [
      ok('1'),
      no('2'),
      no('0'),
      no('undefined')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'How do you render a component only when `show` is true?',
    reponseType: 'CU', reposesPossible: [
      ok('{show && <Panel />}'),
      no('{if (show) <Panel />}'),
      no('{show ? <Panel />}'),
      no('<Panel show />')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Which is the best way to conditionally merge CSS classes in React?',
    reponseType: 'CU', reposesPossible: [
      ok('Use a library like `clsx` or `classnames`'),
      no('Inline string concatenation with `+`'),
      no('A `switch` statement returning a template literal'),
      no('Mutating `className` imperatively in useEffect')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Array destructuring: `const [a, , b] = [1, 2, 3]`. What is b?',
    reponseType: 'CU', reposesPossible: [ok('3'), no('2'), no('undefined'), no('[2, 3]')],
    reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'What is React Context most useful for?',
    reponseType: 'CU', reposesPossible: [
      ok('Passing values deeply without prop drilling (theme, auth, locale)'),
      no('Managing all app state to replace useState'),
      no('Running side effects outside components'),
      no('Server-side rendering of components')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'In JavaScript, `[] == false` evaluates to?',
    reponseType: 'CU', reposesPossible: [ok('true'), no('false'), no('undefined'), no('TypeError')],
    reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Which Promise method resolves after ALL promises fulfil?',
    reponseType: 'CU', reposesPossible: [
      ok('Promise.all'),
      no('Promise.race'),
      no('Promise.any'),
      no('Promise.resolve')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Which fixes "Can\'t perform a React state update on an unmounted component"?',
    reponseType: 'CU', reposesPossible: [
      ok('Return a cleanup in useEffect that cancels the async work'),
      no('Wrap setState in a try/catch'),
      no('Use useRef instead of useState'),
      no('Call setState inside requestAnimationFrame')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'What does `React.memo(Component)` do?',
    reponseType: 'CU', reposesPossible: [
      ok('Memoizes the component, re-rendering only if props shallowly change'),
      no('Caches the component output to localStorage'),
      no('Forces the component to never re-render'),
      no('Converts the component to a class')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'What is the correct import for `useRouter` in Next.js 13+ app router?',
    reponseType: 'CU', reposesPossible: [
      ok('import { useRouter } from "next/navigation"'),
      no('import { useRouter } from "next/router"'),
      no('import useRouter from "next"'),
      no('import { Router } from "react-router-dom"')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'ES2020 optional chaining: `user?.profile?.name` returns what if `user` is null?',
    reponseType: 'CU', reposesPossible: [
      ok('undefined (no TypeError)'),
      no('null'),
      no('"" (empty string)'),
      no('Throws TypeError')
    ], reponseKeyWord: [], keywordsRation: '', duration: D }
];

// =========================== PYTHON / BACKEND ===========================
const PYTHON: SeedQuestion[] = [
  { question: 'Which Python data structure preserves insertion order and allows duplicates?',
    reponseType: 'CU', reposesPossible: [ok('list'), no('set'), no('frozenset'), no('dict (in pre-3.7)')],
    reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'What does `len("café")` return in Python 3?',
    reponseType: 'CU', reposesPossible: [ok('4'), no('5'), no('6'), no('TypeError')],
    reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Which is the correct way to merge two dicts a and b in Python 3.9+?',
    reponseType: 'CU', reposesPossible: [
      ok('a | b'),
      no('a + b'),
      no('a & b'),
      no('a.append(b)')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Which HTTP status code means "Unauthorized — authentication required"?',
    reponseType: 'CU', reposesPossible: [ok('401'), no('403'), no('400'), no('500')],
    reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'In FastAPI, which decorator defines a GET endpoint?',
    reponseType: 'CU', reposesPossible: [
      ok('@app.get("/path")'),
      no('@app.route("/path")'),
      no('@get("/path")'),
      no('@router.GET("/path")')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Which Python keyword turns a function into a generator?',
    reponseType: 'CU', reposesPossible: [ok('yield'), no('return'), no('async'), no('defer')],
    reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'What is the output of `[x*2 for x in range(3)]` ?',
    reponseType: 'CU', reposesPossible: [ok('[0, 2, 4]'), no('[2, 4, 6]'), no('(0, 2, 4)'), no('[1, 2, 3]')],
    reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Which method removes AND returns the last element from a Python list?',
    reponseType: 'CU', reposesPossible: [ok('list.pop()'), no('list.remove()'), no('list.delete()'), no('del list[-1]')],
    reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'In REST API design, which verb is idempotent AND typically replaces a resource?',
    reponseType: 'CU', reposesPossible: [ok('PUT'), no('POST'), no('PATCH'), no('GET')],
    reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'What does `async def fetch():` indicate in Python?',
    reponseType: 'CU', reposesPossible: [
      ok('A coroutine that must be awaited'),
      no('A thread running in parallel'),
      no('A function that caches its output'),
      no('A decorator')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Which Python exception is raised when a dict key is missing?',
    reponseType: 'CU', reposesPossible: [ok('KeyError'), no('IndexError'), no('ValueError'), no('TypeError')],
    reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Best practice: where should secrets (DB password) live in a Python project?',
    reponseType: 'CU', reposesPossible: [
      ok('Environment variables (e.g. loaded via .env, not committed)'),
      no('Hardcoded in the main module'),
      no('In a settings.py file checked into Git'),
      no('In the repository README so the team can find them')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: '`@staticmethod` vs `@classmethod` — which receives the class as first argument?',
    reponseType: 'CU', reposesPossible: [
      ok('@classmethod'),
      no('@staticmethod'),
      no('Both'),
      no('Neither')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Which is the best async HTTP client for high-throughput requests in Python?',
    reponseType: 'CU', reposesPossible: [
      ok('httpx (async)'),
      no('urllib (sync)'),
      no('requests (sync)'),
      no('socket (raw)')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'When should you use pagination in an API that returns list data?',
    reponseType: 'CU', reposesPossible: [
      ok('Whenever the result set can grow unbounded'),
      no('Only when more than 10,000 rows exist'),
      no('Never, clients should filter themselves'),
      no('Only for read-only GET endpoints')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: '`items = [1,2,3]; items[::-1]` evaluates to?',
    reponseType: 'CU', reposesPossible: [ok('[3, 2, 1]'), no('[1, 2, 3]'), no('[1, 3]'), no('None')],
    reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'In SQLAlchemy ORM, `session.commit()` fails halfway. What should you do?',
    reponseType: 'CU', reposesPossible: [
      ok('Call session.rollback() then handle the error'),
      no('Call session.commit() again immediately'),
      no('Ignore it, SQLAlchemy retries automatically'),
      no('Restart the Python process')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'JSON Web Token (JWT) is typically sent via which HTTP header?',
    reponseType: 'CU', reposesPossible: [
      ok('Authorization: Bearer <token>'),
      no('Cookie: jwt=<token>'),
      no('X-Auth-Token: <token>'),
      no('Content-Type: application/jwt')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'A "race condition" in an API endpoint is usually fixed with:',
    reponseType: 'CU', reposesPossible: [
      ok('A database transaction or row-level lock'),
      no('A longer timeout'),
      no('Caching the response'),
      no('Rate limiting the caller')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'In Docker, which command builds an image from a Dockerfile?',
    reponseType: 'CU', reposesPossible: [
      ok('docker build -t name .'),
      no('docker run name'),
      no('docker pull name'),
      no('docker compose up')
    ], reponseKeyWord: [], keywordsRation: '', duration: D }
];

// =========================== SQL / DATA ===========================
const SQL: SeedQuestion[] = [
  { question: 'Which SQL clause filters rows AFTER aggregation?',
    reponseType: 'CU', reposesPossible: [ok('HAVING'), no('WHERE'), no('FILTER'), no('GROUP BY')],
    reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'What does an INNER JOIN return?',
    reponseType: 'CU', reposesPossible: [
      ok('Only rows with matches in both tables'),
      no('All rows from the left table'),
      no('All rows from both tables'),
      no('Only rows with NULLs on both sides')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'To paginate, which clause is standard in ANSI SQL?',
    reponseType: 'CU', reposesPossible: [
      ok('FETCH FIRST n ROWS ONLY / OFFSET'),
      no('PAGINATE BY n'),
      no('PAGE n'),
      no('SKIP n TAKE m')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Which index is generally best for equality lookups on an int PK?',
    reponseType: 'CU', reposesPossible: [ok('B-tree'), no('GIN'), no('GiST'), no('Bitmap on each value')],
    reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'What does `SELECT COUNT(*)` include?',
    reponseType: 'CU', reposesPossible: [
      ok('All rows, including those with NULLs'),
      no('Only rows where no column is NULL'),
      no('Distinct values in the primary key'),
      no('The schema metadata row count')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'The fastest way to find "the 10 most recent orders per user" in PostgreSQL:',
    reponseType: 'CU', reposesPossible: [
      ok('Window function ROW_NUMBER() OVER (PARTITION BY user ORDER BY date DESC)'),
      no('SELECT * FROM orders ORDER BY date DESC LIMIT 10 per user'),
      no('A correlated subquery counting rows'),
      no('A recursive CTE')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Which SQL statement is used to change existing data?',
    reponseType: 'CU', reposesPossible: [ok('UPDATE'), no('ALTER'), no('MODIFY'), no('CHANGE')],
    reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'A "transaction" in SQL guarantees:',
    reponseType: 'CU', reposesPossible: [
      ok('Atomicity, Consistency, Isolation, Durability (ACID)'),
      no('Only atomicity'),
      no('Only performance'),
      no('Encryption at rest')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Given `SELECT name FROM users WHERE email = \'a\'; --` in code — what\'s wrong?',
    reponseType: 'CU', reposesPossible: [
      ok('SQL injection risk — use parameterized queries'),
      no('Missing `ORDER BY`'),
      no('Missing `GROUP BY`'),
      no('Nothing, that is safe')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Normalization (3NF) primarily aims to:',
    reponseType: 'CU', reposesPossible: [
      ok('Eliminate redundant data and reduce update anomalies'),
      no('Maximize query speed in reporting queries'),
      no('Reduce disk usage on SSD'),
      no('Enforce foreign keys')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'LEFT JOIN vs INNER JOIN — LEFT JOIN also returns:',
    reponseType: 'CU', reposesPossible: [
      ok('Rows from the left table that have no match on the right (as NULLs)'),
      no('Rows from the right table with no match on the left'),
      no('Only left table rows, never right'),
      no('Both tables fully regardless of match')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Which aggregate function ignores NULL values?',
    reponseType: 'CU', reposesPossible: [
      ok('COUNT(column) — skips NULLs'),
      no('COUNT(*) — skips NULLs'),
      no('SUM — counts NULLs as 0'),
      no('All aggregates treat NULL as 0')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'What does EXPLAIN ANALYZE do in PostgreSQL?',
    reponseType: 'CU', reposesPossible: [
      ok('Runs the query and shows actual row counts + timing per plan node'),
      no('Shows only the plan without executing'),
      no('Optimizes the query automatically'),
      no('Prints the schema of affected tables')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Which data type is best for currency amounts?',
    reponseType: 'CU', reposesPossible: [
      ok('DECIMAL / NUMERIC with fixed scale'),
      no('FLOAT'),
      no('INT (store dollars only)'),
      no('VARCHAR with "$" prefix')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Which constraint prevents duplicate rows in a column or column combination?',
    reponseType: 'CU', reposesPossible: [ok('UNIQUE'), no('DEFAULT'), no('CHECK'), no('NOT NULL')],
    reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Firestore is:',
    reponseType: 'CU', reposesPossible: [
      ok('A NoSQL document database'),
      no('A relational SQL database'),
      no('A graph database'),
      no('A time-series database')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: '`SELECT DISTINCT country FROM users` — what does it do?',
    reponseType: 'CU', reposesPossible: [
      ok('Returns each unique country value once'),
      no('Returns all user rows ordered by country'),
      no('Deletes duplicate user rows'),
      no('Groups users by country and counts them')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Why is `SELECT *` in production queries generally discouraged?',
    reponseType: 'CU', reposesPossible: [
      ok('It transfers unnecessary columns and breaks when schema changes'),
      no('It is slower than SELECT col by ~2x'),
      no('Postgres will reject it after 1M rows'),
      no('It always causes full table scans')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Which JOIN returns rows with NO match in the other table?',
    reponseType: 'CU', reposesPossible: [
      ok('A FULL OUTER JOIN combined with WHERE ... IS NULL'),
      no('INNER JOIN'),
      no('CROSS JOIN'),
      no('SELF JOIN')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'A composite index on (a, b) can speed up:',
    reponseType: 'CU', reposesPossible: [
      ok('Queries filtering on `a` alone or on `a AND b` together'),
      no('Queries filtering on `b` alone'),
      no('Queries filtering on `c`'),
      no('All queries, regardless of columns')
    ], reponseKeyWord: [], keywordsRation: '', duration: D }
];

// =========================== UI / UX ===========================
const UX: SeedQuestion[] = [
  { question: 'Which of these has the BEST accessibility contrast?',
    reponseType: 'CU', reposesPossible: [
      ok('Black text on white background'),
      no('Light-grey text on white background'),
      no('Yellow text on white background'),
      no('Dark-grey text on dark-grey background')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'What is the ideal click/tap target size on mobile (Apple HIG / Material)?',
    reponseType: 'CU', reposesPossible: [
      ok('At least 44×44 pt (Apple) / 48×48 dp (Material)'),
      no('At least 16×16 px'),
      no('At least 100×100 px'),
      no('Target size does not matter if text is readable')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'What does "Jobs-to-Be-Done" (JTBD) framework focus on?',
    reponseType: 'CU', reposesPossible: [
      ok('The outcome users hire a product to achieve'),
      no('The engineering tasks in the sprint backlog'),
      no('A ranking of UI features by priority'),
      no('A formal job description for UX designers')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'The primary purpose of a loading skeleton is to:',
    reponseType: 'CU', reposesPossible: [
      ok('Give users visual feedback of progress and reduce perceived wait'),
      no('Preload all data immediately'),
      no('Replace error states'),
      no('Reduce bundle size')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Which is a sign your form has TOO MANY fields?',
    reponseType: 'CU', reposesPossible: [
      ok('Completion rate drops sharply and drop-off concentrates on one long screen'),
      no('Users complete it fast'),
      no('Users correct their data often'),
      no('Error rate on individual fields is low')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'What is the "8px grid" in modern UI design?',
    reponseType: 'CU', reposesPossible: [
      ok('A spacing and sizing system using multiples of 8 for rhythm and scalability'),
      no('An 8-column grid used on desktop only'),
      no('An 8-pixel font-size minimum'),
      no('Always 8 colors in the palette')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'What does "affordance" mean in UX?',
    reponseType: 'CU', reposesPossible: [
      ok('How an object signals the action it permits (e.g., a button looks clickable)'),
      no('How expensive a feature is to build'),
      no('The number of features in a product'),
      no('Whether users can afford the subscription')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Which best describes "progressive disclosure"?',
    reponseType: 'CU', reposesPossible: [
      ok('Show only what is needed now; reveal more advanced options on demand'),
      no('Disclose all options upfront for full transparency'),
      no('Hide every feature until the user pays'),
      no('Always use tooltips to explain every button')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Your signup button has very low conversion. What is the first thing to A/B test?',
    reponseType: 'CU', reposesPossible: [
      ok('Button copy, color, and position above the fold'),
      no('The font-weight of the page subtitle'),
      no('The favicon'),
      no('The URL of the terms page')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'What does a "happy path" refer to?',
    reponseType: 'CU', reposesPossible: [
      ok('The main intended success flow of a user journey'),
      no('A feature users request most often'),
      no('The designer\'s favorite screen'),
      no('A Figma layout that uses happy colors')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Mobile-first design means:',
    reponseType: 'CU', reposesPossible: [
      ok('Design for small screens first, then enhance for larger viewports'),
      no('Build only a mobile app, no web'),
      no('Test on the smallest phone you can find first'),
      no('Use only touch interactions, never mouse')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'WCAG 2.1 AA requires text contrast ratio of at least:',
    reponseType: 'CU', reposesPossible: [
      ok('4.5:1 for normal text'),
      no('2:1'),
      no('3:1'),
      no('7:1')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'In design systems, a "component token" typically defines:',
    reponseType: 'CU', reposesPossible: [
      ok('A named value (color, spacing, radius) reused across components'),
      no('A raw RGB value scattered in CSS'),
      no('A JSON Schema for API contracts'),
      no('A SQL column definition')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Best practice for empty states:',
    reponseType: 'CU', reposesPossible: [
      ok('Show an illustration + clear next action ("Create your first X")'),
      no('Show a blank white screen'),
      no('Show the most recent error message'),
      no('Show a full list of every possible action')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Which micro-copy is most reassuring on a payment button?',
    reponseType: 'CU', reposesPossible: [
      ok('"Pay $10 · Cancel anytime"'),
      no('"Submit"'),
      no('"Proceed"'),
      no('"Finalize my transaction"')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Card sorting is a research method used to:',
    reponseType: 'CU', reposesPossible: [
      ok('Inform navigation structure and information architecture'),
      no('Choose brand colors'),
      no('Prioritize engineering tickets'),
      no('Rank competitors')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'In usability testing, "think aloud" means:',
    reponseType: 'CU', reposesPossible: [
      ok('Ask users to verbalize their thoughts as they use the interface'),
      no('The designer narrates the prototype to the user'),
      no('The user writes feedback after the test'),
      no('Recording the screen without any user interaction')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Which metric BEST measures onboarding funnel health?',
    reponseType: 'CU', reposesPossible: [
      ok('Activation rate (% of sign-ups reaching a first-value action)'),
      no('Daily active users'),
      no('Revenue per user'),
      no('Number of sign-ups')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'A modal should generally be avoided when:',
    reponseType: 'CU', reposesPossible: [
      ok('The task is complex, long, or non-blocking'),
      no('You want to confirm a destructive action'),
      no('You need to collect 1-2 pieces of data'),
      no('You want to show an error for a single field')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Why is "above the fold" still relevant in 2026?',
    reponseType: 'CU', reposesPossible: [
      ok('Initial viewport content disproportionately affects conversion and attention'),
      no('Scroll-tracking is disabled in modern browsers'),
      no('Users never scroll on mobile'),
      no('Google Ads only indexes content above the fold')
    ], reponseKeyWord: [], keywordsRation: '', duration: D }
];

// =========================== PRODUCT THINKING ===========================
const PRODUCT: SeedQuestion[] = [
  { question: 'You have 3 feature requests. Which framework helps prioritize them?',
    reponseType: 'CU', reposesPossible: [
      ok('RICE (Reach × Impact × Confidence / Effort)'),
      no('ACID'),
      no('MVC'),
      no('WET')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Your landing page converts at 2%. Ad spend is $500 for 3000 clicks. Sign-ups:',
    reponseType: 'CU', reposesPossible: [
      ok('60 sign-ups'),
      no('120 sign-ups'),
      no('30 sign-ups'),
      no('600 sign-ups')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: '"North Star metric" should be:',
    reponseType: 'CU', reposesPossible: [
      ok('A single leading indicator predicting long-term value for users AND business'),
      no('Revenue'),
      no('Daily sign-ups'),
      no('The CEO\'s favorite chart')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'What is the viral coefficient (K-factor)?',
    reponseType: 'CU', reposesPossible: [
      ok('The average number of new users each existing user brings in'),
      no('The percentage of the budget spent on paid ads'),
      no('A retention cohort score'),
      no('The number of channels used for growth')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'A K-factor of 1.1 means growth is:',
    reponseType: 'CU', reposesPossible: [
      ok('Exponentially viral without paid ads'),
      no('Linear and needs constant ad spend'),
      no('Declining month over month'),
      no('Break-even, neither growing nor shrinking')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Which question is MOST product-useful during user interviews?',
    reponseType: 'CU', reposesPossible: [
      ok('"Tell me about the last time you tried to solve this problem."'),
      no('"Would you pay $10 for this feature?"'),
      no('"Do you like our design?"'),
      no('"Do you think this is a good idea?"')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Your MVP launches with 1 feature. A user asks for 3 more. You should:',
    reponseType: 'CU', reposesPossible: [
      ok('Evaluate impact + frequency; defer if not aligned with core loop'),
      no('Build them immediately to keep the user happy'),
      no('Charge extra for each'),
      no('Reject any feedback during MVP')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'What does "activation" mean in a typical SaaS funnel?',
    reponseType: 'CU', reposesPossible: [
      ok('A user completes the first meaningful action that signals intent and value'),
      no('A user pays for the product'),
      no('A user shares the product on social media'),
      no('A user reaches the pricing page')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'CAC = Customer Acquisition Cost. If you spend $1,000 on ads and get 20 paying users, CAC is:',
    reponseType: 'CU', reposesPossible: [ok('$50'), no('$20'), no('$1,000'), no('$500')],
    reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'LTV should be how many times larger than CAC for a healthy SaaS?',
    reponseType: 'CU', reposesPossible: [
      ok('At least 3x'),
      no('At least 1x'),
      no('At least 10x'),
      no('Ratio does not matter')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Product-market fit is best observed when:',
    reponseType: 'CU', reposesPossible: [
      ok('Users pull the product from you — usage grows organically and retention is strong'),
      no('You win a pitch competition'),
      no('You raise a seed round'),
      no('You have shipped 10 features')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Which is a VANITY metric?',
    reponseType: 'CU', reposesPossible: [
      ok('Total cumulative downloads'),
      no('Paid monthly active users'),
      no('Day-7 retention %'),
      no('Monthly churn %')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Retention is best visualized with a:',
    reponseType: 'CU', reposesPossible: [
      ok('Cohort chart'),
      no('Pie chart'),
      no('Scatter plot'),
      no('Stacked bar of revenue')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Best way to validate willingness-to-pay for a new feature:',
    reponseType: 'CU', reposesPossible: [
      ok('Ship a pricing page and count who clicks "Buy", even if incomplete'),
      no('Ask users "Would you pay for this?" in a survey'),
      no('Build the feature and release it for free'),
      no('Ask your team what they think is fair')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'A "cold start" problem in a marketplace is solved best by:',
    reponseType: 'CU', reposesPossible: [
      ok('Seeding one side of the market first, even manually'),
      no('Launching both sides simultaneously at scale'),
      no('Running ads to both sides equally'),
      no('Waiting for organic growth')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Your funnel: 1000 visits → 100 signups → 10 paid. Conversion from visit to paid is:',
    reponseType: 'CU', reposesPossible: [ok('1%'), no('10%'), no('0.1%'), no('100%')],
    reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Best copy for an upgrade CTA when users hit a free-tier limit:',
    reponseType: 'CU', reposesPossible: [
      ok('"Unlock unlimited — $10/month. Cancel anytime."'),
      no('"Buy now"'),
      no('"Subscribe"'),
      no('"Pay $10"')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Which is NOT a valid reason to pivot a product?',
    reponseType: 'CU', reposesPossible: [
      ok('One angry user writes a bad review'),
      no('Repeated user interviews reveal a different, bigger problem'),
      no('You cannot achieve positive unit economics at any scale'),
      no('A clear adjacent market shows 10x more demand')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Your feature launches and metric stays flat. First diagnostic:',
    reponseType: 'CU', reposesPossible: [
      ok('Check if the feature is discoverable + used by the target segment'),
      no('Remove the feature immediately'),
      no('Double the ad budget'),
      no('Redesign the logo')
    ], reponseKeyWord: [], keywordsRation: '', duration: D },
  { question: 'Facebook Pixel\'s "InitiateCheckout" event is typically logged when:',
    reponseType: 'CU', reposesPossible: [
      ok('User clicks the upgrade CTA and a checkout session starts'),
      no('User first visits the landing page'),
      no('Payment is confirmed by Stripe'),
      no('The user logs out')
    ], reponseKeyWord: [], keywordsRation: '', duration: D }
];

const DESC = {
  react: 'Prove your React & modern JavaScript fundamentals. 20 multiple-choice questions covering hooks, state, JSX, ES2020+, and common pitfalls. 60 seconds per question — 20 minutes total.',
  python: 'Prove your Python & backend fundamentals. 20 multiple-choice questions covering language features, REST, FastAPI, async, data structures, and production engineering practices.',
  sql: 'Prove your SQL & data fundamentals. 20 multiple-choice questions covering joins, aggregates, indexes, window functions, pagination, and performance.',
  ux: 'Prove your UI/UX & product design fundamentals. 20 multiple-choice questions covering accessibility, mobile-first, usability, design systems, and conversion patterns.',
  product: 'Prove your product thinking. 20 multiple-choice questions covering prioritization, metrics, funnels, LTV/CAC, retention, and product-market fit.'
};

export const CHALLENGES_SEED: SeedChallenge[] = [
  {
    slug: 'react-js-mid',
    titre: 'React & JavaScript — Mid Level',
    skills: ['React', 'JavaScript', 'TypeScript', 'Frontend'],
    description: DESC.react,
    objectif: 'Earn a verified React badge',
    objectifEtape: 'Complete all 20 questions',
    conditionValidaation: '12+ correct answers to earn a badge',
    question: 'Are you ready to prove your React skills?',
    language: 'EN',
    type: 'SKILL',
    creatorType: 'SYS',
    duree: D * 20,
    note: 12,
    questions: REACT_JS,
    image: '/assets/rb/challenge-react.svg',
    competencyTags: ['pressure_performance', 'decision_making', 'learning_from_failure', 'adaptability'],
    challengeFormat: 'solo_capstone',
    estimatedDuration: '20 minutes'
  },
  {
    slug: 'python-backend',
    titre: 'Python & Backend Engineering',
    skills: ['Python', 'FastAPI', 'REST', 'Backend'],
    description: DESC.python,
    objectif: 'Earn a verified Python/Backend badge',
    objectifEtape: 'Complete all 20 questions',
    conditionValidaation: '12+ correct answers to earn a badge',
    question: 'Are you ready to prove your backend skills?',
    language: 'EN',
    type: 'SKILL',
    creatorType: 'SYS',
    duree: D * 20,
    note: 12,
    questions: PYTHON,
    image: '/assets/rb/challenge-python.svg',
    competencyTags: ['decision_making', 'pressure_performance', 'communication', 'teamwork'],
    challengeFormat: 'solo_capstone',
    estimatedDuration: '20 minutes'
  },
  {
    slug: 'sql-data',
    titre: 'SQL & Data Fundamentals',
    skills: ['SQL', 'PostgreSQL', 'Databases', 'Data'],
    description: DESC.sql,
    objectif: 'Earn a verified SQL badge',
    objectifEtape: 'Complete all 20 questions',
    conditionValidaation: '12+ correct answers to earn a badge',
    question: 'Are you ready to prove your SQL skills?',
    language: 'EN',
    type: 'SKILL',
    creatorType: 'SYS',
    duree: D * 20,
    note: 12,
    questions: SQL,
    image: '/assets/rb/challenge-sql.svg',
    competencyTags: ['decision_making', 'adaptability', 'communication'],
    challengeFormat: 'solo_capstone',
    estimatedDuration: '20 minutes'
  },
  {
    slug: 'ui-ux-design',
    titre: 'UI/UX & Product Design',
    skills: ['UI', 'UX', 'Design', 'Accessibility'],
    description: DESC.ux,
    objectif: 'Earn a verified UI/UX badge',
    objectifEtape: 'Complete all 20 questions',
    conditionValidaation: '12+ correct answers to earn a badge',
    question: 'Are you ready to prove your design skills?',
    language: 'EN',
    type: 'SKILL',
    creatorType: 'SYS',
    duree: D * 20,
    note: 12,
    questions: UX,
    image: '/assets/rb/challenge-uiux.svg',
    competencyTags: ['communication', 'feedback_reception', 'decision_making', 'teamwork'],
    challengeFormat: 'review',
    estimatedDuration: '20 minutes'
  },
  {
    slug: 'product-thinking',
    titre: 'Product Thinking & Growth',
    skills: ['Product', 'Growth', 'Metrics', 'Strategy'],
    description: DESC.product,
    objectif: 'Earn a verified Product Thinking badge',
    objectifEtape: 'Complete all 20 questions',
    conditionValidaation: '12+ correct answers to earn a badge',
    question: 'Are you ready to prove your product thinking?',
    language: 'EN',
    type: 'SKILL',
    creatorType: 'SYS',
    duree: D * 20,
    note: 12,
    questions: PRODUCT,
    image: '/assets/rb/challenge-product.svg',
    competencyTags: ['leadership', 'decision_making', 'learning_from_failure', 'initiative'],
    challengeFormat: 'solo_capstone',
    estimatedDuration: '20 minutes'
  },

  // ========== PRD v4 F17 — AI-pair challenges ==========
  // These use the new AI_PAIR challenge format. Candidates get 45 min with
  // any AI tool of their choice. Submission = PR diff + full transcript +
  // optional explainer. Scored by Claude across 4 dimensions.
  {
    slug: 'ai-pair-rate-limit-bug',
    titre: 'AI-Pair Challenge · Fix the rate-limit bug',
    skills: ['Node.js', 'Express', 'Debugging', 'AI-Pair'],
    description: 'A broken rate-limiter is letting requests through. Fix it with any AI tool. We score correctness, verification discipline, and cost-consciousness.',
    objectif: 'Ship a correct patch + demonstrate verification discipline',
    objectifEtape: 'Submit PR diff + full AI transcript + optional explainer',
    conditionValidaation: 'Overall score >= 60 (weighted 40% correctness, 35% verification, 10% explainer, 15% cost)',
    question: 'Can you ship real work with an AI agent AND catch its mistakes?',
    language: 'EN',
    type: 'AI_PAIR',
    creatorType: 'SYS',
    duree: 2700,
    note: 60,
    questions: [],
    image: '/assets/rb/challenge-react.svg',
    competencyTags: ['ai_pair_programming', 'verification_discipline', 'ai_cost_consciousness', 'pressure_performance', 'decision_making'],
    challengeFormat: 'ai_pair',
    estimatedDuration: '45 minutes',
    timerSeconds: 2700,
    aiAllowed: true,
    starterRepoUrl: 'https://github.com/KGEmmanuel/richblok-ai-pair-rate-limit',
    brief: `# The bug

A rate-limiter in \`src/middleware/rate-limit.ts\` is supposed to allow 10 requests per minute per IP. Production logs show it's letting through 30+ requests/min from the same IP. A user has been hammering the /login endpoint for 6 hours.

The module uses an in-memory Map keyed by IP, with a sliding window. Tests in \`test/rate-limit.test.ts\` are passing (they shouldn't be).

# What you ship

1. A fix to \`rate-limit.ts\` that actually enforces the limit.
2. At least one failing test that now passes, OR a new test that catches the regression.
3. No behavior change to other code paths (don't refactor unrelated things).

# Constraints

- Don't add a new dependency. Stay on \`express\` + \`node:*\`.
- Don't use \`setInterval\` — the module must be stateless beyond the Map.
- Must work correctly with concurrent requests (Node is single-threaded but async).

# Verification traps to watch for (the AI may fall for these)

- The existing tests use mocked \`Date.now()\` in a way that hides the bug. Catch this.
- A naive fix "while time < now - 60s, shift" creates an O(n²) on bursts. Catch this too.
- The IP key uses \`req.ip\` which behind a proxy is always the proxy IP. Optional: note this in your explainer.`,
    successCriteria: `- [ ] Rate-limit bug is fixed. Manual check: sending 11 requests in < 60s gets a 429 on request 11.
- [ ] Fix does not rely on setInterval or setTimeout for cleanup.
- [ ] Test suite passes AFTER the fix (green).
- [ ] At least one test exists that would catch the original bug (i.e. if you revert your fix, the test fails).
- [ ] No new npm dependency added.
- [ ] Your transcript shows at least one instance of you pushing back on, fact-checking, or correcting AI output.`
  },

  {
    slug: 'ai-pair-n-plus-one-query',
    titre: 'AI-Pair Challenge · Kill the N+1 query',
    skills: ['SQL', 'ORM', 'Performance', 'AI-Pair'],
    description: 'A list endpoint is 15s slow in production. The query looks fine in code but the DB is doing 400+ queries per request. Fix with any AI tool.',
    objectif: 'Ship a fix that drops query count from 400+ to <5',
    objectifEtape: 'Submit PR diff + full AI transcript + optional explainer',
    conditionValidaation: 'Overall score >= 60 (weighted 40% correctness, 35% verification, 10% explainer, 15% cost)',
    question: 'Can you diagnose ORM pathologies when the AI wants to reach for Redis?',
    language: 'EN',
    type: 'AI_PAIR',
    creatorType: 'SYS',
    duree: 2700,
    note: 60,
    questions: [],
    image: '/assets/rb/challenge-sql.svg',
    competencyTags: ['ai_pair_programming', 'verification_discipline', 'ai_cost_consciousness', 'decision_making', 'pressure_performance'],
    challengeFormat: 'ai_pair',
    estimatedDuration: '45 minutes',
    timerSeconds: 2700,
    aiAllowed: true,
    starterRepoUrl: 'https://github.com/KGEmmanuel/richblok-ai-pair-n-plus-one',
    brief: `# The symptom

\`GET /api/orders\` returns 200 orders and is 15s slow in production. The controller code reads as 4 lines. The DB CPU graph spikes every time the endpoint is hit.

Running \`ANALYZE\` on the DB during a request shows 400+ individual queries against the \`users\`, \`products\`, and \`shipping_addresses\` tables.

# What you ship

1. A fix that drops the query count per request to fewer than 5.
2. A test (integration or query-log assertion) that would catch the regression if anyone re-introduces it.
3. No behavior change: the JSON response shape is the same.

# Constraints

- Don't add Redis or any cache layer. The fix must be at the query level.
- Don't change the DB schema.
- Don't denormalize. The orders table must stay normalized.
- Keep the response JSON backwards-compatible (same keys, same shape).

# Verification traps to watch for (the AI may fall for these)

- The AI may suggest caching. Push back — caching hides the bug, doesn't fix it.
- The AI may suggest \`.includes()\` / eager-load without checking which associations are actually used in the response. A correct fix loads only what the serializer touches.
- The \`shipping_addresses\` table has a polymorphic association (\`addressable_type\`, \`addressable_id\`) — naive eager-load will silently skip it.
- The test suite runs against SQLite but production is Postgres; some eager-load patterns silently fall back to N+1 on one but not the other. Catch this.`,
    successCriteria: `- [ ] Query count per \`/api/orders\` request is < 5 (measured with your ORM's query log or a proxy like pg_stat_statements).
- [ ] No caching layer introduced.
- [ ] Polymorphic \`shipping_addresses\` association is eager-loaded correctly.
- [ ] JSON response shape is unchanged.
- [ ] A test exists that asserts on query count (not just correctness).
- [ ] Your transcript shows at least one instance of you pushing back on a caching suggestion or fact-checking an ORM claim.`
  },

  {
    slug: 'ai-pair-stale-closure-hook',
    titre: 'AI-Pair Challenge · Debug the stale-closure React bug',
    skills: ['React', 'Hooks', 'Debugging', 'AI-Pair'],
    description: 'A search input works fine in dev but returns stale results in production. useEffect has a missing dep. Fix it without silencing the linter.',
    objectif: 'Ship a fix that survives React 18 strict-mode and prod concurrent rendering',
    objectifEtape: 'Submit PR diff + full AI transcript + optional explainer',
    conditionValidaation: 'Overall score >= 60 (weighted 40% correctness, 35% verification, 10% explainer, 15% cost)',
    question: 'Can you reason about closures, re-renders, and concurrent mode when the AI wants to //eslint-disable?',
    language: 'EN',
    type: 'AI_PAIR',
    creatorType: 'SYS',
    duree: 2700,
    note: 60,
    questions: [],
    image: '/assets/rb/challenge-react.svg',
    competencyTags: ['ai_pair_programming', 'verification_discipline', 'decision_making', 'ai_cost_consciousness', 'pressure_performance'],
    challengeFormat: 'ai_pair',
    estimatedDuration: '45 minutes',
    timerSeconds: 2700,
    aiAllowed: true,
    starterRepoUrl: 'https://github.com/KGEmmanuel/richblok-ai-pair-stale-closure',
    brief: `# The symptom

A search autocomplete in \`src/components/SearchBar.tsx\` shows the right results in dev mode but in production (React 18 strict-mode, no double-invoke) it sometimes shows results for an older query. Users report typing "react" then "vue" and seeing React results appear under "vue".

The component uses \`useEffect\` + \`fetch\` with an abort controller. The eslint-plugin-react-hooks warning was silenced with \`// eslint-disable-next-line react-hooks/exhaustive-deps\`.

# What you ship

1. A fix that makes the bug un-reproducible in strict-mode + React 18 concurrent rendering.
2. The eslint-disable comment is removed (or replaced with a lint-clean implementation).
3. A test (unit or integration) that reliably reproduces the race before your fix, and passes after.

# Constraints

- Don't add state management libraries (no Redux, Zustand, etc.). Stay in React.
- Don't disable strict-mode or downgrade React.
- The fetch call stays — don't move it to a server component.

# Verification traps to watch for (the AI may fall for these)

- The AI will likely suggest re-enabling the lint rule by adding the missing dep. Sometimes that's correct. Sometimes that causes infinite loops. Figure out which case applies.
- \`useRef\` for the latest query is tempting but creates a different class of race (ref updates don't trigger effect re-runs). Catch this.
- The abort controller usage has a subtle bug: it's created inside the effect and the effect's cleanup runs after the next render starts, not before. Mentioning this is a bonus.
- The test suite uses jest.fakeTimers() for the debounce, which will NOT catch the stale-closure bug on its own. You need an async test.`,
    successCriteria: `- [ ] \`// eslint-disable-next-line react-hooks/exhaustive-deps\` is removed.
- [ ] Component works correctly under strict-mode double-invoke.
- [ ] A test reliably reproduces the stale-closure race before your fix (assertion fails on old code).
- [ ] Same test passes after your fix.
- [ ] No new state-management library added.
- [ ] Your transcript shows at least one case of you rejecting an AI suggestion (e.g. "just add it to deps" when that creates a loop).`
  },

  {
    slug: 'ai-pair-cors-security-bug',
    titre: 'AI-Pair Challenge · Fix the CORS security hole',
    skills: ['Security', 'HTTP', 'Express', 'AI-Pair'],
    description: 'The API accepts credentialed requests from any origin. A pentest flagged it. The obvious AI fix is wrong. Ship a correct one.',
    objectif: 'Ship a fix that satisfies the spec AND the actual threat model',
    objectifEtape: 'Submit PR diff + full AI transcript + optional explainer',
    conditionValidaation: 'Overall score >= 60 (weighted 40% correctness, 35% verification, 10% explainer, 15% cost)',
    question: 'Can you tell a real security fix from a placebo when the AI writes confident-sounding CORS config?',
    language: 'EN',
    type: 'AI_PAIR',
    creatorType: 'SYS',
    duree: 2700,
    note: 60,
    questions: [],
    image: '/assets/rb/challenge-product.svg',
    competencyTags: ['ai_pair_programming', 'verification_discipline', 'decision_making', 'ai_cost_consciousness', 'learning_from_failure'],
    challengeFormat: 'ai_pair',
    estimatedDuration: '45 minutes',
    timerSeconds: 2700,
    aiAllowed: true,
    starterRepoUrl: 'https://github.com/KGEmmanuel/richblok-ai-pair-cors-bug',
    brief: `# The pentest report

> SEV-2: The API at \`/api/*\` returns \`Access-Control-Allow-Origin: *\` while also accepting cookies and \`Authorization\` headers via credentialed requests. Any page on the internet can read authenticated responses for a logged-in user.

The current CORS middleware is in \`src/middleware/cors.ts\`. It uses \`cors\` npm package with \`{ origin: '*', credentials: true }\`.

Product has given you a list of 3 allowed origins:
- \`https://app.example.com\` (main web app)
- \`https://admin.example.com\` (internal admin)
- \`https://*.preview.example.com\` (PR preview URLs, dynamic subdomain per PR)

# What you ship

1. A fix to \`cors.ts\` that only allows credentialed requests from the 3 allowed origin patterns above.
2. At least one test that sends a credentialed request from a non-allowed origin and asserts it's blocked.
3. Production logs should be able to tell the difference between a legit cross-origin request and a blocked one (for ops monitoring).

# Constraints

- You can keep the \`cors\` npm package OR write your own — your call. Explain the tradeoff in your transcript if you pick one.
- No \`Access-Control-Allow-Origin: null\` anywhere (that's its own vulnerability).
- No regex that matches too broadly (e.g. \`*.example.com\` also matching \`evil.example.com.attacker.com\`).

# Verification traps to watch for (the AI may fall for these)

- **The confident-wrong fix:** AI will often suggest \`origin: '*', credentials: true\`. Browsers reject this on the client side, but it's still a misconfig — some tools (postman, curl, legacy clients) don't enforce it. Catch this.
- **Subdomain regex blind spot:** \`/.*\\.preview\\.example\\.com/\` matches \`attacker.com.preview.example.com.evil.com\`. You need anchored regex.
- **Null origin:** some fetch flows (opaque redirects, data: URIs) send \`Origin: null\`. AI may suggest allowing it — don't.
- **Preflight vs actual:** CORS failures on preflight (OPTIONS) look different from failures on the actual request. Make sure your test catches both paths.`,
    successCriteria: `- [ ] \`origin: '*'\` with \`credentials: true\` is gone.
- [ ] Only the 3 allowed origin patterns can make credentialed requests.
- [ ] Subdomain regex for preview URLs is anchored (\`^https://[a-z0-9-]+\\.preview\\.example\\.com$\`).
- [ ] \`Origin: null\` is explicitly rejected.
- [ ] At least one test sends a credentialed request from \`https://attacker.com\` and asserts it's blocked on both preflight and actual request.
- [ ] Your transcript shows at least one case of you rejecting an AI suggestion that would have re-introduced a security hole.`
  }
];
