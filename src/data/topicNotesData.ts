export interface InterviewQA {
  question: string;
  answer: string;
  frequency: 'HIGH' | 'VERY_HIGH' | 'CRITICAL';
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AnnotatedProgram {
  title: string;
  filename: string;
  code: string;
  summary: string;
}

export interface TopicStudyNote {
  id: number;
  slug: string;
  title: string;
  moduleOrder: number;
  moduleTitle: string;
  estimatedMinutes: number;
  overview: string;
  coreConcepts: { title: string; markdown: string }[];
  interviewQA: InterviewQA[];
  annotatedProgram: AnnotatedProgram;
  commonPitfalls: string[];
  quiz?: QuizQuestion[];
}

export const TOPIC_NOTES: Record<string, TopicStudyNote> = {
  // =========================================================================
  // TOPIC 1: INTRO TO JAVA & HOW JVM WORKS
  // =========================================================================
  'intro-to-java': {
    id: 1,
    slug: 'intro-to-java',
    title: 'Introduction to Java & How JVM Works',
    moduleOrder: 1,
    moduleTitle: 'Java Fundamentals',
    estimatedMinutes: 30,
    overview: `Java is one of the most popular programming languages in the world. Its biggest superpower is "Write Once, Run Anywhere." This means you can write your Java code on a Windows laptop, and that exact same code will run smoothly on a Mac, a Linux server, or an Android phone without changing a single line! In this lesson, we will understand how Java does this using the JDK, JRE, and JVM in very simple, plain English.`,
    coreConcepts: [
      {
        title: '1. JDK, JRE, and JVM in Plain Words',
        markdown: `Think of Java like running a bakery:
- **JVM (Java Virtual Machine) - The Chef**: The JVM is the actual engine that runs your compiled Java program (called **Bytecode**). Every operating system (Windows, Mac, Linux) has its own JVM tailored for that OS.
- **JRE (Java Runtime Environment) - The Kitchen**: The JRE contains the JVM plus all the basic tools and standard Java libraries (like Math, Strings, and Collections) needed to *run* Java programs.
- **JDK (Java Development Kit) - The Complete Factory**: The JDK contains everything! It has the JRE to run programs, PLUS the compiler (\`javac\`) and developer tools you need to *write, compile, and build* Java software. If you are a developer, you install the JDK.`
      },
      {
        title: '2. Where Java Keeps Your Data: Stack vs Heap',
        markdown: `When your Java program runs, it organizes memory into two main areas:
- **Stack Memory (Fast & Temporary Notepad)**:
  - Stores local variables (like \`int age = 21\`) and tracks which method is running right now.
  - Super fast. When a method finishes, its notes are erased immediately.
- **Heap Memory (The Big Storage Room)**:
  - Whenever you create a new object using the \`new\` keyword (like \`new Scanner()\`), it is stored here in the Heap.
- **Garbage Collector (The Automatic Cleaning Robot)**:
  - In older languages like C++, you had to manually delete memory or your computer would freeze. In Java, a friendly background helper called the **Garbage Collector (GC)** constantly checks the Heap. When an object is no longer being used by anyone, the GC deletes it automatically!`
      },
      {
        title: '3. Why Java is Fast: The JIT (Just-In-Time) Compiler',
        markdown: `Java doesn't just read your code line-by-line slowly.
1. First, the \`javac\` compiler turns your human code (\`.java\`) into universal Bytecode (\`.class\`).
2. When the JVM runs this bytecode, it notices loops or methods that run thousands of times (called **"Hotspots"**).
3. The **JIT Compiler** immediately translates those hotspot parts directly into lightning-fast machine code so your program runs at near C++ speeds!`
      }
    ],
    interviewQA: [
      {
        question: 'Why is Java called "Platform Independent", but the JVM is "Platform Dependent"?',
        answer: 'Because Java code is compiled into universal Bytecode (.class files) that is identical on every computer. However, the JVM must speak directly to the specific computer processor and operating system. Therefore, Windows needs a Windows JVM, and Mac needs a Mac JVM.',
        frequency: 'CRITICAL'
      },
      {
        question: 'Is Java a 100% pure Object-Oriented language?',
        answer: 'No, because Java still uses 8 primitive data types (like int, byte, boolean, double) that are raw numbers stored directly in memory, instead of being full objects.',
        frequency: 'HIGH'
      },
      {
        question: 'What is the difference between Heap and Stack memory?',
        answer: 'Stack memory stores local variables and method call frames; it is fast and cleaned up as soon as a method returns. Heap memory stores all objects created with "new" and is cleaned up automatically by the Garbage Collector.',
        frequency: 'VERY_HIGH'
      }
    ],
    annotatedProgram: {
      title: 'Inspecting Memory & JVM Runtime',
      filename: 'JVMIntroDemo.java',
      summary: 'A simple program that queries your computer memory and shows how Java allocates objects on the Heap.',
      code: `// Line 01: Main class name must match the filename 'JVMIntroDemo.java'
public class JVMIntroDemo {

    // Line 04: The main entry point where Java starts running our code
    public static void main(String[] args) {
        // Line 06: Print a friendly greeting to the terminal
        System.out.println("Hello from RA-Java! Let us check JVM memory.");

        // Line 09: Ask Java for the current computer runtime information
        Runtime runtime = Runtime.getRuntime();

        // Line 12: A local primitive variable stored on the fast Stack
        int coresAvailable = runtime.availableProcessors();
        System.out.println("CPU Cores available to this JVM: " + coresAvailable);

        // Line 16: Check total heap memory allocated in Megabytes (MB)
        long totalMemoryMB = runtime.totalMemory() / (1024 * 1024);
        long freeMemoryMB = runtime.freeMemory() / (1024 * 1024);

        System.out.println("Total Heap Memory: " + totalMemoryMB + " MB");
        System.out.println("Free Heap Memory:  " + freeMemoryMB + " MB");

        // Line 23: Create an array object. The object lives in the Heap, reference lives on the Stack
        int[] numbers = new int[1000];
        numbers[0] = 42; // Assign value to the first locker

        System.out.println("First element in heap array: " + numbers[0]);
    } // Line 28: Method ends here. Stack variables are wiped clean automatically!
}`
    },
    commonPitfalls: [
      'Confusing JDK and JRE: If you want to write and compile Java code, you need the JDK.',
      'Assuming Java deletes objects immediately: The Garbage Collector runs when it needs to, not on your command.',
      'Thinking Java is purely interpreted: Java uses JIT compilation to turn frequent code into super-fast machine instructions.'
    ],
    quiz: [
      {
        id: 1,
        question: "Which component of Java is responsible for running compiled Bytecode on your computer?",
        options: ["JDK Compiler (javac)", "JVM (Java Virtual Machine)", "Text Editor", "Operating System Terminal"],
        correctIndex: 1,
        explanation: "The JVM (Java Virtual Machine) is the engine that reads universal Bytecode (.class) and executes it on your specific OS."
      },
      {
        id: 2,
        question: "Why is Java called 'Write Once, Run Anywhere'?",
        options: [
          "Java source code compiles into universal Bytecode that any computer with a JVM can execute",
          "Java only works on Windows computers",
          "Java does not need to be compiled",
          "Every computer CPU is identical"
        ],
        correctIndex: 0,
        explanation: "Java source code is compiled by javac into platform-neutral Bytecode, allowing it to run anywhere a JVM is installed."
      },
      {
        id: 3,
        question: "Where does Java store objects created with the 'new' keyword?",
        options: ["Stack Memory", "Heap Memory", "Hard Drive permanently", "CPU Register only"],
        correctIndex: 1,
        explanation: "All dynamically created objects and arrays reside in the Heap and are automatically managed by the Garbage Collector."
      },
      {
        id: 4,
        question: "What is the difference between JDK and JRE?",
        options: [
          "JDK has games, JRE has videos",
          "JDK includes the javac compiler to build code; JRE only has the tools needed to run code",
          "They are 100% identical",
          "JRE includes javac, JDK does not"
        ],
        correctIndex: 1,
        explanation: "Developers install the JDK because it contains javac and tools. End-users only need the JRE to run compiled programs."
      },
      {
        id: 5,
        question: "What is the primary role of the JIT (Just-In-Time) compiler?",
        options: [
          "Checks for spelling errors in comments",
          "Compiles frequently executed 'hotspot' bytecode directly into fast native CPU instructions",
          "Deletes unused files from your computer",
          "Stops the program if a variable is unused"
        ],
        correctIndex: 1,
        explanation: "The JIT compiler detects loops and methods that run frequently and translates them directly into lightning-fast machine code."
      }
    ]
  },

  // =========================================================================
  // TOPIC 2: MAIN METHOD
  // =========================================================================
  'main-method-and-syntax': {
    id: 2,
    slug: 'main-method-and-syntax',
    title: 'Java Program Structure & The Main Method',
    moduleOrder: 1,
    moduleTitle: 'Java Fundamentals',
    estimatedMinutes: 25,
    overview: `Every Java program must have a starting point where the computer begins execution. In Java, this entry point is always the famous method: public static void main(String[] args). In this lesson, we break down every single word in simple English, understand how System.out.println() works, and learn how to print messages and read inputs cleanly.`,
    coreConcepts: [
      {
        title: '1. Why Does Java Need a Main Method?',
        markdown: `When you tell the JVM: *"Run my Java program!"*, the JVM needs to know where to begin. It searches for a method named \`main\` with the exact signature: \`public static void main(String[] args)\`. If this method is missing or misspelled, Java refuses to start!`
      },
      {
        title: '2. Breaking Down "public static void main(String[] args)"',
        markdown: `- **\`public\`**: Open to everyone. The JVM runs from outside your class file, so the main method must be \`public\` for the JVM to see and call it.
- **\`static\`**: No object needed. The JVM can call this method immediately without writing \`new ClassName()\`.
- **\`void\`**: Does not return any value back to the operating system when finished.
- **\`main\`**: The exact keyword identifier the JVM searches for upon startup.
- **\`String[] args\`**: An array of words (command line arguments) that can be passed into your program from the terminal.`
      },
      {
        title: '3. Printing to the Screen: System.out.println() vs print()',
        markdown: `- **\`System\`**: A built-in Java class that connects to your computer system.
- **\`out\`**: The standard output stream (your terminal screen).
- **\`println()\`**: Prints the text and automatically moves the cursor to the **next line** (\`\\n\`).
- **\`print()\`**: Prints the text and leaves the cursor on the **same line**.`
      },
      {
        title: '4. Reading Input with Scanner',
        markdown: `To read what a student or user types on the keyboard:
\`\`\`java
import java.util.Scanner;

Scanner sc = new Scanner(System.in);
String name = sc.nextLine();
System.out.println("Hello, " + name + "! Welcome to Java.");
\`\`\``
      }
    ],
    interviewQA: [
      {
        question: 'What happens if you declare the main method as private instead of public?',
        answer: 'The code will compile without errors. However, at runtime, the JVM will throw a NoSuchMethodError: "Main method not found in class, please define the main method as: public static void main(String[] args)".',
        frequency: 'CRITICAL'
      },
      {
        question: 'Can you overload the main method in Java?',
        answer: 'Yes! You can define multiple main methods with different parameters (e.g. main(int a) or main(String s)), but the JVM will ONLY ever invoke main(String[] args) as the official program entry point.',
        frequency: 'VERY_HIGH'
      },
      {
        question: 'What is the difference between System.out.print() and System.out.println()?',
        answer: 'System.out.print() prints text and keeps the cursor on the same line. System.out.println() prints text and adds a newline character (\\n), moving the cursor to the beginning of the next line.',
        frequency: 'HIGH'
      }
    ],
    annotatedProgram: {
      title: 'Java Structure & Message Output',
      filename: 'MainMethodStructureDemo.java',
      summary: 'Demonstrates the main method entry point, standard printing, and reading a student name with Scanner.',
      code: `// Line 01: Import Scanner utility to read keyboard input from console\nimport java.util.Scanner;\n\n// Line 04: Public class matching the filename \'MainMethodStructureDemo.java\'\npublic class MainMethodStructureDemo {\n\n    // Line 07: Standard JVM main entry point\n    public static void main(String[] args) {\n        // Line 09: Print greeting with automatic newline\n        System.out.println("Welcome to Java Mastery!");\n\n        // Line 12: Print formatted bio card lines\n        System.out.println("Name: Rahul");\n        System.out.println("Role: Software Engineer");\n        System.out.println("Goal: Learn Java 21");\n\n        // Line 17: Interactive Scanner reading\n        Scanner sc = new Scanner(System.in);\n        System.out.print("Enter your nickname: ");\n        if (sc.hasNextLine()) {\n            String nickname = sc.nextLine();\n            System.out.println("Hello, " + nickname + "! Welcome to Java.");\n        }\n        sc.close(); // Clean up scanner resource\n    } // Line 25: Method returns, stack pops\n}`
    },
    commonPitfalls: [
      'Writing \`Main\` with a capital M (Java is case-sensitive; it must be lowercase \`main\`).',
      'Missing \`String[] args\` in the main method signature.',
      'Forgetting to import \`java.util.Scanner\` before trying to use Scanner.'
    ]
  },

  // =========================================================================
  // TOPIC 3: VARIABLES & DATA TYPES
  // =========================================================================
  'variables-and-data-types': {
    id: 3,
    slug: 'variables-and-data-types',
    title: 'Variables, Data Types & Basic Arithmetic',
    moduleOrder: 1,
    moduleTitle: 'Java Fundamentals',
    estimatedMinutes: 35,
    overview: `A variable is simply a named container (or storage box) in memory that holds a piece of information. In Java, every variable must have a declared type before you can use it. This lesson explains the 8 basic built-in data types, how type casting works, and a famous interview trick with numbers between -128 and 127.`,
    coreConcepts: [
      {
        title: '1. The 8 Built-in Primitive Types (From Small to Big)',
        markdown: `Think of primitives as storage boxes of different sizes:
- **Whole Numbers (Integers)**:
  - \`byte\`: Tiny box (1 byte). Stores numbers from -128 to 127.
  - \`short\`: Small box (2 bytes). Stores numbers from -32,768 to 32,767.
  - \`int\`: Normal box (4 bytes). Stores numbers up to ~2 Billion. (Most commonly used!)
  - \`long\`: Giant box (8 bytes). For huge numbers. Must end with an \`L\` (like \`9999999999L\`).
- **Decimal Numbers**:
  - \`float\`: 4 bytes. Must end with an \`f\` (like \`3.14f\`).
  - \`double\`: 8 bytes. Standard decimal type in Java.
- **Characters & Booleans**:
  - \`char\`: 2 bytes. Stores a single character in single quotes (like \`'A'\` or \`'9'\`).
  - \`boolean\`: Stores only \`true\` or \`false\`.`
      },
      {
        title: '2. Type Casting: Moving Values Between Boxes',
        markdown: `What happens when you want to put a value from one type into another?
- **Automatic Widening (Safe)**: Putting a smaller box into a bigger box.
  - Example: \`int x = 25; long y = x;\`
  - Java does this automatically because nothing can spill or get lost.
- **Manual Narrowing (Risky)**: Forcing a bigger box into a smaller box.
  - Example: \`long bigVal = 100L; int smallVal = (int) bigVal;\`
  - You must write \`(int)\`. If the number is too big to fit, it will overflow and give you a weird, unexpected number!`
      },
      {
        title: '3. The Famous Integer Cache Trap (-128 to 127)',
        markdown: `When you create wrapper objects like \`Integer a = 100;\`, Java wants to save memory.
- Java keeps pre-made objects for all numbers from **-128 to 127** in a special cache.
- So \`Integer a = 100; Integer b = 100;\` $\\rightarrow$ \`a == b\` is **TRUE** (they share the same cached object).
- But \`Integer x = 200; Integer y = 200;\` $\\rightarrow$ \`x == y\` is **FALSE** (Java made two separate objects in the Heap!).
- **Student Rule**: Always use \`.equals()\` when comparing objects, never \`==\`!`
      }
    ],
    interviewQA: [
      {
        question: 'Why should you never use float or double for money calculations?',
        answer: 'Because float and double use binary floating-point math, which cannot represent numbers like 0.1 exactly. For example, 0.1 + 0.2 produces 0.30000000000000004! For money or financial systems, always use BigDecimal.',
        frequency: 'CRITICAL'
      },
      {
        question: 'What happens if you write: byte a = 10; byte b = 20; byte c = a + b; ?',
        answer: 'Compilation Error! In Java, whenever you add bytes or shorts, Java automatically converts them to 32-bit int before doing the math. So (a + b) is an int. You must cast it: byte c = (byte)(a + b);',
        frequency: 'VERY_HIGH'
      },
      {
        question: 'What is the default value of local variables in Java?',
        answer: 'Local variables have NO default value! If you declare "int x;" inside a method and try to print it without assigning a value first, Java gives a compile error: "variable x might not have been initialized".',
        frequency: 'HIGH'
      }
    ],
    annotatedProgram: {
      title: 'Variables, Type Casting & Integer Cache',
      filename: 'VariablesAndCastingDemo.java',
      summary: 'Demonstrates primitive types, safe widening, risky narrowing, and comparing Integer objects.',
      code: `// Line 01: Class demonstrating variables, arithmetic, and temp variable swap
import java.util.Scanner;

public class VariablesAndArithmeticDemo {

    public static void main(String[] args) {
        // Line 06: Swap two numbers using a temporary variable (No bitwise XOR!)
        int a = 5;
        int b = 10;
        System.out.println("Before swap: a = " + a + ", b = " + b);

        int temp = a; // Save 'a' into temporary variable
        a = b;        // Put 'b' into 'a'
        b = temp;     // Put 'temp' into 'b'
        System.out.println("After swap: a = " + a + ", b = " + b);

        // Line 16: Celsius to Fahrenheit with double precision
        double celsius = 100.0;
        double fahrenheit = (celsius * 9.0 / 5.0) + 32.0;
        System.out.printf("100C in Fahrenheit: %.2f\n", fahrenheit);

        // Line 21: Rectangle Area & Perimeter
        long length = 5;
        long width = 4;
        long area = length * width;
        long perimeter = 2 * (length + width);
        System.out.println("Area: " + area);
        System.out.println("Perimeter: " + perimeter);
    }
}`
    },
    commonPitfalls: [
      'Using `==` instead of `.equals()` when comparing two `Integer` or `String` objects.',
      'Forgetting that `byte + byte` produces an `int`, causing a compiler error.',
      'Using `float` or `double` for currency calculations instead of `BigDecimal`.'
    ]
  },

  // =========================================================================
  // TOPIC 3: IF-ELSE & DECISION MAKING
  // =========================================================================
  'if-else-statements': {
    id: 4,
    slug: 'if-else-statements',
    title: 'Decision Making & Modern Switch Statements',
    moduleOrder: 2,
    moduleTitle: 'Conditional Statements',
    estimatedMinutes: 25,
    overview: `Programs must make smart decisions based on conditions—just like deciding whether to take an umbrella if it rains. This lesson explains how to write clean if-else statements, why the short-circuit operator (\`&&\`) saves your program from crashing, and how modern Java switch statements make your code look clean and bug-free.`,
    coreConcepts: [
      {
        title: '1. If-Else: Teaching Code How to Choose',
        markdown: `You write conditions using comparison signs (\`>\`, \`<\`, \`==\`, \`!=\`):
\`\`\`java
if (score >= 90) {
    System.out.println("Grade A");
} else if (score >= 75) {
    System.out.println("Grade B");
} else {
    System.out.println("Needs Practice");
}
\`\`\``
      },
      {
        title: '2. The Magic of Short-Circuit Operators (&& and ||)',
        markdown: `Java evaluates conditions from left to right:
- **\`&&\` (AND)**: If the first condition is **false**, Java stops immediately! It doesn't waste time checking the second part because the whole answer is already false.
- **\`||\` (OR)**: If the first condition is **true**, Java stops immediately because only one part needed to be true.
- **Why this saves your life**:
  \`\`\`java
  if (name != null && name.length() > 0)
  \`\`\`
  If \`name\` is \`null\`, Java stops right after the first check. It NEVER calls \`name.length()\`, completely preventing a horrible \`NullPointerException\` crash!`
      },
      {
        title: '3. Modern Java Switch Expressions (Arrow Syntax)',
        markdown: `In modern Java (Java 14+), switch statements are much cleaner using the arrow (\`->\`) syntax:
- You don't need \`break\` statements anymore (no more accidental fall-through bugs!).
- You can return a value directly into a variable.
- You can combine multiple cases: \`case "Sat", "Sun" -> "Weekend";\`.`
      }
    ],
    interviewQA: [
      {
        question: 'What is the difference between & and && in Java?',
        answer: '&& is a short-circuit operator: if the left condition is false, it skips evaluating the right condition. & evaluates both sides no matter what. Always prefer && for safety and speed.',
        frequency: 'CRITICAL'
      },
      {
        question: 'Which data types can be used in a Java switch statement?',
        answer: 'Java switch supports: byte, short, char, int, their wrapper classes, String (since Java 7), and Enums (since Java 5). It does NOT support float, double, or boolean.',
        frequency: 'VERY_HIGH'
      }
    ],
    annotatedProgram: {
      title: 'Decisions, Short-Circuiting & Modern Switch',
      filename: 'DecisionMakingDemo.java',
      summary: 'Demonstrates null-safe checking with short-circuit operators and modern arrow switch expressions.',
      code: `// Line 01: Demonstrates clean conditional branching in Java
public class DecisionMakingDemo {

    // Line 04: Main driver method
    public static void main(String[] args) {
        // Line 06: Student information
        String studentName = "Rahul";
        int score = 85;

        // Line 10: Safe Short-Circuit Null Check:
        // If studentName was null, the first part is false, so .length() is never called!
        if (studentName != null && studentName.length() > 0) {
            System.out.println("Evaluating results for: " + studentName);
        }

        // Line 16: Determine student grade using clean if-else ladder
        char grade;
        if (score >= 90) {
            grade = 'A';
        } else if (score >= 75) {
            grade = 'B';
        } else {
            grade = 'C';
        }
        System.out.println("Final Grade: " + grade);

        // Line 27: Modern Java Switch Expression (Arrow syntax ->)
        // Notice: No break statements required, and it assigns directly to a variable!
        String feedback = switch (grade) {
            case 'A' -> "Outstanding achievement!";
            case 'B' -> "Great job! Keep practicing.";
            case 'C' -> "Review foundational topics.";
            default  -> "Unknown grade.";
        };

        // Line 36: Print the personalized message
        System.out.println("Feedback: " + feedback);
    } // Line 38: End of main method
}`
    },
    commonPitfalls: [
      'Using single `&` instead of `&&` when checking for `null`, causing program crashes.',
      'Trying to use a `double` or `boolean` inside a `switch` statement (not allowed in Java).',
      'Forgetting that `==` compares text references, not the actual letters (always use `.equals()` for Strings).'
    ]
  },

  // =========================================================================
  // TOPIC 4: FOR LOOPS & PATTERNS
  // =========================================================================
  'for-loop': {
    id: 5,
    slug: 'for-loop',
    title: 'For Loops & Pattern Programming',
    moduleOrder: 3,
    moduleTitle: 'Loops & Iterations',
    estimatedMinutes: 30,
    overview: `Loops let you repeat actions automatically without copying and pasting the same code 100 times. If you want to count from 1 to 100, calculate sums, or print star patterns, a for-loop does it in three simple lines. This lesson covers standard for-loops, the for-each loop, and how nested loops work.`,
    coreConcepts: [
      {
        title: '1. Anatomy of a For Loop: The 4 Steps',
        markdown: `\`for (int i = 0; i < 5; i++) { ... }\`
Here is the exact order Java follows:
1. **Start (Initialization)**: \`int i = 0\` runs once at the very beginning.
2. **Check (Condition)**: Is \`i < 5\`? If yes, proceed. If no, exit the loop!
3. **Execute (Body)**: Run the code inside the curly braces \`{ ... }\`.
4. **Step (Update)**: \`i++\` increases \`i\` by 1. Now go back to Step 2!`
      },
      {
        title: '2. The Enhanced For-Each Loop',
        markdown: `When you have an array or list and simply want to inspect every single item:
\`\`\`java
int[] scores = {90, 85, 92};
for (int s : scores) {
    System.out.println(s);
}
\`\`\`
No index counter \`i\`, no length checks—clean and impossible to get an out-of-bounds error!`
      },
      {
        title: '3. Nested Loops (Loop inside a Loop)',
        markdown: `When one loop is placed inside another loop:
- The **outer loop** controls rows.
- The **inner loop** controls columns.
- For every 1 turn of the outer loop, the inner loop runs completely through all its turns. This is how you print 2D grids, tables, and star patterns!`
      }
    ],
    interviewQA: [
      {
        question: 'What is the time complexity of two nested loops of size N?',
        answer: 'It is O(N^2) (Quadratic Time), because the inner loop runs N times for each of the N iterations of the outer loop (total operations = N * N).',
        frequency: 'CRITICAL'
      },
      {
        question: 'What happens if you omit all three parts of a for loop: for (;;) ?',
        answer: 'It creates an infinite loop that runs forever until stopped by a break statement, return, or exception.',
        frequency: 'HIGH'
      }
    ],
    annotatedProgram: {
      title: 'Counting, For-Each & Triangle Patterns',
      filename: 'ForLoopDemo.java',
      summary: 'Demonstrates counting with standard for-loops, enhanced for-each traversal, and printing a clean star pattern.',
      code: `// Line 01: Demonstrates standard and nested loop patterns
public class ForLoopDemo {

    // Line 04: Main entry point
    public static void main(String[] args) {
        // Line 06: Example 1 - Calculate sum of first 5 natural numbers (1 to 5)
        int totalSum = 0;
        for (int i = 1; i <= 5; i++) {
            totalSum += i; // Add current number to running total
        }
        System.out.println("Sum of numbers 1 to 5: " + totalSum);

        // Line 13: Example 2 - Enhanced for-each loop over an array
        int[] primeNumbers = {2, 3, 5, 7, 11};
        System.out.print("Prime numbers: ");
        for (int p : primeNumbers) {
            System.out.print(p + " ");
        }
        System.out.println();

        // Line 21: Example 3 - Nested loops to print a right-angled triangle pattern
        int rows = 4;
        System.out.println("Star Triangle Pattern:");
        for (int r = 1; r <= rows; r++) {
            // Inner loop prints 'r' stars on row 'r'
            for (int c = 1; c <= r; c++) {
                System.out.print("* ");
            }
            // Move to next line after completing the row
            System.out.println();
        }
    } // Line 32: Main method finishes
}`
    },
    commonPitfalls: [
      'Off-by-one errors: Writing `i <= arr.length` instead of `i < arr.length`, causing an `ArrayIndexOutOfBoundsException`.',
      'Accidentally putting a semicolon after the loop header: `for (int i=0; i<10; i++); { ... }` which executes an empty loop.',
      'Modifying a list directly while looping over it with for-each (causes `ConcurrentModificationException`).'
    ]
  },

  // =========================================================================
  // TOPIC 5: WHILE & DO-WHILE LOOPS
  // =========================================================================
  'while-and-do-while-loops': {
    id: 6,
    slug: 'while-and-do-while-loops',
    title: 'While & Do-While Loops',
    moduleOrder: 3,
    moduleTitle: 'Loops & Iterations',
    estimatedMinutes: 25,
    overview: `Use a \`for\` loop when you already know in advance how many times you want to repeat. But what if you don't know the exact count? For example: "Keep asking the user for their PIN until it is correct" or "Extract digits of a number until zero is left." That is exactly what \`while\` and \`do-while\` loops are built for!`,
    coreConcepts: [
      {
        title: '1. The While Loop: Check First, Then Run',
        markdown: `\`while (condition) { ... }\`
- Java checks the condition **before** doing anything.
- If the condition is false right from the start, the loop body does **not run even once**!`
      },
      {
        title: '2. The Do-While Loop: Run First, Then Check',
        markdown: `\`do { ... } while (condition);\`
- Java runs the code inside the curly braces **first**, and only checks the condition at the end.
- **Guarantee**: A do-while loop is guaranteed to run **at least once**, no matter what! Perfect for interactive menus.`
      },
      {
        title: '3. Break vs Continue: Taking Control',
        markdown: `- **\`break\`**: Emergency stop! Immediately exits the loop completely.
- **\`continue\`**: Skip ahead! Skips whatever is left in the current turn and jumps straight to the next iteration.`
      }
    ],
    interviewQA: [
      {
        question: 'What is the main difference between a while loop and a do-while loop?',
        answer: 'A while loop checks its condition at the entry point and might run zero times. A do-while loop checks its condition at the exit point and is guaranteed to run at least once.',
        frequency: 'CRITICAL'
      },
      {
        question: 'How do you extract the digits of a number using a while loop?',
        answer: 'While the number > 0: take the last digit using (num % 10), process it, and remove the last digit using (num = num / 10).',
        frequency: 'HIGH'
      }
    ],
    annotatedProgram: {
      title: 'Digit Reversal & Interactive Menus',
      filename: 'WhileLoopDemo.java',
      summary: 'Demonstrates reversing a number using a while loop and running a menu with a do-while loop.',
      code: `// Line 01: Demonstrates while and do-while loop execution
public class WhileLoopDemo {

    // Line 04: Main execution method
    public static void main(String[] args) {
        // Line 06: Example 1 - Reverse a number using a while loop
        int originalNumber = 12345;
        int remaining = originalNumber;
        int reversed = 0;

        // Keep running until all digits have been processed
        while (remaining > 0) {
            int lastDigit = remaining % 10;   // Extract the last digit (e.g. 5)
            reversed = (reversed * 10) + lastDigit; // Shift left and append digit
            remaining = remaining / 10;       // Remove the last digit
        }
        System.out.println("Original: " + originalNumber + " | Reversed: " + reversed);

        // Line 19: Example 2 - Do-While loop runs at least once
        int attempts = 0;
        do {
            attempts++;
            System.out.println("Processing login attempt: " + attempts);
        } while (attempts < 1); // Condition is false after first run, but it ran once!

        System.out.println("Total attempts completed: " + attempts);
    } // Line 27: Method ends
}`
    },
    commonPitfalls: [
      'Forgetting to update the loop variable (like `num = num / 10`), creating an accidental infinite loop.',
      'Forgetting the semicolon at the end of a do-while statement: `do { ... } while (condition);`.',
      'Confusing `break` (leaves the whole loop) with `continue` (just skips the rest of current turn).'
    ]
  },

  // =========================================================================
  // TOPIC 6: METHODS & RECURSION
  // =========================================================================
  'methods-declaration': {
    id: 7,
    slug: 'methods-declaration',
    title: 'Methods, Pass-By-Value & Recursion',
    moduleOrder: 4,
    moduleTitle: 'Methods & Functions',
    estimatedMinutes: 35,
    overview: `A method is like a reusable recipe with a name. You pass it inputs (parameters), it does the work, and it hands you back a result (return value). In this lesson, we will learn how methods organize your code, understand why Java is ALWAYS "Pass-By-Value", and master Recursion (when a method solves a big problem by calling a smaller version of itself).`,
    coreConcepts: [
      {
        title: '1. Anatomy of a Java Method',
        markdown: `\`public static int calculateSum(int a, int b) { return a + b; }\`
- **\`public\`**: Anyone can call this method.
- **\`static\`**: Belongs to the class itself (you can call it without creating an object with \`new\`).
- **\`int\`**: The type of value it returns (use \`void\` if it returns nothing).
- **\`calculateSum\`**: The name of the method.
- **\`(int a, int b)\`**: The inputs it requires.`
      },
      {
        title: '2. The Golden Rule: Java is ALWAYS Pass-by-Value!',
        markdown: `When you pass a variable into a method:
- Java **makes a copy** of that variable's value and gives the copy to the method.
- If the method changes a primitive variable inside, the original variable outside **never changes**!
- If you pass an object reference (like an array or list), Java copies the reference address, so modifying elements *inside* that object affects the original object.`
      },
      {
        title: '3. Recursion Made Simple (Two Golden Parts)',
        markdown: `Recursion is when a function calls itself. Every good recursive function MUST have:
1. **The Base Case (The Stop Sign)**: When should the function stop? Without this, it calls itself forever until memory runs out and crashes with a \`StackOverflowError\`!
2. **The Recursive Step**: Doing one small step of work and calling itself to solve the rest of the problem.`
      }
    ],
    interviewQA: [
      {
        question: 'Is Java pass-by-reference or pass-by-value?',
        answer: 'Java is strictly pass-by-value, always! When you pass an object, Java copies the value of the object reference (memory address), not the actual object itself.',
        frequency: 'CRITICAL'
      },
      {
        question: 'What causes a java.lang.StackOverflowError?',
        answer: 'Excessive or infinite recursive method calls where the base case is missing or never reached, filling up all available Stack memory frames.',
        frequency: 'VERY_HIGH'
      }
    ],
    annotatedProgram: {
      title: 'Pass-by-Value & Recursive Factorial',
      filename: 'MethodsAndRecursionDemo.java',
      summary: 'Demonstrates that primitives do not change when passed to methods, and computes factorial recursively with a safe base condition.',
      code: `// Line 01: Demonstrates Java methods, parameter passing, and recursion
public class MethodsAndRecursionDemo {

    // Line 04: A helper method that attempts to modify a primitive parameter
    public static void tryToModify(int number) {
        number = number + 100; // Modifies only the local copy on this method's Stack frame!
    }

    // Line 09: Recursive method to calculate Factorial: N! = N * (N - 1)!
    public static long calculateFactorial(int n) {
        // Line 11: The Base Case (Stop Sign) - 0! and 1! are equal to 1
        if (n <= 1) {
            return 1;
        }
        // Line 15: Recursive Step - multiply N by the factorial of (N - 1)
        return n * calculateFactorial(n - 1);
    }

    // Line 19: Main driver method
    public static void main(String[] args) {
        int originalValue = 50;

        // Line 23: Demonstrate Pass-By-Value
        tryToModify(originalValue);
        // Output is still 50! The original was never modified.
        System.out.println("Value after tryToModify call: " + originalValue);

        // Line 28: Calculate factorial of 5: 5 * 4 * 3 * 2 * 1 = 120
        long fact5 = calculateFactorial(5);
        System.out.println("Factorial of 5: " + fact5);
    } // Line 32: End of program
}`
    },
    commonPitfalls: [
      'Forgetting the recursive base case, which instantly causes a `StackOverflowError`.',
      'Expecting a method to swap two numbers using `void swap(int a, int b)` (impossible because Java is pass-by-value).',
      'Re-calculating the same sub-problems in recursion (like plain Fibonacci) leading to slow $O(2^N)$ time.'
    ]
  },

  // =========================================================================
  // TOPIC 7: ARRAYS & SEARCHING ALGORITHMS
  // =========================================================================
  'array-algorithms': {
    id: 8,
    slug: 'array-algorithms',
    title: 'Arrays, Searching & Sorting',
    moduleOrder: 5,
    moduleTitle: 'Data Structures: Arrays',
    estimatedMinutes: 35,
    overview: `An array is a row of storage lockers placed side-by-side in memory. Every locker holds the same type of data, and each has an index number starting from 0. This lesson explains how arrays are stored in memory, how to search through them with Linear and Binary Search, and the powerful Two-Pointer technique.`,
    coreConcepts: [
      {
        title: '1. How Arrays Work in Memory',
        markdown: `In Java, an array is an object stored in the Heap:
- All elements sit right next to each other in memory (contiguous).
- Because they are side-by-side, jumping to any element by index (like \`arr[3]\`) is **instant** ($O(1)$ time!).
- **Limitation**: The size of an array is fixed when you create it. If you need a list that grows dynamically, you use an \`ArrayList\`.`
      },
      {
        title: '2. Linear Search vs Binary Search',
        markdown: `- **Linear Search ($O(N)$)**: Looks through every locker from start to end until it finds the target. Simple, but slow for big arrays.
- **Binary Search ($O(\\log N)$)**: Only works if the array is **already sorted**! Look at the middle element. If your target is smaller, ignore the right half. If bigger, ignore the left half. Cuts the problem in half every single step—lightning fast!`
      },
      {
        title: '3. The Two-Pointer Technique (Interview Favorite!)',
        markdown: `Instead of using nested loops, place one pointer at the start (\`left = 0\`) and one at the end (\`right = arr.length - 1\`).
- Move them toward each other to reverse an array, check if a word is a palindrome, or find pairs that add up to a target sum in $O(N)$ time!`
      }
    ],
    interviewQA: [
      {
        question: 'Why do array indices start at 0 instead of 1?',
        answer: 'Because an index represents an offset from the memory starting address of the array. The first element is at (BaseAddress + 0 * elementSize), so its offset is 0.',
        frequency: 'HIGH'
      },
      {
        question: 'What is the precondition for performing Binary Search?',
        answer: 'The array or collection MUST be sorted in ascending or descending order. Binary search fails on unsorted data.',
        frequency: 'CRITICAL'
      }
    ],
    annotatedProgram: {
      title: 'Array Reversal & Binary Search',
      filename: 'ArrayAlgorithmsDemo.java',
      summary: 'Demonstrates in-place array reversal using two pointers and finding an item using binary search.',
      code: `// Line 01: Class demonstrating core array operations
public class ArrayAlgorithmsDemo {

    // Line 04: Two-pointer technique to reverse an array in-place (O(N) time, O(1) space)
    public static void reverseArray(int[] arr) {
        int left = 0;
        int right = arr.length - 1;
        while (left < right) {
            // Swap values at left and right
            int temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            // Move pointers inward
            left++;
            right--;
        }
    }

    // Line 18: Binary Search algorithm on a sorted array
    public static int binarySearch(int[] arr, int target) {
        int low = 0;
        int high = arr.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2; // Prevents integer overflow bug!
            if (arr[mid] == target) {
                return mid; // Target found at index 'mid'
            } else if (arr[mid] < target) {
                low = mid + 1; // Look in the right half
            } else {
                high = mid - 1; // Look in the left half
            }
        }
        return -1; // Target not found
    }

    // Line 36: Main driver
    public static void main(String[] args) {
        int[] sortedNumbers = {10, 20, 30, 40, 50, 60, 70};

        // Search for 40
        int foundIndex = binarySearch(sortedNumbers, 40);
        System.out.println("Index of 40: " + foundIndex);

        // Reverse the array
        reverseArray(sortedNumbers);
        System.out.println("First element after reversal: " + sortedNumbers[0]);
    }
}`
    },
    commonPitfalls: [
      'Calculating `mid = (low + high) / 2` instead of `low + (high - low) / 2`, which can overflow 32-bit integers on huge arrays.',
      'Attempting to change the length of an array after creation (arrays are fixed size).',
      'Forgetting that arrays use `.length` (a property), whereas Strings use `.length()` (a method).'
    ]
  },

  // =========================================================================
  // TOPIC 8: STRINGS & STRINGBUILDER
  // =========================================================================
  'string-internals': {
    id: 9,
    slug: 'string-internals',
    title: 'Strings, Immutability & StringBuilder',
    moduleOrder: 6,
    moduleTitle: 'Data Structures: Strings',
    estimatedMinutes: 30,
    overview: `Strings represent words and text in Java. But unlike other variables, Java treats Strings in a very special way to save memory. In this lesson, we will understand why Strings are "Immutable" (they can never be changed), how the String Pool works, and why using \`StringBuilder\` makes your programs 100x faster.`,
    coreConcepts: [
      {
        title: '1. Why Strings are "Immutable" (Unchangeable)',
        markdown: `Once you create a String object in memory, its letters can **NEVER be modified**:
- If you write: \`String s = "Hello"; s = s + " World";\`
- Java does **NOT** modify the original \`"Hello"\`. Instead, Java creates a brand new String \`"Hello World"\` in the Heap and points \`s\` to the new one!
- **Why?**: Immutability makes Strings completely thread-safe and allows Java to safely share the same string across the entire application.`
      },
      {
        title: '2. The String Constant Pool (Memory Saver)',
        markdown: `To save computer memory:
- If 100 different parts of your app write \`String s = "Java";\`, Java creates **only ONE** \`"Java"\` string in a special storage area called the **String Pool**. All 100 variables point to that exact same object!
- But if you write \`new String("Java")\`, you tell Java: *"Ignore the pool, create a brand new object on the Heap!"*`
      },
      {
        title: '3. Why You Must Use StringBuilder in Loops',
        markdown: `If you concatenate strings inside a loop using \`+\`:
\`\`\`java
String s = "";
for (int i = 0; i < 1000; i++) { s = s + i; }
\`\`\`
This creates 1,000 throwaway temporary objects in memory, which is horribly slow!
**The Solution**: Use **\`StringBuilder\`**. It modifies the same memory buffer in-place without creating unnecessary objects.`
      }
    ],
    interviewQA: [
      {
        question: 'What is the difference between == and .equals() for Strings?',
        answer: '== compares memory addresses (checks if both point to the exact same object). .equals() compares the actual text characters inside. Always use .equals() to compare string content!',
        frequency: 'CRITICAL'
      },
      {
        question: 'What is the difference between String, StringBuilder, and StringBuffer?',
        answer: 'String is immutable (cannot be changed). StringBuilder is mutable and fast (not thread-safe). StringBuffer is mutable and thread-safe (synchronized, slightly slower).',
        frequency: 'VERY_HIGH'
      }
    ],
    annotatedProgram: {
      title: 'String Pool, Equality & StringBuilder',
      filename: 'StringInternalsDemo.java',
      summary: 'Demonstrates literal pooling, reference equality vs text equality, and building strings efficiently.',
      code: `// Line 01: Demonstrates String memory pooling and mutable StringBuilder
public class StringInternalsDemo {

    // Line 04: Main driver method
    public static void main(String[] args) {
        // Line 06: String literals share the same object in the String Pool
        String str1 = "Java";
        String str2 = "Java";

        // Line 10: 'new' keyword forces a brand new object in Heap memory
        String str3 = new String("Java");

        // Line 13: Compare memory addresses using '=='
        System.out.println("str1 == str2 (Pool): " + (str1 == str2)); // TRUE
        System.out.println("str1 == str3 (Heap): " + (str1 == str3)); // FALSE

        // Line 17: Compare actual text content using .equals()
        System.out.println("str1.equals(str3):   " + str1.equals(str3)); // TRUE

        // Line 20: Efficient string concatenation with StringBuilder
        StringBuilder sb = new StringBuilder();
        sb.append("Learning ");
        sb.append("Java ");
        sb.append("with RA-Java!");

        String finalResult = sb.toString();
        System.out.println("StringBuilder output: " + finalResult);
    }
}`
    },
    commonPitfalls: [
      'Using `==` to compare String values instead of `.equals()`.',
      'Using `+` inside a loop to concatenate strings instead of using `StringBuilder`.',
      'Thinking that `str.toUpperCase()` modifies `str` (it returns a new string; original is unchanged!).'
    ]
  },

  // =========================================================================
  // TOPIC 9: OBJECT-ORIENTED PROGRAMMING (OOP)
  // =========================================================================
  'polymorphism-inheritance': {
    id: 10,
    slug: 'polymorphism-inheritance',
    title: 'Object-Oriented Programming (The 4 Pillars)',
    moduleOrder: 7,
    moduleTitle: 'Object-Oriented Programming',
    estimatedMinutes: 40,
    overview: `OOP (Object-Oriented Programming) is a way of designing software by modeling real-world concepts as "Objects". Think of a Class as an architectural blueprint, and an Object as the actual physical house built from that blueprint. In this lesson, we will master the 4 Pillars of OOP in crystal-clear, plain English.`,
    coreConcepts: [
      {
        title: '1. The 4 Pillars of OOP in Everyday English',
        markdown: `1. **Encapsulation (Data Protection)**:
   - Keeping variables \`private\` and giving access only through \`public\` getters and setters.
   - *Everyday Analogy*: An ATM machine. You cannot open the vault with your hands; you interact safely through the screen and buttons.
2. **Inheritance (Reusing Code)**:
   - A child class inherits methods and variables from a parent class using \`extends\`.
   - *Everyday Analogy*: A \`Car\` inherits wheels and an engine from \`Vehicle\`.
3. **Polymorphism ("Many Forms")**:
   - One action behaves differently depending on who is performing it.
   - *Everyday Analogy*: Pressing a "Start" button starts a Car, a Laptop, or a Microwave in different ways.
4. **Abstraction (Hiding Complex Wiring)**:
   - Showing only essential buttons and hiding how things work inside.
   - *Everyday Analogy*: You drive a car by pressing the accelerator pedal; you don't need to know how fuel injectors work under the hood.`
      },
      {
        title: '2. Method Overloading vs Method Overriding',
        markdown: `- **Overloading (Compile-Time)**: Same method name with different parameters inside the *same class* (e.g. \`add(int, int)\` and \`add(double, double)\`).
- **Overriding (Runtime)**: A child class replaces a method it inherited from its parent to provide its own custom behavior (using the \`@Override\` annotation).`
      }
    ],
    interviewQA: [
      {
        question: 'Can you override a private or static method in Java?',
        answer: 'No! Private methods are not visible to child classes, and static methods belong to the class itself, not an instance (they are hidden, not overridden).',
        frequency: 'CRITICAL'
      },
      {
        question: 'What is the difference between an Abstract Class and an Interface?',
        answer: 'An interface defines a pure contract of what a class can do (supports multiple inheritance). An abstract class defines what an object is and can have instance state, constructors, and partial implementation.',
        frequency: 'VERY_HIGH'
      }
    ],
    annotatedProgram: {
      title: 'Encapsulation, Inheritance & Polymorphism',
      filename: 'OOPPillarsDemo.java',
      summary: 'Demonstrates private encapsulated fields, an inherited parent class, and runtime polymorphic method calls.',
      code: `// Line 01: Demonstrates the 4 pillars of OOP
public class OOPPillarsDemo {

    // Line 04: Abstract parent class representing any Bank Account
    abstract static class BankAccount {
        // Line 06: Encapsulated private field - protected from unauthorized direct tampering
        private double balance;

        public BankAccount(double initialBalance) {
            this.balance = initialBalance;
        }

        // Getter provides controlled read access
        public double getBalance() {
            return this.balance;
        }

        // Controlled deposit logic
        public void deposit(double amount) {
            if (amount > 0) {
                this.balance += amount;
            }
        }

        // Line 22: Abstract method that each child class must implement differently
        public abstract void applyInterest();
    }

    // Line 26: Child class inherits from BankAccount using 'extends'
    static class SavingsAccount extends BankAccount {
        public SavingsAccount(double initialBalance) {
            super(initialBalance);
        }

        // Line 32: Polymorphic method override
        @Override
        public void applyInterest() {
            deposit(getBalance() * 0.05); // Add 5% interest
        }
    }

    // Line 39: Main driver
    public static void main(String[] args) {
        // Line 41: Polymorphism: Parent reference holds Child object
        BankAccount account = new SavingsAccount(1000.0);
        account.applyInterest();
        System.out.println("Balance after interest: $" + account.getBalance());
    }
}`
    },
    commonPitfalls: [
      'Making class fields `public` instead of `private`, breaking encapsulation.',
      'Forgetting the `super()` call in a child constructor when the parent has no default constructor.',
      'Confusing Overloading (same class, different arguments) with Overriding (child class, same signature).'
    ]
  },

  // =========================================================================
  // TOPIC 10: EXCEPTIONS & ERROR HANDLING
  // =========================================================================
  'exception-architecture': {
    id: 11,
    slug: 'exception-architecture',
    title: 'Exceptions & Error Handling',
    moduleOrder: 8,
    moduleTitle: 'Exception Architecture',
    estimatedMinutes: 30,
    overview: `An exception is an unexpected problem that happens while your code is running—like trying to open a file that does not exist, dividing a number by zero, or accessing an array index that is out of bounds. Instead of letting your program crash, Java lets you catch errors safely and handle them smoothly.`,
    coreConcepts: [
      {
        title: '1. Checked vs Unchecked Exceptions',
        markdown: `- **Checked Exceptions (Compile-Time)**:
  - Serious external problems that Java forces you to prepare for (like \`IOException\` or \`SQLException\`).
  - The code will not even compile unless you wrap it in a \`try-catch\` or declare \`throws\`.
- **Unchecked Exceptions (Runtime / Bugs)**:
  - Mistakes in your own program logic (like \`NullPointerException\` or \`ArrayIndexOutOfBoundsException\`).
  - The compiler doesn't force you to catch them; you fix them by writing bug-free code.`
      },
      {
        title: '2. The Try-Catch-Finally Block',
        markdown: `- **\`try { ... }\`**: Put the risky code that might throw an error here.
- **\`catch (Exception e) { ... }\`**: If an error happens, Java jumps here to handle it without crashing.
- **\`finally { ... }\`**: This block **ALWAYS runs**, whether an error occurred or not! Perfect for closing database connections or files.`
      },
      {
        title: '3. Try-with-Resources (Modern Java)',
        markdown: `Instead of manually closing files in a finally block:
\`\`\`java
try (Scanner sc = new Scanner(System.in)) {
    // Read data safely
}
\`\`\`
Java automatically closes the scanner when finished, preventing memory leaks!`
      }
    ],
    interviewQA: [
      {
        question: 'What is the difference between final, finally, and finalize in Java?',
        answer: 'final is a keyword to declare constants, prevent inheritance, or prevent method overriding. finally is a block that always executes after try-catch. finalize was an old cleanup method on Object (now deprecated in modern Java).',
        frequency: 'CRITICAL'
      },
      {
        question: 'Can a finally block ever be skipped?',
        answer: 'Yes, only if the JVM is forcibly stopped by calling System.exit(0) or if a fatal OS/hardware crash occurs.',
        frequency: 'VERY_HIGH'
      }
    ],
    annotatedProgram: {
      title: 'Safe Division & Try-With-Resources',
      filename: 'ExceptionHandlingDemo.java',
      summary: 'Demonstrates catching arithmetic errors safely and using try-with-resources for automatic cleanup.',
      code: `// Line 01: Demonstrates graceful exception handling in Java
public class ExceptionHandlingDemo {

    // Line 04: Method that performs division safely without crashing
    public static int safeDivide(int numerator, int denominator) {
        try {
            // Line 07: Risky operation that throws ArithmeticException if denominator is 0
            return numerator / denominator;
        } catch (ArithmeticException e) {
            // Line 10: Gracefully catch the error and return a safe fallback value
            System.out.println("Warning: Division by zero caught! Returning 0.");
            return 0;
        } finally {
            // Line 14: This block executes every single time
            System.out.println("safeDivide calculation finished.");
        }
    }

    // Line 19: Main driver
    public static void main(String[] args) {
        System.out.println("Result 1: " + safeDivide(10, 2));
        System.out.println("Result 2: " + safeDivide(10, 0));
    }
}`
    },
    commonPitfalls: [
      'Catching generic `Exception` everywhere and swallowing it silently with an empty block.',
      'Putting cleanup code outside a `finally` or `try-with-resources` block, causing memory leaks.',
      'Throwing raw `RuntimeException` instead of descriptive exceptions.'
    ]
  },

  // =========================================================================
  // TOPIC 11: COLLECTIONS & HASHMAP
  // =========================================================================
  'hashmap-internals': {
    id: 12,
    slug: 'hashmap-internals',
    title: 'Collections Framework & HashMap Internals',
    moduleOrder: 9,
    moduleTitle: 'Collections Framework',
    estimatedMinutes: 35,
    overview: `Regular arrays have a fixed size that cannot change. The Java Collections Framework provides smart data structures like ArrayList (a list that grows automatically) and HashMap (a super-fast phonebook lookup table). In this lesson, we will uncover how HashMap works under the hood—a favorite topic in technical interviews!`,
    coreConcepts: [
      {
        title: '1. ArrayList vs LinkedList',
        markdown: `- **ArrayList**: Backed by a normal array. Getting an element by index \`list.get(5)\` is **instant** ($O(1)$). But inserting or deleting in the middle is slow ($O(N)$) because elements must shift.
- **LinkedList**: Elements are chained together like train cars. Adding or removing from the ends is fast, but jumping to an index is slow because you must walk through the chain.`
      },
      {
        title: '2. How HashMap Works Under the Hood (Interview Favorite!)',
        markdown: `A HashMap stores key-value pairs (like a phonebook: \`Name -> Phone Number\`):
1. When you call \`map.put(key, value)\`, Java calculates \`key.hashCode()\`.
2. It uses that number to find the right **bucket** (an array slot).
3. If two different keys land in the exact same bucket (called a **Collision**), Java links them in a LinkedList.
4. **Java 8 Optimization**: If a bucket gets more than 8 elements, Java converts the LinkedList into a fast **Red-Black Tree**, keeping search speeds blazing fast!`
      },
      {
        title: '3. The hashCode() and equals() Contract',
        markdown: `If you create a custom class and use it as a key in a HashMap:
- If two objects are equal according to \`.equals()\`, they **MUST return the exact same \`hashCode()\`**!
- If you break this rule, your HashMap will fail to find items you just stored in it.`
      }
    ],
    interviewQA: [
      {
        question: 'What is the average time complexity of get() and put() in a HashMap?',
        answer: 'O(1) (Constant Time) on average, because hash codes map directly to bucket indices.',
        frequency: 'CRITICAL'
      },
      {
        question: 'What happens in a HashMap when two different keys have the same hash code?',
        answer: 'This is called a Hash Collision. Both entries are stored in the same bucket using a linked list (or balanced red-black tree if the chain exceeds 8 elements in Java 8+).',
        frequency: 'CRITICAL'
      }
    ],
    annotatedProgram: {
      title: 'Word Frequency Counter with HashMap',
      filename: 'HashMapInternalsDemo.java',
      summary: 'Demonstrates counting word occurrences using a HashMap and retrieving values in O(1) time.',
      code: `// Line 01: Import standard Java collection classes
import java.util.HashMap;
import java.util.Map;

public class HashMapInternalsDemo {

    public static void main(String[] args) {
        // Line 08: Create a HashMap mapping a String (Word) to an Integer (Count)
        Map<String, Integer> wordFrequency = new HashMap<>();

        String[] words = {"java", "code", "java", "learn", "code", "java"};

        // Line 13: Count frequency of each word using getOrDefault
        for (String w : words) {
            wordFrequency.put(w, wordFrequency.getOrDefault(w, 0) + 1);
        }

        // Line 18: Print the word counts
        for (Map.Entry<String, Integer> entry : wordFrequency.entrySet()) {
            System.out.println("Word: '" + entry.getKey() + "' appeared " + entry.getValue() + " times");
        }

        // Line 23: Fast O(1) key lookup
        System.out.println("Does 'java' exist? " + wordFrequency.containsKey("java"));
    }
}`
    },
    commonPitfalls: [
      'Overriding `equals()` in a custom class without also overriding `hashCode()`.',
      'Using a mutable object as a HashMap key (if its fields change, its hash code changes and it gets lost!).',
      'Assuming HashMap maintains insertion order (use `LinkedHashMap` if you need order).'
    ]
  },

  // =========================================================================
  // TOPIC 12: STREAMS & LAMBDAS
  // =========================================================================
  'stream-api-lambdas': {
    id: 13,
    slug: 'stream-api-lambdas',
    title: 'Lambda Expressions & Stream API',
    moduleOrder: 10,
    moduleTitle: 'Modern Java (Java 8+)',
    estimatedMinutes: 30,
    overview: `Before Java 8, filtering or transforming lists required writing long for-loops with lots of boilerplate code. Java 8 introduced Lambdas (short, one-line functions) and the Stream API (a way to process collections like an assembly line in a modern factory). In this lesson, we will write clean, professional modern Java code!`,
    coreConcepts: [
      {
        title: '1. What is a Lambda Expression?',
        markdown: `A lambda is simply an anonymous function (a function without a name) that you can pass around like data:
- Instead of writing 6 lines of anonymous class code:
  \`\`\`java
  // Traditional way:
  Runnable r = new Runnable() { public void run() { System.out.println("Hi"); } };
  // Modern Lambda way:
  Runnable r = () -> System.out.println("Hi");
  \`\`\``
      },
      {
        title: '2. The 3 Steps of the Stream Pipeline',
        markdown: `Think of a Stream like a conveyor belt:
1. **Source**: Turn your list into a stream (\`numbers.stream()\`).
2. **Intermediate Operations (Transformations)**:
   - \`filter(n -> n % 2 == 0)\`: Keep only even numbers.
   - \`map(n -> n * n)\`: Square each number.
   - \`sorted()\`: Sort them.
3. **Terminal Operation (Collect results)**:
   - \`.toList()\`: Collect into a new list.
   - \`.count()\`: Count elements.`
      },
      {
        title: '3. Streams are Lazy!',
        markdown: `Intermediate operations (like \`filter\` and \`map\`) do **NOT** run immediately! They wait until a **terminal operation** (like \`.toList()\` or \`.forEach()\`) is called. If you never call a terminal operation, the stream does zero work.`
      }
    ],
    interviewQA: [
      {
        question: 'What is the difference between map() and filter() in Java Streams?',
        answer: 'filter() takes a condition and keeps or rejects elements without changing them. map() takes a function and transforms each element into a new value.',
        frequency: 'CRITICAL'
      },
      {
        question: 'Can a Java Stream be reused once consumed?',
        answer: 'No! A stream can only be traversed once. Calling another operation on a closed stream throws IllegalStateException: stream has already been operated upon.',
        frequency: 'VERY_HIGH'
      }
    ],
    annotatedProgram: {
      title: 'Filtering, Transforming & Collecting with Streams',
      filename: 'StreamApiDemo.java',
      summary: 'Demonstrates filtering even numbers, squaring them with map, and collecting the final list.',
      code: `// Line 01: Import modern collection and stream packages
import java.util.List;

public class StreamApiDemo {

    public static void main(String[] args) {
        List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6, 7, 8);

        // Line 09: Modern functional pipeline:
        // 1. Convert to stream
        // 2. Filter: keep only even numbers
        // 3. Map: square each number
        // 4. Collect: into a new clean list
        List<Integer> squaredEvens = numbers.stream()
                .filter(n -> n % 2 == 0) // Keeps: 2, 4, 6, 8
                .map(n -> n * n)         // Squares: 4, 16, 36, 64
                .toList();

        System.out.println("Squared even numbers: " + squaredEvens);
    }
}`
    },
    commonPitfalls: [
      'Trying to reuse a stream after a terminal operation has already executed.',
      'Modifying the underlying collection while streaming over it.',
      'Using parallel streams on small collections, which actually slows down performance due to thread coordination overhead.'
    ]
  },

  // =========================================================================
  // TOPIC 13: MULTITHREADING & CONCURRENCY
  // =========================================================================
  'concurrency-sync': {
    id: 14,
    slug: 'concurrency-sync',
    title: 'Multithreading & Concurrency',
    moduleOrder: 11,
    moduleTitle: 'Concurrency & Multithreading',
    estimatedMinutes: 35,
    overview: `A normal program runs on a single thread (like one chef working alone in a kitchen doing one task at a time). Multithreading allows your program to use multiple CPU cores at the exact same time (like having 4 chefs cooking different dishes simultaneously). This lesson explains how to create threads safely and avoid bugs like Race Conditions and Deadlocks.`,
    coreConcepts: [
      {
        title: '1. Process vs Thread',
        markdown: `- **Process**: A whole running application (like Spotify or Chrome). It has its own isolated memory space.
- **Thread**: A worker inside an application. Multiple threads inside the same Java program share the same Heap memory!`
      },
      {
        title: '2. Race Conditions & The "synchronized" Lock',
        markdown: `- **Race Condition**: If two chefs try to write in the same recipe book at the exact same millisecond, they overwrite each other's work and ruin the recipe!
- **Fix**: Use the \`synchronized\` keyword. It puts a lock on a method so **only one thread can enter at a time**. Other threads must wait their turn politely outside.`
      },
      {
        title: '3. What is a Deadlock? (The Standoff)',
        markdown: `- Imagine Thread A is holding Key 1 and waiting for Key 2.
- At the exact same time, Thread B is holding Key 2 and waiting for Key 1.
- Both threads freeze forever waiting for each other!
- **Fix**: Always acquire locks in the exact same order across all threads.`
      }
    ],
    interviewQA: [
      {
        question: 'What is the difference between t.start() and t.run()?',
        answer: 't.start() creates a new operating system thread and runs the code concurrently. Calling t.run() executes the code on the current thread just like a normal method call without multithreading.',
        frequency: 'CRITICAL'
      },
      {
        question: 'What is a Race Condition in Java?',
        answer: 'A bug that occurs when two or more threads attempt to read and write shared data at the same time without proper synchronization, leading to corrupted data.',
        frequency: 'CRITICAL'
      }
    ],
    annotatedProgram: {
      title: 'Thread Creation & Synchronized Counter',
      filename: 'ConcurrencyDemo.java',
      summary: 'Demonstrates creating threads with lambdas and using synchronized methods to prevent race conditions.',
      code: `// Line 01: Demonstrates thread synchronization
public class ConcurrencyDemo {

    // Line 04: Thread-safe counter class
    static class SafeCounter {
        private int count = 0;

        // Line 08: 'synchronized' ensures only one thread updates 'count' at a time!
        public synchronized void increment() {
            count++;
        }

        public synchronized int getCount() {
            return count;
        }
    }

    public static void main(String[] args) throws InterruptedException {
        SafeCounter counter = new SafeCounter();

        // Line 21: Create two worker threads that both increment the counter 1,000 times
        Thread t1 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) counter.increment();
        });

        Thread t2 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) counter.increment();
        });

        // Line 30: Start both threads concurrently
        t1.start();
        t2.start();

        // Line 34: Wait for both threads to finish
        t1.join();
        t2.join();

        // Output will be exactly 2000 because of synchronization!
        System.out.println("Final Counter Value: " + counter.getCount());
    }
}`
    },
    commonPitfalls: [
      'Calling `run()` instead of `start()`, which fails to launch a new thread.',
      'Over-synchronizing methods, which turns your multithreaded app into a slow single-threaded queue.',
      'Acquiring multiple locks in different orders across threads, causing Deadlocks.'
    ]
  },

  // =========================================================================
  // TOPIC 14: JDBC & TRANSACTIONS
  // =========================================================================
  'jdbc-transactions': {
    id: 15,
    slug: 'jdbc-transactions',
    title: 'JDBC & Database Transactions',
    moduleOrder: 12,
    moduleTitle: 'Enterprise Java & JDBC',
    estimatedMinutes: 35,
    overview: `Applications must save data permanently in databases like MySQL or PostgreSQL. JDBC (Java Database Connectivity) is the bridge that allows your Java program to send SQL queries to a database, fetch results, and manage transactions safely. In this lesson, we will learn how to connect Java to databases and prevent serious security bugs like SQL Injection.`,
    coreConcepts: [
      {
        title: '1. The 4 Basic Steps of JDBC',
        markdown: `1. **Connect**: \`Connection conn = DriverManager.getConnection(url, user, pass);\`
2. **Prepare Statement**: \`PreparedStatement stmt = conn.prepareStatement("SELECT * FROM students WHERE id = ?");\`
3. **Run Query**: \`ResultSet rs = stmt.executeQuery();\`
4. **Read Data**: \`while (rs.next()) { String name = rs.getString("name"); }\``
      },
      {
        title: '2. Why You MUST Use PreparedStatement (Prevent SQL Injection!)',
        markdown: `- **Never concatenate strings to build SQL queries**:
  \`"SELECT * FROM users WHERE user = '" + input + "'"\`
  A hacker can type \`' OR '1'='1\` and bypass your login or delete your entire database!
- **PreparedStatement**: Treats user input as pure data values, completely neutralizing SQL Injection attacks.`
      },
      {
        title: '3. What is a Database Transaction? (ACID)',
        markdown: `Imagine transferring \$100 from Alice to Bob:
- Step 1: Subtract \$100 from Alice's account.
- Step 2: Add \$100 to Bob's account.
- **What if power fails after Step 1?** Alice lost \$100 and Bob got nothing!
- **In JDBC**:
  - Turn off auto-commit: \`conn.setAutoCommit(false);\`.
  - If both steps succeed: call \`conn.commit();\`.
  - If any error happens: call \`conn.rollback();\` to undo everything. Either both steps succeed, or none do!`
      }
    ],
    interviewQA: [
      {
        question: 'Why is PreparedStatement faster and safer than Statement in JDBC?',
        answer: 'PreparedStatement is pre-compiled by the database (making repeated executions faster) and safely binds parameters to completely prevent SQL Injection attacks.',
        frequency: 'CRITICAL'
      },
      {
        question: 'What does commit() and rollback() do in database transactions?',
        answer: 'commit() permanently saves all changes made during the transaction. rollback() cancels and undoes all changes if an error occurs, keeping data consistent.',
        frequency: 'CRITICAL'
      }
    ],
    annotatedProgram: {
      title: 'Parameterized Queries & Safe Transactions',
      filename: 'JdbcTransactionDemo.java',
      summary: 'Demonstrates using PreparedStatement to prevent SQL injection and managing commit/rollback transactions.',
      code: `// Line 01: Standard SQL interfaces for JDBC
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class JdbcTransactionDemo {

    // Line 08: Method demonstrating an atomic money transfer between two accounts
    public static void transferMoney(Connection conn, int fromAcc, int toAcc, double amount) throws SQLException {
        // Line 10: Step 1 - Turn off auto-commit to start a transaction
        conn.setAutoCommit(false);

        String withdrawSql = "UPDATE accounts SET balance = balance - ? WHERE id = ?";
        String depositSql  = "UPDATE accounts SET balance = balance + ? WHERE id = ?";

        try (PreparedStatement withdrawStmt = conn.prepareStatement(withdrawSql);
             PreparedStatement depositStmt  = conn.prepareStatement(depositSql)) {

            // Line 18: Execute withdrawal
            withdrawStmt.setDouble(1, amount);
            withdrawStmt.setInt(2, fromAcc);
            withdrawStmt.executeUpdate();

            // Line 23: Execute deposit
            depositStmt.setDouble(1, amount);
            depositStmt.setInt(2, toAcc);
            depositStmt.executeUpdate();

            // Line 28: If both succeed, permanently commit the transaction
            conn.commit();
            System.out.println("Transfer of $" + amount + " completed successfully!");

        } catch (SQLException e) {
            // Line 33: If anything fails, rollback to undo any partial changes!
            conn.rollback();
            System.out.println("Transfer failed! Rolled back safely.");
            throw e;
        } finally {
            // Restore auto-commit
            conn.setAutoCommit(true);
        }
    }
}`
    },
    commonPitfalls: [
      'Using raw String concatenation in SQL statements, opening critical SQL Injection vulnerabilities.',
      'Leaving `autoCommit = true` during multi-step updates, causing corrupted or partial data if crashes occur.',
      'Forgetting to close `Connection` and `Statement` objects, causing database connection leaks.'
    ]
  }
};

/**
 * Helper to retrieve rich study notes for any topic slug.
 */
export const getTopicStudyNote = (slug: string): TopicStudyNote | undefined => {
  return TOPIC_NOTES[slug];
};

/**
 * Helper to generate complete Markdown content for downloading.
 */
export const generateTopicMarkdown = (note: TopicStudyNote): string => {
  return `# ${note.title}
**Module**: ${note.moduleTitle} (Module ${note.moduleOrder.toString().padStart(2, '0')})
**Platform**: RA-Java (Random Access Java) • Placement Mastery Curriculum
**Estimated Study Time**: ${note.estimatedMinutes} Minutes

---

## 1. Quick Concept Overview
${note.overview}

---

## 2. Core Concepts (Explained in Simple English)
${note.coreConcepts.map(c => `### ${c.title}\n\n${c.markdown}`).join('\n\n')}

---

## 3. High-Frequency Placement & Interview Questions
${note.interviewQA.map((qa, i) => `### Q${i + 1} [${qa.frequency} PRIORITY]: ${qa.question}
**Answer**:
${qa.answer}`).join('\n\n')}

---

## 4. Annotated Reference Program: \`${note.annotatedProgram.filename}\`
*${note.annotatedProgram.summary}*

\`\`\`java
${note.annotatedProgram.code}
\`\`\`

---

## 5. Critical Traps & Mistakes to Avoid
${note.commonPitfalls.map((p, i) => `${i + 1}. ${p}`).join('\n')}

---
*Generated by RA-Java (Random Access Java) • Free Placement Learning Platform*
`;
};

/**
 * Helper to generate printable HTML content for PDF export.
 */
export const generateTopicPrintableHtml = (note: TopicStudyNote): string => {
  const conceptsHtml = note.coreConcepts.map(c => `
    <h2>${c.title}</h2>
    <div>${c.markdown.replace(/\n\n/g, '<br/><br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div>
  `).join('');

  const qaHtml = note.interviewQA.map((qa, i) => `
    <div class="callout-qa">
      <div class="qa-question">Q${i + 1} [${qa.frequency}]: ${qa.question}</div>
      <div class="qa-answer">${qa.answer}</div>
    </div>
  `).join('');

  const pitfallsHtml = `
    <h2>Critical Traps to Avoid in Interviews</h2>
    <ul>
      ${note.commonPitfalls.map(p => `<li>${p}</li>`).join('')}
    </ul>
  `;

  const codeHtml = `
    <h2>Annotated Program: ${note.annotatedProgram.filename}</h2>
    <p><em>${note.annotatedProgram.summary}</em></p>
    <pre><code>${note.annotatedProgram.code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
  `;

  return `
    <div class="callout">
      <strong>Quick Concept Overview:</strong><br/>
      ${note.overview}
    </div>
    ${conceptsHtml}
    <h2>High-Frequency Placement &amp; Interview Questions</h2>
    ${qaHtml}
    ${codeHtml}
    ${pitfallsHtml}
  `;
};
