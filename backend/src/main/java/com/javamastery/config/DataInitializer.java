package com.javamastery.config;

import com.javamastery.entity.*;
import com.javamastery.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final CourseModuleRepository moduleRepository;
    private final TopicRepository topicRepository;
    private final SubtopicRepository subtopicRepository;
    private final QuestionRepository questionRepository;
    private final TestCaseRepository testCaseRepository;
    private final CodeTemplateRepository codeTemplateRepository;
    private final LearningMaterialRepository materialRepository;
    private final AssessmentRepository assessmentRepository;
    private final AssessmentQuestionRepository assessmentQuestionRepository;
    private final UserRepository userRepository;

    public DataInitializer(CourseModuleRepository moduleRepository,
                           TopicRepository topicRepository,
                           SubtopicRepository subtopicRepository,
                           QuestionRepository questionRepository,
                           TestCaseRepository testCaseRepository,
                           CodeTemplateRepository codeTemplateRepository,
                           LearningMaterialRepository materialRepository,
                           AssessmentRepository assessmentRepository,
                           AssessmentQuestionRepository assessmentQuestionRepository,
                           UserRepository userRepository) {
        this.moduleRepository = moduleRepository;
        this.topicRepository = topicRepository;
        this.subtopicRepository = subtopicRepository;
        this.questionRepository = questionRepository;
        this.testCaseRepository = testCaseRepository;
        this.codeTemplateRepository = codeTemplateRepository;
        this.materialRepository = materialRepository;
        this.assessmentRepository = assessmentRepository;
        this.assessmentQuestionRepository = assessmentQuestionRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        initDefaultAdmin();
        if (moduleRepository.count() == 0) {
            logger.info("Initializing 12 Core Java Modules, Topics, Questions, and Assessments...");
            seedAllCurriculum();
            logger.info("Curriculum initialization completed successfully!");
        }
    }

    private void initDefaultAdmin() {
        if (!userRepository.existsByEmail("admin@rajava.com")) {
            User admin = new User("admin@rajava.com", "RA-Java Platform Administrator", "https://api.dicebear.com/7.x/bottts/svg?seed=admin");
            admin.setRole("ROLE_ADMIN");
            admin.setCourseAccess(true);
            admin.setPaymentStatus("COMPLETED");
            userRepository.save(admin);
            logger.info("Default administrator account created: admin@rajava.com");
        }
        if (!userRepository.existsByEmail("admin@javamastery.com")) {
            User admin = new User("admin@javamastery.com", "Platform Administrator", "https://api.dicebear.com/7.x/bottts/svg?seed=admin");
            admin.setRole("ROLE_ADMIN");
            admin.setCourseAccess(true);
            admin.setPaymentStatus("COMPLETED");
            userRepository.save(admin);
            logger.info("Default administrator account created: admin@javamastery.com");
        }
    }

    private void seedAllCurriculum() {
        // Module 1: Java Fundamentals
        CourseModule m1 = createModule(1, "Java Fundamentals", "java-fundamentals",
                "Master JDK, JRE, JVM architecture, primitive types, operators, and Java memory model.", "Terminal");

        Topic t1_1 = createTopic(m1, 1, "Introduction to Java & Architecture", "intro-to-java", 35);
        addSubtopic(t1_1, 1, "JVM Architecture, ClassLoader & Memory Areas",
                "### The Java Execution Engine\nJava compiles source code into platform-neutral Bytecode (.class) which executes on any system having a compatible JVM.\n\n" +
                "### JVM Runtime Data Areas\n" +
                "- **Method Area (Metaspace)**: Stores class metadata, bytecode instructions, static fields, and runtime constant pool.\n" +
                "- **Heap Memory**: Shared runtime storage for all dynamically created objects and arrays, automatically managed by Garbage Collection.\n" +
                "- **JVM Stack**: Thread-private memory. Pushes a new Stack Frame for every method call containing local variables and partial results.\n" +
                "- **PC Register**: Tracks current instruction address.\n" +
                "- **Native Method Stack**: Houses C/C++ native invocation frames.");
        addSubtopic(t1_1, 2, "High-Frequency Placement Interview Q&A",
                "### Q1: Why is Java platform-independent while the JVM is platform-dependent?\n" +
                "**Answer**: Bytecode (.class) is universal and architecture-neutral across all operating systems. However, the JVM must translate that bytecode into CPU-specific machine instructions and call underlying OS kernel APIs, so each OS requires its own custom JVM binary.\n\n" +
                "### Q2: What is the JIT (Just-In-Time) Compiler?\n" +
                "**Answer**: The JIT compiler is part of the JVM execution engine. Instead of repeatedly interpreting bytecode line-by-line, the HotSpot engine identifies frequently executed 'hotspots' and compiles them directly into native assembly language, executing at near-C++ speeds.");
        addSubtopic(t1_1, 3, "Annotated Program: JVMArchitectureDemo.java",
                "```java\n" +
                "// Line 01: Import standard management APIs\n" +
                "import java.lang.management.ManagementFactory;\n" +
                "\n" +
                "// Line 04: Public class declaration matching filename\n" +
                "public class JVMArchitectureDemo {\n" +
                "    // Line 06: Static variable stored in Metaspace (Class Metadata)\n" +
                "    private static final String PLATFORM = \"RA-Java Platform\";\n" +
                "\n" +
                "    // Line 09: Main method: JVM Main Thread pushes first Stack Frame\n" +
                "    public static void main(String[] args) {\n" +
                "        // Line 11: Print banner to stdout console\n" +
                "        System.out.println(\"=== \" + PLATFORM + \" Initialized ===\");\n" +
                "\n" +
                "        // Line 14: Query singleton runtime instance from JVM\n" +
                "        Runtime runtime = Runtime.getRuntime();\n" +
                "\n" +
                "        // Line 17: Query maximum heap memory configured (-Xmx) in MB\n" +
                "        long maxHeapMb = runtime.maxMemory() / (1024 * 1024);\n" +
                "        System.out.println(\"Max Heap Memory (-Xmx): \" + maxHeapMb + \" MB\");\n" +
                "\n" +
                "        // Line 21: Query available CPU cores accessible to JVM\n" +
                "        int cores = runtime.availableProcessors();\n" +
                "        System.out.println(\"Available CPU Logical Cores: \" + cores);\n" +
                "\n" +
                "        // Line 25: Heap Allocation: Allocate integer array on Heap\n" +
                "        // Local reference 'data' resides on Stack; array elements on Heap\n" +
                "        int[] data = new int[50_000];\n" +
                "        for (int i = 0; i < data.length; i++) {\n" +
                "            data[i] = i * 3; // Write directly into Heap segment\n" +
                "        }\n" +
                "        System.out.println(\"Allocated \" + data.length + \" elements in Heap.\");\n" +
                "    } // Line 32: Stack frame pops; local references eligible for GC\n" +
                "}\n" +
                "```");
        addMaterial(t1_1, "Complete Study Notes: Java Architecture & JVM Internals", "/materials/Module1_Java_Architecture.pdf", 2450000);
        addAssessmentForIntro(t1_1);

        Topic t1_2 = createTopic(m1, 2, "Java Program Structure & The Main Method", "main-method-and-syntax", 30);
        addSubtopic(t1_2, 1, "Why the Main Method in Java?",
                "### Anatomy of `public static void main(String[] args)`\n" +
                "- **`public`**: Accessible by JVM runtime from outside the class package.\n" +
                "- **`static`**: JVM can invoke the method without instantiating an object (`new ClassName()`).\n" +
                "- **`void`**: Method does not return any value to the operating system.\n" +
                "- **`main`**: The specific entry point identifier the JVM searches for upon startup.\n" +
                "- **`String[] args`**: Command line arguments passed into program execution.");
        addSubtopic(t1_2, 2, "Standard Output & Scanner Basics",
                "### `System.out.println()` vs `System.out.print()`\n" +
                "- `System.out.println()`: Prints text and appends a newline (`\\n`).\n" +
                "- `System.out.print()`: Prints text without moving to a new line.\n\n" +
                "### Reading Input with `Scanner`\n" +
                "`Scanner sc = new Scanner(System.in); String name = sc.nextLine();`");
        addSubtopic(t1_2, 3, "Annotated Program: HelloJavaStructure.java",
                "```java\n" +
                "import java.util.Scanner;\n" +
                "public class HelloJavaStructure {\n" +
                "    public static void main(String[] args) {\n" +
                "        System.out.println(\"Hello, Welcome to Java!\");\n" +
                "    }\n" +
                "}\n" +
                "```");
        addMaterial(t1_2, "Java Program Structure & Syntax Guide", "/materials/Module1_MainMethod.pdf", 2100000);
        addQuestionsForMainMethod(t1_2);

        Topic t1_3 = createTopic(m1, 3, "Variables, Data Types & Operators", "variables-and-data-types", 40);
        addSubtopic(t1_3, 1, "The 8 Primitives & Type Casting Rules",
                "### Primitive Widths & Encodings\n" +
                "- `byte` (8-bit, -128 to 127)\n" +
                "- `short` (16-bit, -32,768 to 32,767)\n" +
                "- `int` (32-bit, -2^31 to 2^31-1)\n" +
                "- `long` (64-bit, requires suffix 'L')\n" +
                "- `float` (32-bit IEEE 754, requires suffix 'f')\n" +
                "- `double` (64-bit IEEE 754)\n" +
                "- `char` (16-bit Unicode, 0 to 65,535)\n" +
                "- `boolean` (true or false)\n\n" +
                "### Casting Mechanics\n" +
                "- **Widening**: Automatic safe conversion from smaller to larger types (`byte -> short -> int -> long -> float -> double`).\n" +
                "- **Narrowing**: Explicit manual cast `(targetType)` resulting in high-order bit truncation if bounds are exceeded.");
        addSubtopic(t1_3, 2, "Placement Interview Q&A: The Integer Cache Trap",
                "### Q1: What is the output of Integer a=100, b=100; Integer x=200, y=200; (a==b) + \" \" + (x==y)?\n" +
                "**Answer**: Output is `true false`. Java maintains an internal IntegerCache between -128 and 127. Values in this range reuse identical cached references. Outside this range, autoboxing allocates new Heap objects, so reference comparison (==) evaluates to false.\n\n" +
                "### Q2: Why avoid float/double for financial calculations?\n" +
                "**Answer**: IEEE 754 floating-point binary numbers cannot represent base-10 fractions (like 0.1) exactly, resulting in precision rounding errors (e.g. 0.1 + 0.2 = 0.30000000000000004). Always use `java.math.BigDecimal`.");
        addSubtopic(t1_3, 3, "Annotated Program: DataTypesAndCastingDemo.java",
                "```java\n" +
                "// Line 01: Class demonstrating primitives, type narrowing, and Integer Cache\n" +
                "public class DataTypesAndCastingDemo {\n" +
                "    public static void main(String[] args) {\n" +
                "        // Line 04: Primitive integer declared with underscore formatting\n" +
                "        int baseCredits = 100_000;\n" +
                "\n" +
                "        // Line 07: Explicit Narrowing with Bit Overflow:\n" +
                "        int overflowCandidate = 130;\n" +
                "        // Line 09: Cast 32-bit int to 8-bit byte (High 24 bits truncated)\n" +
                "        byte truncatedByte = (byte) overflowCandidate; // Yields -126 in 2's complement\n" +
                "        System.out.println(\"130 cast to byte: \" + truncatedByte);\n" +
                "\n" +
                "        // Line 13: Integer Cache (-128 to 127) Demonstration:\n" +
                "        Integer a = 100, b = 100;\n" +
                "        System.out.println(\"a == b (100 in Cache): \" + (a == b)); // true\n" +
                "\n" +
                "        // Line 17: Values outside cache allocate separate objects\n" +
                "        Integer x = 500, y = 500;\n" +
                "        System.out.println(\"x == y (500 outside Cache): \" + (x == y)); // false\n" +
                "        System.out.println(\"x.equals(y): \" + x.equals(y)); // true\n" +
                "    }\n" +
                "}\n" +
                "```");
        addMaterial(t1_3, "Variables, Data Types & Arithmetic Operators Manual", "/materials/Module1_DataTypes.pdf", 1850000);
        addQuestionsForDataTypes(t1_3);
        addAssessmentForDataTypes(t1_3);

        // Module 2: Conditional Statements
        CourseModule m2 = createModule(2, "Conditional Statements", "conditional-statements",
                "Control flow branching with if-else ladders, switch expressions, and pattern matching.", "GitFork");
        Topic t2_1 = createTopic(m2, 1, "If-Else & Decision Logic", "if-else-statements", 30);
        addSubtopic(t2_1, 1, "Short-Circuit Logic & Modern Switch Expressions",
                "### Short-Circuit Evaluation (&& vs & and || vs |)\n" +
                "Short-circuit operators (`&&`, `||`) skip evaluating the right-hand operand as soon as the result is determined. This is critical for preventing `NullPointerException` (e.g. `if (s != null && s.length() > 0)`).\n\n" +
                "### Java 14+ Arrow Switch Expressions\n" +
                "Modern switch expressions eliminate break statements and prevent accidental fall-through bugs using `->` and `yield`.");
        addSubtopic(t2_1, 2, "Placement Interview Q&A: Decision Logic",
                "### Q1: What types are supported in a Java switch statement?\n" +
                "**Answer**: byte, short, char, int (and wrappers), String (Java 7+), and Enums (Java 5+). Float, double, and boolean are NOT supported.\n\n" +
                "### Q2: Why is short-circuiting critical in production?\n" +
                "**Answer**: It prevents unnecessary execution of expensive methods or null pointer exceptions when checking validity.");
        addSubtopic(t2_1, 3, "Annotated Program: DecisionLogicDemo.java",
                "```java\n" +
                "// Line 01: Class demonstrating short-circuit evaluation and switch expressions\n" +
                "public class DecisionLogicDemo {\n" +
                "    enum Grade { A, B, C, F }\n" +
                "\n" +
                "    public static void main(String[] args) {\n" +
                "        String candidate = \"Aman\";\n" +
                "        int score = 88;\n" +
                "\n" +
                "        // Line 09: Null-safe short-circuit check\n" +
                "        if (candidate != null && candidate.length() > 0) {\n" +
                "            System.out.println(\"Candidate: \" + candidate);\n" +
                "        }\n" +
                "\n" +
                "        // Line 15: Modern Switch Expression with arrow syntax\n" +
                "        Grade grade = (score >= 90) ? Grade.A : (score >= 75) ? Grade.B : Grade.C;\n" +
                "        String feedback = switch (grade) {\n" +
                "            case A -> \"Outstanding - Direct Interview\";\n" +
                "            case B -> \"Cleared - Advance to Technical Assessment\";\n" +
                "            default -> \"Recommend Further Coding Practice\";\n" +
                "        };\n" +
                "        System.out.println(\"Evaluation: \" + feedback);\n" +
                "    }\n" +
                "}\n" +
                "```");
        addMaterial(t2_1, "Conditional Decision Tree & Placement Patterns", "/materials/Module2_Conditionals.pdf", 1920000);
        addQuestionsForConditionals(t2_1);
        addAssessmentForConditionals(t2_1);

        // Module 3: Loops & Iterations
        CourseModule m3 = createModule(3, "Loops & Iterations", "loops-and-iterations",
                "Iteration constructs: for loops, while loops, do-while loops, nested loops, and jump statements.", "Repeat");
        Topic t3_1 = createTopic(m3, 1, "For Loop Mastery", "for-loop", 45);
        addSubtopic(t3_1, 1, "For Loop Lifecycle & Enhanced For-Each",
                "### For Loop Execution Steps\n" +
                "1. Initialization runs once.\n" +
                "2. Condition evaluated before each iteration.\n" +
                "3. Loop body executes.\n" +
                "4. Update step runs and condition is re-evaluated.\n\n" +
                "### Enhanced For-Each Loop\n" +
                "Compiles into an underlying `Iterator`. Modifying the collection directly inside an enhanced for-loop throws `ConcurrentModificationException`.");
        addSubtopic(t3_1, 2, "Placement Interview Q&A: Loop Optimization",
                "### Q1: What is a Labeled Break?\n" +
                "**Answer**: In nested loops, a standard break only terminates the innermost loop. Prefixing the outer loop with a label (e.g. `outer: for(...)`) lets `break outer;` terminate both loops simultaneously.\n\n" +
                "### Q2: Why does modifying a List in a for-each loop throw ConcurrentModificationException?\n" +
                "**Answer**: The collection's internal modCount changes when you call `list.remove()`, causing a mismatch with the iterator's `expectedModCount`.");
        addSubtopic(t3_1, 3, "Annotated Program: ForLoopMasteryDemo.java",
                "```java\n" +
                "public class ForLoopMasteryDemo {\n" +
                "    public static void main(String[] args) {\n" +
                "        int[][] matrix = { { 1, 2 }, { 3, 99 }, { 5, 6 } };\n" +
                "        int target = 99;\n" +
                "\n" +
                "        // Labeled break allows escaping both nested loops at once\n" +
                "        searchMatrix:\n" +
                "        for (int r = 0; r < matrix.length; r++) {\n" +
                "            for (int c = 0; c < matrix[r].length; c++) {\n" +
                "                if (matrix[r][c] == target) {\n" +
                "                    System.out.println(\"Found \" + target + \" at [\" + r + \",\" + c + \"]\");\n" +
                "                    break searchMatrix;\n" +
                "                }\n" +
                "            }\n" +
                "        }\n" +
                "    }\n" +
                "}\n" +
                "```");
        addMaterial(t3_1, "Loop Optimization & Complexity Guide", "/materials/Module3_ForLoops.pdf", 2150000);
        addQuestionsForForLoop(t3_1);
        addAssessmentForForLoop(t3_1);

        Topic t3_2 = createTopic(m3, 2, "While & Do-While Loops", "while-and-do-while-loops", 40);
        addSubtopic(t3_2, 1, "Entry-Controlled vs Exit-Controlled Iteration",
                "### While (Entry-Controlled)\n" +
                "Evaluates condition before executing body (0 or more times).\n\n" +
                "### Do-While (Exit-Controlled)\n" +
                "Guarantees at least ONE execution of the body regardless of initial condition.");
        addSubtopic(t3_2, 2, "Placement Interview Q&A: While Idioms",
                "### Q1: When is a do-while loop preferred over a while loop?\n" +
                "**Answer**: When an operation must run at least once before testing a condition (e.g. reading CLI user input or retrying network handshakes).");
        addSubtopic(t3_2, 3, "Annotated Program: WhileLoopPatternsDemo.java",
                "```java\n" +
                "public class WhileLoopPatternsDemo {\n" +
                "    public static void main(String[] args) {\n" +
                "        // Two-pointer while loop array reversal\n" +
                "        int[] arr = { 1, 2, 3, 4, 5 };\n" +
                "        int l = 0, r = arr.length - 1;\n" +
                "        while (l < r) {\n" +
                "            int tmp = arr[l]; arr[l] = arr[r]; arr[r] = tmp;\n" +
                "            l++; r--;\n" +
                "        }\n" +
                "        System.out.println(\"Reversed array length: \" + arr.length);\n" +
                "    }\n" +
                "}\n" +
                "```");
        addMaterial(t3_2, "While & Do-While Patterns in Placement Coding", "/materials/Module3_WhileLoops.pdf", 1750000);
        addQuestionsForWhileLoop(t3_2);
        addAssessmentForWhileLoop(t3_2);

        // Module 4: Methods & Recursion
        CourseModule m4 = createModule(4, "Methods & Recursion", "methods-and-recursion",
                "Method declaration, parameter passing (pass-by-value), overloading, and recursion call stack.", "Code2");
        Topic t4_1 = createTopic(m4, 1, "Methods & Call Stack", "methods-declaration", 35);
        addSubtopic(t4_1, 1, "Strictly Pass-By-Value & Stack Frames",
                "### Java is Strictly Pass-By-Value\n" +
                "For primitives, values are copied. For objects, the reference pointer address is copied. Mutating object fields mutates the shared Heap object, but reassigning the reference parameter inside a method has zero impact on caller.");
        addSubtopic(t4_1, 2, "Placement Interview Q&A: Pass-By-Value Proof",
                "### Q1: Is Java pass-by-reference?\n" +
                "**Answer**: No! Java is strictly pass-by-value. When an object is passed, a copy of the reference address is passed into the stack frame. If you reassign `param = new Object()`, the caller's reference remains unchanged.\n\n" +
                "### Q2: What causes StackOverflowError?\n" +
                "**Answer**: Infinite recursion without a terminating base case exhausts JVM thread stack memory.");
        addSubtopic(t4_1, 3, "Annotated Program: PassByValueAndRecursionDemo.java",
                "```java\n" +
                "public class PassByValueAndRecursionDemo {\n" +
                "    static class Box { int val = 10; }\n" +
                "\n" +
                "    public static void main(String[] args) {\n" +
                "        Box b = new Box();\n" +
                "        modify(b);\n" +
                "        System.out.println(\"Box val: \" + b.val); // 20\n" +
                "        System.out.println(\"Factorial 4: \" + fact(4)); // 24\n" +
                "    }\n" +
                "    static void modify(Box x) { x.val = 20; }\n" +
                "    static int fact(int n) { return (n <= 1) ? 1 : n * fact(n - 1); }\n" +
                "}\n" +
                "```");
        addMaterial(t4_1, "Methods, Recursion and Call Stack Deep-Dive", "/materials/Module4_Methods.pdf", 2300000);
        addQuestionsForMethods(t4_1);
        addAssessmentForMethods(t4_1);

        // Module 5: Arrays
        CourseModule m5 = createModule(5, "Arrays & Multi-dimensional Arrays", "arrays",
                "Single and 2D arrays, memory representation in heap, traversal, two-pointer techniques, and sorting.", "Layers");
        Topic t5_1 = createTopic(m5, 1, "Array Algorithms & Manipulation", "array-algorithms", 50);
        addSubtopic(t5_1, 1, "Contiguous Memory & Two-Pointer Techniques",
                "### Array Memory Representation\n" +
                "Arrays in Java are objects stored in Heap memory with elements stored contiguously. Index access `arr[i]` is instantaneous O(1) via base address offset calculation.");
        addSubtopic(t5_1, 2, "Placement Interview Q&A: Two-Pointer Patterns",
                "### Q1: Why is array indexing O(1)?\n" +
                "**Answer**: Memory is contiguous. Address = BaseAddress + (i * elementSize). A single CPU multiplication and addition finds the memory location.\n\n" +
                "### Q2: Why use the two-pointer technique?\n" +
                "**Answer**: It transforms O(N^2) brute-force nested iterations into linear O(N) operations with O(1) auxiliary space.");
        addSubtopic(t5_1, 3, "Annotated Program: ArrayAlgorithmsDemo.java",
                "```java\n" +
                "public class ArrayAlgorithmsDemo {\n" +
                "    public static void main(String[] args) {\n" +
                "        int[] arr = { 2, 7, 11, 15 };\n" +
                "        int target = 18;\n" +
                "        int l = 0, r = arr.length - 1;\n" +
                "        while (l < r) {\n" +
                "            int s = arr[l] + arr[r];\n" +
                "            if (s == target) { System.out.println(\"Pair: \" + arr[l] + \" + \" + arr[r]); break; }\n" +
                "            else if (s < target) l++; else r--;\n" +
                "        }\n" +
                "    }\n" +
                "}\n" +
                "```");
        addMaterial(t5_1, "Array Algorithms: Two Pointers, Sliding Window & Kadane's", "/materials/Module5_Arrays.pdf", 3100000);
        addQuestionsForArrays(t5_1);
        addAssessmentForArrays(t5_1);

        // Module 6: Strings & String Pool
        CourseModule m6 = createModule(6, "Strings & String Pool", "strings",
                "String immutability, String Constant Pool (SCP), StringBuilder vs StringBuffer, and anagrams.", "Type");
        Topic t6_1 = createTopic(m6, 1, "String Internals & Manipulation", "string-internals", 45);
        addSubtopic(t6_1, 1, "String Constant Pool (SCP) & Immutability",
                "### Why Strings Are Immutable\n" +
                "1. **Security**: Network connections and database credentials are safe from tampering.\n" +
                "2. **Memory Efficiency**: The String Constant Pool (SCP) reuses identical literals.\n" +
                "3. **Thread-Safety**: Automatically thread-safe without locks.\n" +
                "4. **Hash Caching**: Hashcode is computed once and cached.");
        addSubtopic(t6_1, 2, "Placement Interview Q&A: String vs StringBuilder",
                "### Q1: What is the difference between String, StringBuilder, and StringBuffer?\n" +
                "**Answer**: String is immutable. StringBuffer is mutable and thread-safe (synchronized). StringBuilder is mutable, unsynchronized, and the fastest choice for string concatenation.");
        addSubtopic(t6_1, 3, "Annotated Program: StringPoolInternalsDemo.java",
                "```java\n" +
                "public class StringPoolInternalsDemo {\n" +
                "    public static void main(String[] args) {\n" +
                "        String s1 = \"Java\";\n" +
                "        String s2 = \"Java\";\n" +
                "        String s3 = new String(\"Java\");\n" +
                "        System.out.println(s1 == s2); // true (same SCP reference)\n" +
                "        System.out.println(s1 == s3); // false (Heap vs SCP)\n" +
                "        System.out.println(s1.equals(s3)); // true (Value equal)\n" +
                "    }\n" +
                "}\n" +
                "```");
        addMaterial(t6_1, "String Pool & StringBuilder Optimization Guide", "/materials/Module6_Strings.pdf", 2400000);
        addQuestionsForStrings(t6_1);
        addAssessmentForStrings(t6_1);

        // Module 7: Object-Oriented Programming (OOP)
        CourseModule m7 = createModule(7, "Object-Oriented Programming", "object-oriented-programming",
                "Encapsulation, Inheritance, Polymorphism, Abstraction, Interfaces, Abstract Classes, and Composition.", "Cpu");
        Topic t7_1 = createTopic(m7, 1, "Polymorphism & Inheritance", "polymorphism-inheritance", 50);
        addSubtopic(t7_1, 1, "The 4 Pillars & Dynamic Method Dispatch",
                "### Dynamic Polymorphism (vtable)\n" +
                "Method calls on an overridden method are resolved dynamically at runtime based on the actual object instance via the Virtual Method Table (vtable).");
        addSubtopic(t7_1, 2, "Placement Interview Q&A: OOP Nuances",
                "### Q1: Can static methods be overridden?\n" +
                "**Answer**: No. Static methods are bound at compile-time to the class (Method Hiding), not runtime polymorphism.\n\n" +
                "### Q2: What is the Diamond Problem?\n" +
                "**Answer**: Multiple class inheritance ambiguity. Java prevents it by allowing only single class inheritance.");
        addSubtopic(t7_1, 3, "Annotated Program: OOPPolymorphismDemo.java",
                "```java\n" +
                "interface Service { void execute(); }\n" +
                "class EmailService implements Service {\n" +
                "    public void execute() { System.out.println(\"Email dispatched.\"); }\n" +
                "}\n" +
                "public class OOPPolymorphismDemo {\n" +
                "    public static void main(String[] args) {\n" +
                "        Service s = new EmailService();\n" +
                "        s.execute(); // Dynamic dispatch\n" +
                "    }\n" +
                "}\n" +
                "```");
        addMaterial(t7_1, "OOP Design Patterns & Placement Interview Bible", "/materials/Module7_OOP.pdf", 3800000);
        addQuestionsForOOP(t7_1);
        addAssessmentForOOP(t7_1);

        // Module 8: Exception Handling & Advanced Java
        CourseModule m8 = createModule(8, "Exception Handling & Advanced Java", "exception-handling",
                "Throwable hierarchy, checked vs unchecked exceptions, try-with-resources, custom exceptions, and Enums.", "AlertTriangle");
        Topic t8_1 = createTopic(m8, 1, "Exception Handling Architecture", "exception-architecture", 40);
        addSubtopic(t8_1, 1, "Throwable Hierarchy & Try-With-Resources",
                "### Checked vs Unchecked\n" +
                "- **Checked**: Subclasses of `Exception` (excluding RuntimeException). Verified at compile-time.\n" +
                "- **Unchecked**: Subclasses of `RuntimeException`. Programming bugs.\n\n" +
                "### Try-With-Resources\n" +
                "Automatically closes any resource implementing `AutoCloseable` upon block exit.");
        addSubtopic(t8_1, 2, "Placement Interview Q&A: Finally Execution",
                "### Q1: When does finally NOT execute?\n" +
                "**Answer**: Only when System.exit(0) is called, the JVM crashes, or OS kills the process.");
        addSubtopic(t8_1, 3, "Annotated Program: ExceptionHandlingArchitectureDemo.java",
                "```java\n" +
                "class Resource implements AutoCloseable {\n" +
                "    public void close() { System.out.println(\"Closed.\"); }\n" +
                "}\n" +
                "public class ExceptionHandlingArchitectureDemo {\n" +
                "    public static void main(String[] args) {\n" +
                "        try (Resource r = new Resource()) {\n" +
                "            System.out.println(\"Working...\");\n" +
                "        }\n" +
                "    }\n" +
                "}\n" +
                "```");
        addMaterial(t8_1, "Exception Handling Best Practices & Custom Exception Design", "/materials/Module8_Exceptions.pdf", 2100000);
        addQuestionsForExceptions(t8_1);
        addAssessmentForExceptions(t8_1);

        // Module 9: Collections Framework
        CourseModule m9 = createModule(9, "Collections Framework", "collections-framework",
                "List, Set, Map, Queue, Internal working of HashMap, TreeMap, PriorityQueue, Comparable and Comparator.", "Database");
        Topic t9_1 = createTopic(m9, 1, "HashMap Internals & Collections", "hashmap-internals", 50);
        addSubtopic(t9_1, 1, "How HashMap Works Internally (Java 8+)",
                "### Step-by-Step Mechanics\n" +
                "1. Calculates hash via `hash(key.hashCode())`.\n" +
                "2. Finds bucket index via `(n - 1) & hash`.\n" +
                "3. Collisions stored in linked list nodes.\n" +
                "4. Converts to Red-Black Tree when bucket exceeds TREEIFY_THRESHOLD = 8.");
        addSubtopic(t9_1, 2, "Placement Interview Q&A: HashMap Contract",
                "### Q1: What is the hashCode() and equals() contract?\n" +
                "**Answer**: If two objects are equal via equals(), their hashCode() MUST be identical. Overriding equals without hashCode breaks HashMap lookups.");
        addSubtopic(t9_1, 3, "Annotated Program: HashMapInternalsDemo.java",
                "```java\n" +
                "import java.util.*;\n" +
                "public class HashMapInternalsDemo {\n" +
                "    public static void main(String[] args) {\n" +
                "        Map<String, Integer> map = new HashMap<>();\n" +
                "        map.put(\"Java\", 21);\n" +
                "        System.out.println(\"Version: \" + map.get(\"Java\"));\n" +
                "    }\n" +
                "}\n" +
                "```");
        addMaterial(t9_1, "Collections Framework Architecture & HashMap Deep Dive", "/materials/Module9_Collections.pdf", 3900000);
        addQuestionsForCollections(t9_1);
        addAssessmentForCollections(t9_1);

        // Module 10: Generics & Java 8 Features
        CourseModule m10 = createModule(10, "Generics & Java 8 Streams", "generics-and-java-8",
                "Functional Interfaces, Lambda Expressions, Stream API (filter, map, flatMap, reduce, collect), and Optional.", "Zap");
        Topic t10_1 = createTopic(m10, 1, "Stream API & Lambdas", "stream-api-lambdas", 50);
        addSubtopic(t10_1, 1, "Functional Interfaces & Stream Pipelines",
                "### Core Functional Interfaces\n" +
                "- `Predicate<T>`: test(T) -> boolean\n" +
                "- `Function<T, R>`: apply(T) -> R\n" +
                "- `Consumer<T>`: accept(T) -> void\n" +
                "- `Supplier<T>`: get() -> T");
        addSubtopic(t10_1, 2, "Placement Interview Q&A: Lazy Evaluation",
                "### Q1: What is lazy evaluation in Streams?\n" +
                "**Answer**: Intermediate operations (filter, map) are not computed until a terminal operation (collect, count) is invoked.");
        addSubtopic(t10_1, 3, "Annotated Program: StreamApiMasteryDemo.java",
                "```java\n" +
                "import java.util.*;\n" +
                "import java.util.stream.*;\n" +
                "public class StreamApiMasteryDemo {\n" +
                "    public static void main(String[] args) {\n" +
                "        List<Integer> list = List.of(1, 2, 3, 4, 5, 6);\n" +
                "        List<Integer> evens = list.stream().filter(n -> n % 2 == 0).collect(Collectors.toList());\n" +
                "        System.out.println(\"Evens: \" + evens);\n" +
                "    }\n" +
                "}\n" +
                "```");
        addMaterial(t10_1, "Java 8 Streams, Lambdas & Modern Functional Java", "/materials/Module10_Streams.pdf", 3200000);
        addQuestionsForStreams(t10_1);
        addAssessmentForStreams(t10_1);

        // Module 11: Multithreading & Concurrency
        CourseModule m11 = createModule(11, "Multithreading & Concurrency", "multithreading-concurrency",
                "Thread lifecycle, Synchronization, Volatile, Locks, ExecutorService, CompletableFuture, and Deadlocks.", "Activity");
        Topic t11_1 = createTopic(m11, 1, "Concurrency & Synchronization", "concurrency-sync", 55);
        addSubtopic(t11_1, 1, "JMM, Volatile & Deadlock Avoidance",
                "### Volatile Keyword\n" +
                "Guarantees memory visibility across thread caches and prevents instruction reordering. Does NOT guarantee atomicity for compound operations like `i++`.");
        addSubtopic(t11_1, 2, "Placement Interview Q&A: volatile vs synchronized",
                "### Q1: Difference between volatile and synchronized?\n" +
                "**Answer**: volatile guarantees visibility without thread blocking. synchronized guarantees both visibility and mutual exclusion (atomicity) via monitor locks.");
        addSubtopic(t11_1, 3, "Annotated Program: ConcurrencySynchronizationDemo.java",
                "```java\n" +
                "import java.util.concurrent.atomic.AtomicInteger;\n" +
                "public class ConcurrencySynchronizationDemo {\n" +
                "    private static final AtomicInteger count = new AtomicInteger(0);\n" +
                "    public static void main(String[] args) {\n" +
                "        count.incrementAndGet();\n" +
                "        System.out.println(\"Atomic count: \" + count.get());\n" +
                "    }\n" +
                "}\n" +
                "```");
        addMaterial(t11_1, "Multithreading, Locks & High-Throughput Concurrency", "/materials/Module11_Multithreading.pdf", 4100000);
        addQuestionsForConcurrency(t11_1);
        addAssessmentForConcurrency(t11_1);

        // Module 12: File I/O & JDBC
        CourseModule m12 = createModule(12, "File Handling & JDBC", "file-handling-and-jdbc",
                "NIO.2, BufferedReader/Writer, Serialization, JDBC Driver, PreparedStatement, ResultSet, and ACID transactions.", "HardDrive");
        Topic t12_1 = createTopic(m12, 1, "JDBC & Transaction Management", "jdbc-transactions", 45);
        addSubtopic(t12_1, 1, "PreparedStatement & ACID Transactions",
                "### PreparedStatement vs Statement\n" +
                "PreparedStatement pre-compiles SQL and binds user parameters as literal data, completely neutralizing SQL Injection attacks.");
        addSubtopic(t12_1, 2, "Placement Interview Q&A: Transaction Management",
                "### Q1: How do you manage transactions in JDBC?\n" +
                "**Answer**: Call `conn.setAutoCommit(false)` to start the transaction boundary. Execute queries, call `conn.commit()` on success, and `conn.rollback()` in the catch block.");
        addSubtopic(t12_1, 3, "Annotated Program: JDBCTransactionDemo.java",
                "```java\n" +
                "public class JDBCTransactionDemo {\n" +
                "    public static void main(String[] args) {\n" +
                "        System.out.println(\"PreparedStatement parameterized transfer demonstrated.\");\n" +
                "    }\n" +
                "}\n" +
                "```");
        addMaterial(t12_1, "JDBC Connection Pooling, Statements & Transaction Isolation", "/materials/Module12_JDBC.pdf", 2800000);
        addQuestionsForJDBC(t12_1);
        addAssessmentForJDBC(t12_1);
    }

    private CourseModule createModule(int order, String title, String slug, String desc, String icon) {
        CourseModule m = new CourseModule(order, title, slug, desc, icon);
        return moduleRepository.save(m);
    }

    private Topic createTopic(CourseModule m, int order, String title, String slug, int minutes) {
        Topic t = new Topic(m, order, title, slug, minutes);
        return topicRepository.save(t);
    }

    private void addSubtopic(Topic t, int order, String title, String markdown) {
        Subtopic st = new Subtopic(t, order, title, markdown);
        subtopicRepository.save(st);
    }

    private void addMaterial(Topic t, String title, String pdfUrl, long size) {
        LearningMaterial lm = new LearningMaterial(t, title, pdfUrl, size);
        materialRepository.save(lm);
    }

    // --- SEED QUESTIONS IMPLEMENTING SECTION 8 SPECIFICATION ---

    private void addQuestionsForIntro(Topic topic) {
        // Conceptual Topic: Completed via Assessment Quiz (Zero coding questions required)
    }

    private void addQuestionsForMainMethod(Topic topic) {
        // Easy: Welcome Message
        Question q1 = new Question(topic, "EASY", "Print Welcome Message", "print-welcome-message",
                "Write a Java program to print `Welcome to Java Mastery!` followed by the input student name on a newline.",
                "A single string representing the student's name.",
                "Line 1: `Welcome to Java Mastery!`\nLine 2: `<Student Name>`",
                "Name length between 1 and 50 characters.");
        q1.setExpectedTimeComplexity("O(1)");
        q1.setExpectedSpaceComplexity("O(1)");
        q1.setHints("Use Scanner to read the name and System.out.println() for standard output.");
        q1.setEditorialSolution("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String name = sc.nextLine();\n        System.out.println(\"Welcome to Java Mastery!\");\n        System.out.println(name);\n    }\n}");
        questionRepository.save(q1);
        addTestCase(q1, "Rahul", "Welcome to Java Mastery!\nRahul", false, 1);
        addTestCase(q1, "Priya Sharma", "Welcome to Java Mastery!\nPriya Sharma", false, 2);
        addTestCase(q1, "Alex", "Welcome to Java Mastery!\nAlex", true, 3);
        addStarterCode(q1, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n        \n    }\n}");

        // Medium: Print Formatted Student Bio Card
        Question q2 = new Question(topic, "MEDIUM", "Print Formatted Student Bio Card", "print-multiline-bio",
                "Given 3 lines of input: student name, target role, and career goal, print a formatted 3-line bio card using System.out.println().\nLine 1: Name: <name>\nLine 2: Role: <role>\nLine 3: Goal: <goal>",
                "Line 1: Student Name\nLine 2: Target Role\nLine 3: Career Goal",
                "Formatted 3-line card.",
                "1 <= length of each line <= 100");
        q2.setExpectedTimeComplexity("O(1)");
        q2.setExpectedSpaceComplexity("O(1)");
        q2.setHints("Use sc.nextLine() three times to read all three lines, and print with exact labels.");
        q2.setEditorialSolution("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String name = sc.nextLine();\n        String role = sc.nextLine();\n        String goal = sc.nextLine();\n        System.out.println(\"Name: \" + name);\n        System.out.println(\"Role: \" + role);\n        System.out.println(\"Goal: \" + goal);\n    }\n}");
        questionRepository.save(q2);
        addTestCase(q2, "Alice\nSoftware Engineer\nLearn Java 21", "Name: Alice\nRole: Software Engineer\nGoal: Learn Java 21", false, 1);
        addTestCase(q2, "Rohan\nBackend Developer\nPass Placement Interviews", "Name: Rohan\nRole: Backend Developer\nGoal: Pass Placement Interviews", false, 2);
        addTestCase(q2, "Maya\nFull Stack Engineer\nBuild Scalable Cloud Systems", "Name: Maya\nRole: Full Stack Engineer\nGoal: Build Scalable Cloud Systems", true, 3);
        addStarterCode(q2, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Read 3 lines and print bio card\n    }\n}");

        // Hard: Echo Greeting with Input
        Question q3 = new Question(topic, "HARD", "Echo Greeting with Input", "echo-greeting-input",
                "Write a Java program that reads a user's name from standard input and prints: `Hello, <name>! Welcome to Java.`",
                "A single line representing a person's name.",
                "Line 1: `Hello, <name>! Welcome to Java.`",
                "1 <= name length <= 80");
        q3.setExpectedTimeComplexity("O(1)");
        q3.setExpectedSpaceComplexity("O(1)");
        q3.setHints("Read the line using sc.nextLine() and concatenate with the required greeting string.");
        q3.setEditorialSolution("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String name = sc.nextLine();\n        System.out.println(\"Hello, \" + name + \"! Welcome to Java.\");\n    }\n}");
        questionRepository.save(q3);
        addTestCase(q3, "Dev", "Hello, Dev! Welcome to Java.", false, 1);
        addTestCase(q3, "Sneha Kapoor", "Hello, Sneha Kapoor! Welcome to Java.", false, 2);
        addTestCase(q3, "John Doe", "Hello, John Doe! Welcome to Java.", true, 3);
        addStarterCode(q3, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Print personalized greeting\n    }\n}");
    }

    private void addQuestionsForDataTypes(Topic topic) {
        // Easy: Swap with temporary variable (NO XOR!)
        Question q1 = new Question(topic, "EASY", "Swap Two Numbers with Temp Variable", "swap-two-numbers",
                "Given two integers A and B, swap their values using a third temporary variable. Print the swapped values separated by a space.",
                "Two space-separated integers A and B.",
                "Swapped integers A and B separated by a space.",
                "-10^9 <= A, B <= 10^9");
        q1.setExpectedTimeComplexity("O(1)");
        q1.setExpectedSpaceComplexity("O(1)");
        q1.setHints("Store 'a' into 'temp', copy 'b' into 'a', and copy 'temp' into 'b'.");
        q1.setEditorialSolution("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long a = sc.nextLong();\n        long b = sc.nextLong();\n        long temp = a;\n        a = b;\n        b = temp;\n        System.out.println(a + \" \" + b);\n    }\n}");
        questionRepository.save(q1);
        addTestCase(q1, "5 10", "10 5", false, 1);
        addTestCase(q1, "-3 7", "7 -3", false, 2);
        addTestCase(q1, "0 999", "999 0", true, 3);
        addStarterCode(q1, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Swap using temp variable\n    }\n}");

        // Medium: Celsius to Fahrenheit (Variables & Double arithmetic, NO bitwise!)
        Question q2 = new Question(topic, "MEDIUM", "Celsius to Fahrenheit Converter", "celsius-to-fahrenheit",
                "Given a temperature in Celsius, convert it to Fahrenheit using the formula: F = (C * 9/5) + 32. Print the result rounded to two decimal places.",
                "A single floating point number representing temperature in Celsius.",
                "Fahrenheit temperature rounded to 2 decimal places.",
                "-273.15 <= Celsius <= 1000.0");
        q2.setExpectedTimeComplexity("O(1)");
        q2.setExpectedSpaceComplexity("O(1)");
        q2.setHints("Remember that integer division 9/5 evaluates to 1 in Java! Use 9.0/5.0 to preserve floating point accuracy.");
        q2.setEditorialSolution("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        double c = sc.nextDouble();\n        double f = (c * 9.0 / 5.0) + 32.0;\n        System.out.printf(\"%.2f\\n\", f);\n    }\n}");
        questionRepository.save(q2);
        addTestCase(q2, "0", "32.00", false, 1);
        addTestCase(q2, "100", "212.00", false, 2);
        addTestCase(q2, "37.5", "99.50", true, 3);
        addStarterCode(q2, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Convert Celsius to Fahrenheit\n    }\n}");

        // Hard: Rectangle Area and Perimeter (Pure variables & arithmetic, NO XOR, NO loops!)
        Question q3 = new Question(topic, "HARD", "Rectangle Area and Perimeter", "rectangle-area-perimeter",
                "Given the length and width of a rectangle as integers, calculate and print its Area on Line 1 (`Area: <area>`) and its Perimeter on Line 2 (`Perimeter: <perimeter>`).",
                "Two space-separated long integers representing length and width.",
                "Line 1: `Area: <area>`\nLine 2: `Perimeter: <perimeter>`",
                "1 <= length, width <= 10^9");
        q3.setExpectedTimeComplexity("O(1)");
        q3.setExpectedSpaceComplexity("O(1)");
        q3.setHints("Area is length * width. Perimeter is 2 * (length + width). Use long to prevent integer overflow!");
        q3.setEditorialSolution("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long length = sc.nextLong();\n        long width = sc.nextLong();\n        long area = length * width;\n        long perimeter = 2 * (length + width);\n        System.out.println(\"Area: \" + area);\n        System.out.println(\"Perimeter: \" + perimeter);\n    }\n}");
        questionRepository.save(q3);
        addTestCase(q3, "5 4", "Area: 20\nPerimeter: 18", false, 1);
        addTestCase(q3, "10 20", "Area: 200\nPerimeter: 60", false, 2);
        addTestCase(q3, "1 1", "Area: 1\nPerimeter: 4", true, 3);
        addStarterCode(q3, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Calculate and print Area and Perimeter\n    }\n}");
    }

    private void addQuestionsForConditionals(Topic topic) {
        Question q1 = new Question(topic, "EASY", "Check Leap Year", "check-leap-year",
                "Given a year Y, determine whether it is a leap year according to Gregorian calendar rules.",
                "A single integer year Y.",
                "Print `LEAP YEAR` or `NOT LEAP YEAR`.",
                "1 <= Y <= 9999");
        q1.setEditorialSolution("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int y = sc.nextInt();\n        if ((y % 400 == 0) || (y % 4 == 0 && y % 100 != 0)) {\n            System.out.println(\"LEAP YEAR\");\n        } else {\n            System.out.println(\"NOT LEAP YEAR\");\n        }\n    }\n}");
        questionRepository.save(q1);
        addTestCase(q1, "2000", "LEAP YEAR", false, 1);
        addTestCase(q1, "1900", "NOT LEAP YEAR", false, 2);
        addTestCase(q1, "2024", "LEAP YEAR", true, 3);
        addStarterCode(q1, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Leap year logic\n    }\n}");

        Question q2 = new Question(topic, "MEDIUM", "Quadrant of Coordinate Point", "find-quadrant",
                "Given coordinates (X, Y) where X != 0 and Y != 0, print the quadrant number (`Q1`, `Q2`, `Q3`, or `Q4`).",
                "Two space-separated integers X and Y.",
                "`Q1`, `Q2`, `Q3`, or `Q4`.",
                "-10^6 <= X, Y <= 10^6, X != 0, Y != 0");
        q2.setEditorialSolution("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int x = sc.nextInt();\n        int y = sc.nextInt();\n        if (x > 0 && y > 0) System.out.println(\"Q1\");\n        else if (x < 0 && y > 0) System.out.println(\"Q2\");\n        else if (x < 0 && y < 0) System.out.println(\"Q3\");\n        else System.out.println(\"Q4\");\n    }\n}");
        questionRepository.save(q2);
        addTestCase(q2, "5 8", "Q1", false, 1);
        addTestCase(q2, "-4 2", "Q2", false, 2);
        addTestCase(q2, "-10 -20", "Q3", true, 3);
        addTestCase(q2, "7 -3", "Q4", true, 4);
        addStarterCode(q2, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Output quadrant\n    }\n}");

        Question q3 = new Question(topic, "HARD", "Valid Triangle from Three Sides", "valid-triangle-type",
                "Given three side lengths A, B, and C, check whether they form a valid triangle. If valid, print `EQUILATERAL`, `ISOSCELES`, or `SCALENE`. If not valid, print `INVALID`.",
                "Three space-separated integers A, B, and C.",
                "Triangle classification or `INVALID`.",
                "1 <= A, B, C <= 10^9");
        q3.setEditorialSolution("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long a = sc.nextLong();\n        long b = sc.nextLong();\n        long c = sc.nextLong();\n        if (a + b <= c || a + c <= b || b + c <= a) {\n            System.out.println(\"INVALID\");\n        } else if (a == b && b == c) {\n            System.out.println(\"EQUILATERAL\");\n        } else if (a == b || b == c || a == c) {\n            System.out.println(\"ISOSCELES\");\n        } else {\n            System.out.println(\"SCALENE\");\n        }\n    }\n}");
        questionRepository.save(q3);
        addTestCase(q3, "5 5 5", "EQUILATERAL", false, 1);
        addTestCase(q3, "1 2 3", "INVALID", false, 2);
        addTestCase(q3, "5 5 8", "ISOSCELES", true, 3);
        addTestCase(q3, "3 4 5", "SCALENE", true, 4);
        addStarterCode(q3, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Check triangle validity and type\n    }\n}");
    }

    private void addQuestionsForForLoop(Topic topic) {
        Question q1 = new Question(topic, "EASY", "Print Even Numbers up to N", "print-even-numbers-to-n",
                "Given an integer N, print all even numbers between 1 and N inclusive separated by a space.",
                "A single integer N.",
                "Even numbers separated by space.",
                "1 <= N <= 10^4");
        q1.setEditorialSolution("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        StringBuilder sb = new StringBuilder();\n        for (int i = 2; i <= n; i += 2) {\n            sb.append(i).append(\" \");\n        }\n        System.out.println(sb.toString().trim());\n    }\n}");
        questionRepository.save(q1);
        addTestCase(q1, "10", "2 4 6 8 10", false, 1);
        addTestCase(q1, "5", "2 4", false, 2);
        addTestCase(q1, "1", "", true, 3);
        addStarterCode(q1, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Print even numbers\n    }\n}");

        Question q2 = new Question(topic, "MEDIUM", "Sum of Digits of an Integer", "sum-of-digits",
                "Given a positive integer N, calculate the sum of its individual digits.",
                "A single integer N.",
                "Sum of digits.",
                "1 <= N <= 10^9");
        q2.setEditorialSolution("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long n = sc.nextLong();\n        long sum = 0;\n        for (; n > 0; n /= 10) {\n            sum += (n % 10);\n        }\n        System.out.println(sum);\n    }\n}");
        questionRepository.save(q2);
        addTestCase(q2, "12345", "15", false, 1);
        addTestCase(q2, "900", "9", false, 2);
        addTestCase(q2, "999999999", "81", true, 3);
        addStarterCode(q2, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Sum of digits\n    }\n}");

        Question q3 = new Question(topic, "HARD", "Armstrong Numbers in Range", "armstrong-numbers-in-range",
                "Find all Armstrong numbers in the range [A, B] inclusive without converting numbers into strings. Print each found number separated by space. (An Armstrong number of K digits equals the sum of its digits each raised to power K).",
                "Two space-separated integers A and B.",
                "Armstrong numbers separated by space.",
                "1 <= A <= B <= 10^6");
        q3.setEditorialSolution("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        StringBuilder sb = new StringBuilder();\n        for (int num = a; num <= b; num++) {\n            int temp = num, digits = 0;\n            while (temp > 0) { digits++; temp /= 10; }\n            temp = num;\n            long sum = 0;\n            while (temp > 0) {\n                int d = temp % 10;\n                long p = 1;\n                for (int k = 0; k < digits; k++) p *= d;\n                sum += p;\n                temp /= 10;\n            }\n            if (sum == num) sb.append(num).append(\" \");\n        }\n        System.out.println(sb.toString().trim());\n    }\n}");
        questionRepository.save(q3);
        addTestCase(q3, "1 500", "1 2 3 4 5 6 7 8 9 153 370 371 407", false, 1);
        addTestCase(q3, "100 200", "153", false, 2);
        addTestCase(q3, "370 371", "370 371", true, 3);
        addStarterCode(q3, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Find Armstrong numbers without strings\n    }\n}");
    }

    private void addQuestionsForWhileLoop(Topic topic) {
        Question q1 = new Question(topic, "EASY", "Count Digits in Integer", "count-digits-while",
                "Given an integer N, count the number of digits in it using a while loop.",
                "A single non-negative integer N.",
                "Number of digits.",
                "0 <= N <= 10^18");
        q1.setEditorialSolution("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long n = sc.nextLong();\n        if (n == 0) { System.out.println(1); return; }\n        int count = 0;\n        while (n > 0) {\n            count++;\n            n /= 10;\n        }\n        System.out.println(count);\n    }\n}");
        questionRepository.save(q1);
        addTestCase(q1, "123456", "6", false, 1);
        addTestCase(q1, "0", "1", false, 2);
        addTestCase(q1, "987654321098765", "15", true, 3);
        addStarterCode(q1, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Count digits with while loop\n    }\n}");

        Question q2 = new Question(topic, "MEDIUM", "Reverse Integer and Check Palindrome", "reverse-and-palindrome",
                "Reverse a given non-negative integer N. Print the reversed number on Line 1, and `PALINDROME` or `NOT PALINDROME` on Line 2.",
                "A single integer N.",
                "Line 1: reversed integer\nLine 2: `PALINDROME` or `NOT PALINDROME`",
                "0 <= N <= 2*10^9");
        q2.setEditorialSolution("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long n = sc.nextLong();\n        long temp = n, rev = 0;\n        while (temp > 0) {\n            rev = rev * 10 + (temp % 10);\n            temp /= 10;\n        }\n        System.out.println(rev);\n        System.out.println(rev == n ? \"PALINDROME\" : \"NOT PALINDROME\");\n    }\n}");
        questionRepository.save(q2);
        addTestCase(q2, "12321", "12321\nPALINDROME", false, 1);
        addTestCase(q2, "12345", "54321\nNOT PALINDROME", false, 2);
        addTestCase(q2, "7", "7\nPALINDROME", true, 3);
        addStarterCode(q2, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Reverse and check palindrome\n    }\n}");

        Question q3 = new Question(topic, "HARD", "Smallest Number Satisfying Digit Sum and Divisibility", "digit-sum-divisible-number",
                "Find the smallest positive integer X such that the sum of digits of X equals S, and X is divisible by D. If no such number <= 1000000 exists, print -1.",
                "Two space-separated integers S and D.",
                "Smallest integer X or -1.",
                "1 <= S <= 50, 1 <= D <= 50");
        q3.setEditorialSolution("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int s = sc.nextInt();\n        int d = sc.nextInt();\n        for (int x = d; x <= 1000000; x += d) {\n            int temp = x, sum = 0;\n            while (temp > 0) { sum += temp % 10; temp /= 10; }\n            if (sum == s) {\n                System.out.println(x);\n                return;\n            }\n        }\n        System.out.println(-1);\n    }\n}");
        questionRepository.save(q3);
        addTestCase(q3, "9 7", "63", false, 1);
        addTestCase(q3, "10 5", "55", false, 2);
        addTestCase(q3, "49 2", "-1", true, 3);
        addStarterCode(q3, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Find smallest number\n    }\n}");
    }

    private void addQuestionsForMethods(Topic topic) {
        Question q1 = new Question(topic, "EASY", "Greatest Common Divisor (GCD)", "gcd-method",
                "Implement a method `gcd(a, b)` using the Euclidean algorithm to find the greatest common divisor of two integers.",
                "Two space-separated integers A and B.",
                "GCD of A and B.",
                "1 <= A, B <= 10^9");
        q1.setEditorialSolution("import java.util.Scanner;\n\npublic class Solution {\n    public static long gcd(long a, long b) {\n        while (b != 0) {\n            long t = b;\n            b = a % b;\n            a = t;\n        }\n        return a;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long a = sc.nextLong();\n        long b = sc.nextLong();\n        System.out.println(gcd(a, b));\n    }\n}");
        questionRepository.save(q1);
        addTestCase(q1, "12 18", "6", false, 1);
        addTestCase(q1, "17 31", "1", false, 2);
        addTestCase(q1, "100 250", "50", true, 3);
        addStarterCode(q1, "import java.util.Scanner;\n\npublic class Solution {\n    // Implement gcd\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n    }\n}");

        Question q2 = new Question(topic, "MEDIUM", "N-th Fibonacci with Recursion & Memoization", "fibonacci-memo",
                "Compute the N-th Fibonacci number modulo 10^9 + 7 where Fib(0)=0 and Fib(1)=1.",
                "A single integer N.",
                "N-th Fibonacci modulo 1000000007.",
                "0 <= N <= 10^5");
        q2.setEditorialSolution("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        if (n == 0) { System.out.println(0); return; }\n        long a = 0, b = 1, mod = 1000000007L;\n        for (int i = 2; i <= n; i++) {\n            long c = (a + b) % mod;\n            a = b;\n            b = c;\n        }\n        System.out.println(b);\n    }\n}");
        questionRepository.save(q2);
        addTestCase(q2, "10", "55", false, 1);
        addTestCase(q2, "50", "586268941", false, 2);
        addTestCase(q2, "1000", "517691607", true, 3);
        addStarterCode(q2, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n    }\n}");

        Question q3 = new Question(topic, "HARD", "Tower of Hanoi Move Counter", "tower-of-hanoi",
                "Given N disks, print the total number of optimal moves required to transfer all disks from source to destination peg following Tower of Hanoi rules.",
                "A single integer N.",
                "Total moves (2^N - 1).",
                "1 <= N <= 60");
        q3.setEditorialSolution("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        long moves = (1L << n) - 1L;\n        System.out.println(moves);\n    }\n}");
        questionRepository.save(q3);
        addTestCase(q3, "3", "7", false, 1);
        addTestCase(q3, "4", "15", false, 2);
        addTestCase(q3, "10", "1023", true, 3);
        addStarterCode(q3, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n    }\n}");
    }

    private void addQuestionsForArrays(Topic topic) {
        Question q1 = new Question(topic, "EASY", "Find Maximum and Minimum Element in Array", "array-min-max",
                "Given an array of size N, find the minimum and maximum element and print them as `MIN MAX`.",
                "Line 1: N\nLine 2: N space-separated integers",
                "`MIN MAX`",
                "1 <= N <= 10^5");
        q1.setEditorialSolution("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        long min = Long.MAX_VALUE, max = Long.MIN_VALUE;\n        for (int i = 0; i < n; i++) {\n            long v = sc.nextLong();\n            if (v < min) min = v;\n            if (v > max) max = v;\n        }\n        System.out.println(min + \" \" + max);\n    }\n}");
        questionRepository.save(q1);
        addTestCase(q1, "5\n3 1 9 4 2", "1 9", false, 1);
        addTestCase(q1, "1\n42", "42 42", false, 2);
        addTestCase(q1, "4\n-10 -50 0 100", "-50 100", true, 3);
        addStarterCode(q1, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n    }\n}");

        Question q2 = new Question(topic, "MEDIUM", "Two Sum in Sorted Array (Two Pointers)", "two-sum-sorted",
                "Given a 1-indexed sorted array and target sum K, find the two indices (i, j) such that arr[i] + arr[j] == K. Print `i j`.",
                "Line 1: N K\nLine 2: N space-separated sorted integers",
                "`i j`",
                "2 <= N <= 10^5");
        q2.setEditorialSolution("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        long target = sc.nextLong();\n        long[] arr = new long[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextLong();\n        int l = 0, r = n - 1;\n        while (l < r) {\n            long sum = arr[l] + arr[r];\n            if (sum == target) {\n                System.out.println((l + 1) + \" \" + (r + 1));\n                return;\n            } else if (sum < target) l++;\n            else r--;\n        }\n        System.out.println(\"-1 -1\");\n    }\n}");
        questionRepository.save(q2);
        addTestCase(q2, "4 9\n2 7 11 15", "1 2", false, 1);
        addTestCase(q2, "3 6\n2 3 4", "1 3", false, 2);
        addTestCase(q2, "5 100\n10 20 30 70 90", "2 4", true, 3);
        addStarterCode(q2, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n    }\n}");

        Question q3 = new Question(topic, "HARD", "Maximum Subarray Sum (Kadane's Algorithm)", "maximum-subarray-kadane",
                "Find the contiguous subarray within an array of size N that has the largest sum and print that maximum sum in O(N) time and O(1) space.",
                "Line 1: N\nLine 2: N space-separated integers",
                "Maximum subarray sum.",
                "1 <= N <= 10^5, -10^9 <= arr[i] <= 10^9");
        q3.setEditorialSolution("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        long maxSoFar = Long.MIN_VALUE, current = 0;\n        for (int i = 0; i < n; i++) {\n            long x = sc.nextLong();\n            current += x;\n            if (current > maxSoFar) maxSoFar = current;\n            if (current < 0) current = 0;\n        }\n        System.out.println(maxSoFar);\n    }\n}");
        questionRepository.save(q3);
        addTestCase(q3, "8\n-2 -3 4 -1 -2 1 5 -3", "7", false, 1);
        addTestCase(q3, "4\n-1 -2 -3 -4", "-1", false, 2);
        addTestCase(q3, "5\n5 4 -1 7 8", "23", true, 3);
        addStarterCode(q3, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n    }\n}");
    }

    private void addQuestionsForStrings(Topic topic) {
        Question q1 = new Question(topic, "EASY", "Check Valid Anagram", "check-valid-anagram",
                "Given two strings S1 and S2 containing lowercase English letters, determine if S2 is an anagram of S1. Print `YES` or `NO`.",
                "Line 1: S1\nLine 2: S2",
                "`YES` or `NO`",
                "1 <= |S1|, |S2| <= 5*10^4");
        q1.setEditorialSolution("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s1 = sc.nextLine().trim();\n        String s2 = sc.nextLine().trim();\n        if (s1.length() != s2.length()) { System.out.println(\"NO\"); return; }\n        int[] count = new int[26];\n        for (char c : s1.toCharArray()) count[c - 'a']++;\n        for (char c : s2.toCharArray()) count[c - 'a']--;\n        for (int x : count) if (x != 0) { System.out.println(\"NO\"); return; }\n        System.out.println(\"YES\");\n    }\n}");
        questionRepository.save(q1);
        addTestCase(q1, "listen\nsilent", "YES", false, 1);
        addTestCase(q1, "triangle\nintegral", "YES", false, 2);
        addTestCase(q1, "rat\ncar", "NO", true, 3);
        addStarterCode(q1, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n    }\n}");

        Question q2 = new Question(topic, "MEDIUM", "Longest Substring Without Repeating Characters", "longest-substring-unique",
                "Given a string S, find the length of the longest substring without repeating characters in O(N) time.",
                "A single string S.",
                "Length of longest substring without repeating characters.",
                "0 <= |S| <= 10^5");
        q2.setEditorialSolution("import java.util.Scanner;\nimport java.util.HashMap;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLine()) { System.out.println(0); return; }\n        String s = sc.nextLine();\n        HashMap<Character, Integer> map = new HashMap<>();\n        int maxLen = 0, l = 0;\n        for (int r = 0; r < s.length(); r++) {\n            char c = s.charAt(r);\n            if (map.containsKey(c)) l = Math.max(l, map.get(c) + 1);\n            map.put(c, r);\n            maxLen = Math.max(maxLen, r - l + 1);\n        }\n        System.out.println(maxLen);\n    }\n}");
        questionRepository.save(q2);
        addTestCase(q2, "abcabcbb", "3", false, 1);
        addTestCase(q2, "bbbbb", "1", false, 2);
        addTestCase(q2, "pwwkew", "3", true, 3);
        addStarterCode(q2, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n    }\n}");

        Question q3 = new Question(topic, "HARD", "Longest Palindromic Substring", "longest-palindromic-substring",
                "Given a string S, find the longest palindromic substring. If multiple exist, print the first one encountered.",
                "A single string S.",
                "Longest palindromic substring.",
                "1 <= |S| <= 1000");
        q3.setEditorialSolution("import java.util.Scanner;\n\npublic class Solution {\n    private static int start = 0, maxLen = 0;\n    public static void expand(String s, int l, int r) {\n        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {\n            l--; r++;\n        }\n        int len = r - l - 1;\n        if (len > maxLen) {\n            maxLen = len;\n            start = l + 1;\n        }\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n        for (int i = 0; i < s.length(); i++) {\n            expand(s, i, i);\n            expand(s, i, i + 1);\n        }\n        System.out.println(s.substring(start, start + maxLen));\n    }\n}");
        questionRepository.save(q3);
        addTestCase(q3, "babad", "bab", false, 1);
        addTestCase(q3, "cbbd", "bb", false, 2);
        addTestCase(q3, "racecar", "racecar", true, 3);
        addStarterCode(q3, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n    }\n}");
    }

    private void addQuestionsForOOP(Topic topic) {
        Question q1 = new Question(topic, "EASY", "Encapsulated Bank Account", "encapsulated-bank-account",
                "Create a bank account simulation where operations `DEPOSIT X`, `WITHDRAW X`, and `BALANCE` are processed sequentially. If withdrawal amount exceeds balance, print `INSUFFICIENT FUNDS`.",
                "Line 1: N\nNext N lines: commands",
                "Results of balance checks or error messages.",
                "1 <= N <= 100");
        q1.setEditorialSolution("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        long bal = 0;\n        for (int i = 0; i < n; i++) {\n            String cmd = sc.next();\n            if (cmd.equals(\"DEPOSIT\")) bal += sc.nextLong();\n            else if (cmd.equals(\"WITHDRAW\")) {\n                long amt = sc.nextLong();\n                if (amt > bal) System.out.println(\"INSUFFICIENT FUNDS\");\n                else bal -= amt;\n            } else if (cmd.equals(\"BALANCE\")) System.out.println(bal);\n        }\n    }\n}");
        questionRepository.save(q1);
        addTestCase(q1, "4\nDEPOSIT 500\nWITHDRAW 200\nBALANCE\nWITHDRAW 400", "300\nINSUFFICIENT FUNDS", false, 1);
        addTestCase(q1, "2\nDEPOSIT 100\nBALANCE", "100", false, 2);
        addTestCase(q1, "3\nWITHDRAW 50\nDEPOSIT 50\nBALANCE", "INSUFFICIENT FUNDS\n50", true, 3);
        addStarterCode(q1, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n    }\n}");

        Question q2 = new Question(topic, "MEDIUM", "Shape Area Calculator with Interface", "shape-area-interface",
                "Implement polymorphism to calculate areas of `CIRCLE R` (pi * r^2) and `RECTANGLE W H` (w * h). Round circle area using 3.14159 to two decimals.",
                "Line 1: Type\nLine 2: Dimensions",
                "Calculated area rounded to 2 decimals.",
                "Dimensions >= 1");
        q2.setEditorialSolution("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String type = sc.next();\n        if (type.equals(\"CIRCLE\")) {\n            double r = sc.nextDouble();\n            System.out.printf(\"%.2f\\n\", 3.1415926535 * r * r);\n        } else {\n            double w = sc.nextDouble();\n            double h = sc.nextDouble();\n            System.out.printf(\"%.2f\\n\", w * h);\n        }\n    }\n}");
        questionRepository.save(q2);
        addTestCase(q2, "CIRCLE\n5", "78.54", false, 1);
        addTestCase(q2, "RECTANGLE\n4 6", "24.00", false, 2);
        addTestCase(q2, "CIRCLE\n10", "314.16", true, 3);
        addStarterCode(q2, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n    }\n}");

        Question q3 = new Question(topic, "HARD", "Design LRU Cache", "design-lru-cache",
                "Design a Least Recently Used (LRU) Cache of capacity C. Support `PUT K V` and `GET K` operations. Print `-1` if key is not found in GET.",
                "Line 1: Capacity C and Operations Q\nNext Q lines: operations",
                "Values returned by GET operations.",
                "1 <= C <= 1000, 1 <= Q <= 10^4");
        q3.setEditorialSolution("import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int cap = sc.nextInt();\n        int q = sc.nextInt();\n        LinkedHashMap<Integer, Integer> map = new LinkedHashMap<Integer, Integer>(cap, 0.75f, true) {\n            protected boolean removeEldestEntry(Map.Entry eldest) { return size() > cap; }\n        };\n        for (int i = 0; i < q; i++) {\n            String op = sc.next();\n            if (op.equals(\"PUT\")) {\n                int k = sc.nextInt(), v = sc.nextInt();\n                map.put(k, v);\n            } else {\n                int k = sc.nextInt();\n                System.out.println(map.getOrDefault(k, -1));\n            }\n        }\n    }\n}");
        questionRepository.save(q3);
        addTestCase(q3, "2 5\nPUT 1 10\nPUT 2 20\nGET 1\nPUT 3 30\nGET 2", "10\n-1", false, 1);
        addTestCase(q3, "1 3\nPUT 1 100\nGET 1\nGET 2", "100\n-1", false, 2);
        addTestCase(q3, "2 4\nPUT 1 1\nPUT 2 2\nGET 1\nGET 2", "1,2", true, 3);
        addStarterCode(q3, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n    }\n}");
    }

    private void addQuestionsForExceptions(Topic topic) {
        Question q1 = new Question(topic, "EASY", "Safe Integer Division", "safe-integer-division",
                "Divide integer A by B. If B is 0, catch ArithmeticException and print `DIVISION BY ZERO`. Otherwise print the quotient.",
                "Two space-separated integers A and B.",
                "Quotient or error message.",
                "-10^9 <= A, B <= 10^9");
        q1.setEditorialSolution("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long a = sc.nextLong();\n        long b = sc.nextLong();\n        if (b == 0) System.out.println(\"DIVISION BY ZERO\");\n        else System.out.println(a / b);\n    }\n}");
        questionRepository.save(q1);
        addTestCase(q1, "10 2", "5", false, 1);
        addTestCase(q1, "5 0", "DIVISION BY ZERO", false, 2);
        addTestCase(q1, "-20 4", "-5", true, 3);
        addStarterCode(q1, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n    }\n}");

        Question q2 = new Question(topic, "MEDIUM", "Custom Age Validator", "custom-age-validator",
                "Validate student age. If age < 18, throw custom `InvalidAgeException` and output `Age must be at least 18`. If valid, output `Eligible for Java Placement Course`.",
                "A single integer representing age.",
                "Status message.",
                "-100 <= age <= 150");
        q2.setEditorialSolution("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int age = sc.nextInt();\n        if (age < 18) System.out.println(\"Age must be at least 18\");\n        else System.out.println(\"Eligible for Java Placement Course\");\n    }\n}");
        questionRepository.save(q2);
        addTestCase(q2, "20", "Eligible for Java Placement Course", false, 1);
        addTestCase(q2, "16", "Age must be at least 18", false, 2);
        addTestCase(q2, "18", "Eligible for Java Placement Course", true, 3);
        addStarterCode(q2, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n    }\n}");

        Question q3 = new Question(topic, "HARD", "Try-With-Resources Simulation", "resource-leak-prevention",
                "Simulate opening multiple file resources. If resource fails during open, ensure all previously opened resources are closed in reverse order.",
                "Line 1: N\nNext N lines: ResourceName Status (OK / FAIL)",
                "Log of OPEN and CLOSE events.",
                "1 <= N <= 20");
        q3.setEditorialSolution("import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        List<String> opened = new ArrayList<>();\n        boolean failed = false;\n        for (int i = 0; i < n; i++) {\n            String res = sc.next();\n            String st = sc.next();\n            if (st.equals(\"FAIL\")) {\n                System.out.println(\"FAILED_TO_OPEN: \" + res);\n                failed = true;\n                break;\n            } else {\n                opened.add(res);\n                System.out.println(\"OPENED: \" + res);\n            }\n        }\n        for (int i = opened.size() - 1; i >= 0; i--) {\n            System.out.println(\"CLOSED: \" + opened.get(i));\n        }\n    }\n}");
        questionRepository.save(q3);
        addTestCase(q3, "2\nFileA OK\nFileB FAIL", "OPENED: FileA\nFAILED_TO_OPEN: FileB\nCLOSED: FileA", false, 1);
        addTestCase(q3, "1\nDBConn OK", "OPENED: DBConn\nCLOSED: DBConn", false, 2);
        addTestCase(q3, "3\nR1 OK\nR2 OK\nR3 OK", "OPENED: R1\nOPENED: R2\nOPENED: R3\nCLOSED: R3\nCLOSED: R2\nCLOSED: R1", true, 3);
        addStarterCode(q3, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n    }\n}");
    }

    private void addQuestionsForCollections(Topic topic) {
        Question q1 = new Question(topic, "EASY", "Frequency Counter with HashMap", "frequency-counter-hashmap",
                "Given an array of N integers, print the distinct elements along with their frequency in ascending order of elements.",
                "Line 1: N\nLine 2: N space-separated integers",
                "Lines of `Element: Count`",
                "1 <= N <= 10^5");
        q1.setEditorialSolution("import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        TreeMap<Integer, Integer> map = new TreeMap<>();\n        for (int i = 0; i < n; i++) {\n            int x = sc.nextInt();\n            map.put(x, map.getOrDefault(x, 0) + 1);\n        }\n        for (Map.Entry<Integer, Integer> e : map.entrySet()) {\n            System.out.println(e.getKey() + \": \" + e.getValue());\n        }\n    }\n}");
        questionRepository.save(q1);
        addTestCase(q1, "6\n2 3 2 5 3 2", "2: 3\n3: 2\n5: 1", false, 1);
        addTestCase(q1, "3\n1 1 1", "1: 3", false, 2);
        addTestCase(q1, "4\n10 5 10 5", "5: 2\n10: 2", true, 3);
        addStarterCode(q1, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n    }\n}");

        Question q2 = new Question(topic, "MEDIUM", "Kth Largest Element in Stream (PriorityQueue)", "kth-largest-priorityqueue",
                "Find the K-th largest element in an array of size N using a Min-Heap (PriorityQueue) in O(N log K) time.",
                "Line 1: N K\nLine 2: N space-separated integers",
                "K-th largest element.",
                "1 <= K <= N <= 10^5");
        q2.setEditorialSolution("import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int k = sc.nextInt();\n        PriorityQueue<Long> pq = new PriorityQueue<>(k);\n        for (int i = 0; i < n; i++) {\n            long x = sc.nextLong();\n            if (pq.size() < k) pq.add(x);\n            else if (x > pq.peek()) {\n                pq.poll();\n                pq.add(x);\n            }\n        }\n        System.out.println(pq.peek());\n    }\n}");
        questionRepository.save(q2);
        addTestCase(q2, "6 2\n3 2 1 5 6 4", "5", false, 1);
        addTestCase(q2, "9 4\n3 2 3 1 2 4 5 5 6", "4", false, 2);
        addTestCase(q2, "5 1\n10 20 30 40 50", "50", true, 3);
        addStarterCode(q2, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n    }\n}");

        Question q3 = new Question(topic, "HARD", "Top K Frequent Words", "top-k-frequent-words",
                "Given a list of words and integer K, return the top K most frequent words sorted by frequency (highest first). If frequencies match, sort alphabetically.",
                "Line 1: N K\nLine 2: N space-separated words",
                "Top K words separated by space.",
                "1 <= K <= N <= 10^4");
        q3.setEditorialSolution("import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int k = sc.nextInt();\n        Map<String, Integer> counts = new HashMap<>();\n        for (int i = 0; i < n; i++) {\n            String w = sc.next();\n            counts.put(w, counts.getOrDefault(w, 0) + 1);\n        }\n        List<String> candidates = new ArrayList<>(counts.keySet());\n        candidates.sort((w1, w2) -> counts.get(w1).equals(counts.get(w2)) ? w1.compareTo(w2) : counts.get(w2) - counts.get(w1));\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < k; i++) sb.append(candidates.get(i)).append(\" \");\n        System.out.println(sb.toString().trim());\n    }\n}");
        questionRepository.save(q3);
        addTestCase(q3, "6 2\ni love java i love coding", "i love", false, 1);
        addTestCase(q3, "4 1\napple banana apple cherry", "apple", false, 2);
        addTestCase(q3, "5 2\na b a b c", "a b", true, 3);
        addStarterCode(q3, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n    }\n}");
    }

    private void addQuestionsForStreams(Topic topic) {
        Question q1 = new Question(topic, "EASY", "Filter and Square Even Numbers (Streams)", "stream-filter-square",
                "Given N integers, use Java Stream API to filter only even numbers, square them, and print their sum.",
                "Line 1: N\nLine 2: N space-separated integers",
                "Sum of squares of even numbers.",
                "1 <= N <= 10^4");
        q1.setEditorialSolution("import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        List<Long> list = new ArrayList<>();\n        for (int i = 0; i < n; i++) list.add(sc.nextLong());\n        long sum = list.stream().filter(x -> x % 2 == 0).mapToLong(x -> x * x).sum();\n        System.out.println(sum);\n    }\n}");
        questionRepository.save(q1);
        addTestCase(q1, "5\n1 2 3 4 5", "20", false, 1);
        addTestCase(q1, "3\n1 3 5", "0", false, 2);
        addTestCase(q1, "4\n2 4 6 8", "120", true, 3);
        addStarterCode(q1, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n    }\n}");

        Question q2 = new Question(topic, "MEDIUM", "Group Strings by Length (GroupingBy)", "stream-grouping-by-length",
                "Given N words, use Streams `Collectors.groupingBy()` to count how many words have length L. Print in ascending order of length as `L: Count`.",
                "Line 1: N\nLine 2: N words",
                "Lines of `Length: Count`",
                "1 <= N <= 10^4");
        q2.setEditorialSolution("import java.util.*;\nimport java.util.stream.Collectors;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        List<String> words = new ArrayList<>();\n        for (int i = 0; i < n; i++) words.add(sc.next());\n        Map<Integer, Long> map = words.stream().collect(Collectors.groupingBy(String::length, TreeMap::new, Collectors.counting()));\n        map.forEach((len, count) -> System.out.println(len + \": \" + count));\n    }\n}");
        questionRepository.save(q2);
        addTestCase(q2, "4\ncat dog bird elephant", "3: 2\n4: 1\n8: 1", false, 1);
        addTestCase(q2, "3\na aa aaa", "1: 1\n2: 1\n3: 1", false, 2);
        addTestCase(q2, "4\njava c++ python rust", "3: 1\n4: 2\n6: 1", true, 3);
        addStarterCode(q2, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n    }\n}");

        Question q3 = new Question(topic, "HARD", "Second Highest Salary with Optional & Stream", "second-highest-salary-stream",
                "Given salaries of N employees, find the second distinct highest salary using Java Stream and `Optional`. If no second distinct salary exists, print `NO SECOND SALARY`.",
                "Line 1: N\nLine 2: N salaries",
                "Second highest salary or message.",
                "1 <= N <= 10^5");
        q3.setEditorialSolution("import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        List<Long> sal = new ArrayList<>();\n        for (int i = 0; i < n; i++) sal.add(sc.nextLong());\n        Optional<Long> sec = sal.stream().distinct().sorted(Comparator.reverseOrder()).skip(1).findFirst();\n        System.out.println(sec.map(String::valueOf).orElse(\"NO SECOND SALARY\"));\n    }\n}");
        questionRepository.save(q3);
        addTestCase(q3, "5\n1000 2000 3000 3000 2500", "2500", false, 1);
        addTestCase(q3, "3\n5000 5000 5000", "NO SECOND SALARY", false, 2);
        addTestCase(q3, "2\n100 200", "100", true, 3);
        addStarterCode(q3, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n    }\n}");
    }

    private void addQuestionsForConcurrency(Topic topic) {
        Question q1 = new Question(topic, "EASY", "Multi-threaded Printer with Runnable", "multithreaded-printer",
                "Simulate running two threads: Thread A prints numbers from 1 to N, Thread B prints squares from 1 to N. Output must contain total items printed (2*N).",
                "A single integer N.",
                "Total items printed: 2*N",
                "1 <= N <= 1000");
        q1.setEditorialSolution("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(\"TOTAL: \" + (2 * n));\n    }\n}");
        questionRepository.save(q1);
        addTestCase(q1, "5", "TOTAL: 10", false, 1);
        addTestCase(q1, "10", "TOTAL: 20", false, 2);
        addTestCase(q1, "100", "TOTAL: 200", true, 3);
        addStarterCode(q1, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n    }\n}");

        Question q2 = new Question(topic, "MEDIUM", "Thread-Safe Atomic Counter Simulation", "atomic-counter-sim",
                "Simulate T concurrent threads, each performing K increments. Print the final guaranteed value of the counter (T * K).",
                "Two integers T and K.",
                "T * K",
                "1 <= T, K <= 10^4");
        q2.setEditorialSolution("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long t = sc.nextLong();\n        long k = sc.nextLong();\n        System.out.println(t * k);\n    }\n}");
        questionRepository.save(q2);
        addTestCase(q2, "4 1000", "4000", false, 1);
        addTestCase(q2, "10 500", "5000", false, 2);
        addTestCase(q2, "2 50000", "100000", true, 3);
        addStarterCode(q2, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n    }\n}");

        Question q3 = new Question(topic, "HARD", "Deadlock Detection in Resource Allocation", "deadlock-detection",
                "Given a wait-for graph of N processes and M directed edges (P1 waits for P2), detect if a deadlock exists using cycle detection (DFS). Print `DEADLOCK DETECTED` or `SAFE`.",
                "Line 1: N M\nNext M lines: U V (process U waits for V)",
                "`DEADLOCK DETECTED` or `SAFE`",
                "1 <= N <= 1000, 1 <= M <= 5000");
        q3.setEditorialSolution("import java.util.*;\n\npublic class Solution {\n    static boolean hasCycle(int u, List<List<Integer>> adj, int[] vis) {\n        vis[u] = 1;\n        for (int v : adj.get(u)) {\n            if (vis[v] == 1) return true;\n            if (vis[v] == 0 && hasCycle(v, adj, vis)) return true;\n        }\n        vis[u] = 2;\n        return false;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), m = sc.nextInt();\n        List<List<Integer>> adj = new ArrayList<>();\n        for (int i = 0; i <= n; i++) adj.add(new ArrayList<>());\n        for (int i = 0; i < m; i++) adj.get(sc.nextInt()).add(sc.nextInt());\n        int[] vis = new int[n + 1];\n        for (int i = 1; i <= n; i++) {\n            if (vis[i] == 0 && hasCycle(i, adj, vis)) {\n                System.out.println(\"DEADLOCK DETECTED\");\n                return;\n            }\n        }\n        System.out.println(\"SAFE\");\n    }\n}");
        questionRepository.save(q3);
        addTestCase(q3, "3 3\n1 2\n2 3\n3 1", "DEADLOCK DETECTED", false, 1);
        addTestCase(q3, "3 2\n1 2\n2 3", "SAFE", false, 2);
        addTestCase(q3, "4 4\n1 2\n2 3\n3 4\n4 2", "DEADLOCK DETECTED", true, 3);
        addStarterCode(q3, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n    }\n}");
    }

    private void addQuestionsForJDBC(Topic topic) {
        Question q1 = new Question(topic, "EASY", "SQL Injection Sanitizer", "sql-injection-sanitizer",
                "Given an untrusted student search input string, sanitize quotes and escape special characters to simulate what PreparedStatement parameter binding achieves.",
                "A string input.",
                "Sanitized string with escaped single quotes.",
                "Length <= 200");
        q1.setEditorialSolution("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n        System.out.println(s.replace(\"'\", \"''\"));\n    }\n}");
        questionRepository.save(q1);
        addTestCase(q1, "admin' OR '1'='1", "admin'' OR ''1''=''1", false, 1);
        addTestCase(q1, "John Doe", "John Doe", false, 2);
        addTestCase(q1, "''; DROP TABLE users;--", "''''; DROP TABLE users;--", true, 3);
        addStarterCode(q1, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n    }\n}");

        Question q2 = new Question(topic, "MEDIUM", "CSV File Record Parser", "csv-file-parser",
                "Parse N comma-separated lines representing `ID,Name,Salary`. Find the student with the highest salary and print `ID:Name:Salary`.",
                "Line 1: N\nNext N lines: ID,Name,Salary",
                "`ID:Name:Salary`",
                "1 <= N <= 1000");
        q2.setEditorialSolution("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        long maxSal = -1;\n        String best = \"\";\n        for (int i = 0; i < n; i++) {\n            String line = sc.nextLine().trim();\n            String[] parts = line.split(\",\");\n            long sal = Long.parseLong(parts[2].trim());\n            if (sal > maxSal) {\n                maxSal = sal;\n                best = parts[0].trim() + \":\" + parts[1].trim() + \":\" + sal;\n            }\n        }\n        System.out.println(best);\n    }\n}");
        questionRepository.save(q2);
        addTestCase(q2, "3\n101,Rohan,60000\n102,Sneha,85000\n103,Amit,72000", "102:Sneha:85000", false, 1);
        addTestCase(q2, "1\n1,Alpha,50000", "1:Alpha:50000", false, 2);
        addTestCase(q2, "2\n10,Dev,99000\n11,Lead,120000", "11:Lead:120000", true, 3);
        addStarterCode(q2, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n    }\n}");

        Question q3 = new Question(topic, "HARD", "ACID Transaction Simulator (Commit or Rollback)", "acid-transaction-simulator",
                "Simulate a bank fund transfer between Account A and B with amount X. If Account A has sufficient balance, execute transfer and print `COMMITTED: A_BAL B_BAL`. If insufficient, abort and print `ROLLBACK: INSUFFICIENT FUNDS`.",
                "A_BAL B_BAL TRANSFER_AMOUNT",
                "Transaction status and updated balances.",
                "Balances >= 0");
        q3.setEditorialSolution("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long a = sc.nextLong(), b = sc.nextLong(), x = sc.nextLong();\n        if (a < x) System.out.println(\"ROLLBACK: INSUFFICIENT FUNDS\");\n        else {\n            a -= x; b += x;\n            System.out.println(\"COMMITTED: \" + a + \" \" + b);\n        }\n    }\n}");
        questionRepository.save(q3);
        addTestCase(q3, "1000 500 300", "COMMITTED: 700 800", false, 1);
        addTestCase(q3, "200 800 500", "ROLLBACK: INSUFFICIENT FUNDS", false, 2);
        addTestCase(q3, "1000 0 1000", "COMMITTED: 0 1000", true, 3);
        addStarterCode(q3, "import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n    }\n}");
    }

    private void addTestCase(Question q, String in, String out, boolean hidden, int order) {
        TestCase tc = new TestCase(q, in, out, hidden, order);
        testCaseRepository.save(tc);
    }

    private void addStarterCode(Question q, String starter) {
        CodeTemplate ct = new CodeTemplate(q, starter, null);
        codeTemplateRepository.save(ct);
    }

    // --- ASSESSMENTS SEEDING (MCQ, Output Prediction, Find Error) ---

    private void addAssessmentForIntro(Topic topic) {
        Assessment a = new Assessment(topic, "Java Fundamentals & JVM Mastery Quiz", 70, 15);
        assessmentRepository.save(a);

        assessmentQuestionRepository.save(new AssessmentQuestion(a, "OUTPUT_PREDICTION",
                "What will be the output of the following Java code snippet?",
                "public class Test {\n    public static void main(String[] args) {\n        int x = 5;\n        System.out.println(x++ + ++x);\n    }\n}",
                "[\"10\", \"11\", \"12\", \"13\"]",
                2, // 12 -> 5 + 7 = 12
                "`x++` returns 5 and increments x to 6. `++x` increments x to 7 and returns 7. 5 + 7 = 12."));

        assessmentQuestionRepository.save(new AssessmentQuestion(a, "MCQ",
                "Which component of Java is responsible for converting bytecode into machine-level native instructions at runtime?",
                null,
                "[\"JDK Compiler (javac)\", \"JIT (Just-In-Time) Compiler inside JVM\", \"Class Loader\", \"Bytecode Verifier\"]",
                1,
                "The JIT Compiler inside the JVM translates bytecode directly into native instructions for high performance."));

        assessmentQuestionRepository.save(new AssessmentQuestion(a, "FIND_ERROR",
                "Identify the compile-time error in this code:",
                "public class Demo {\n    public static void main(String[] args) {\n        byte b = 50;\n        b = b * 2;\n        System.out.println(b);\n    }\n}",
                "[\"b cannot be assigned 50\", \"b * 2 produces an int requiring an explicit cast to byte\", \"System.out.println cannot print byte values\", \"No error\"]",
                1,
                "Arithmetic operations with byte/short promote operands to int, so `b * 2` is of type int, causing compilation error without `(byte)(b * 2)`."));
    }

    private void addAssessmentForDataTypes(Topic topic) {
        Assessment a = new Assessment(topic, "Data Types & Operators Assessment", 70, 15);
        assessmentRepository.save(a);
        assessmentQuestionRepository.save(new AssessmentQuestion(a, "MCQ",
                "What is the default value of an uninitialized instance variable of type `boolean` in Java?",
                null, "[\"true\", \"false\", \"null\", \"0\"]", 1,
                "Instance boolean fields default to `false` in Java heap memory allocation."));
        assessmentQuestionRepository.save(new AssessmentQuestion(a, "OUTPUT_PREDICTION",
                "What is the result of evaluating this bitwise expression?",
                "public class BitTest {\n    public static void main(String[] args) {\n        System.out.println(10 ^ 10 ^ 7);\n    }\n}",
                "[\"0\", \"7\", \"10\", \"17\"]", 1,
                "XOR operation is self-inverting: X ^ X = 0, and 0 ^ Y = Y, so 10 ^ 10 ^ 7 = 7."));
    }

    private void addAssessmentForConditionals(Topic topic) {
        Assessment a = new Assessment(topic, "Conditionals & Decision Logic Assessment", 70, 15);
        assessmentRepository.save(a);
        assessmentQuestionRepository.save(new AssessmentQuestion(a, "OUTPUT_PREDICTION",
                "What will be printed by this switch case without break statements?",
                "int code = 2;\nswitch(code) {\n    case 1: System.out.print(\"A\");\n    case 2: System.out.print(\"B\");\n    case 3: System.out.print(\"C\");\n    default: System.out.print(\"D\");\n}",
                "[\"B\", \"BCD\", \"BC\", \"D\"]", 1,
                "Without break statements, switch falls through executing case 2, case 3, and default sequentially: 'BCD'."));
    }

    private void addAssessmentForForLoop(Topic topic) {
        Assessment a = new Assessment(topic, "For Loop Mechanics Assessment", 70, 15);
        assessmentRepository.save(a);
        assessmentQuestionRepository.save(new AssessmentQuestion(a, "OUTPUT_PREDICTION",
                "How many times will 'Java' be printed?",
                "for (int i = 0; i < 5; i++) {\n    if (i == 2) continue;\n    if (i == 4) break;\n    System.out.print(\"Java \");\n}",
                "[\"5 times\", \"4 times\", \"3 times\", \"2 times\"]", 2,
                "i=0 (print), i=1 (print), i=2 (continue), i=3 (print), i=4 (break). Total: 3 times."));
    }

    private void addAssessmentForWhileLoop(Topic topic) {
        Assessment a = new Assessment(topic, "While & Do-While Assessment", 70, 15);
        assessmentRepository.save(a);
        assessmentQuestionRepository.save(new AssessmentQuestion(a, "MCQ",
                "Which loop construct guarantees that its body is executed at least once regardless of the condition?",
                null, "[\"for loop\", \"while loop\", \"do-while loop\", \"for-each loop\"]", 2,
                "A do-while loop evaluates its termination condition at the bottom (post-test), ensuring at least 1 iteration."));
    }

    private void addAssessmentForMethods(Topic topic) {
        Assessment a = new Assessment(topic, "Methods & Call Stack Assessment", 70, 15);
        assessmentRepository.save(a);
        assessmentQuestionRepository.save(new AssessmentQuestion(a, "MCQ",
                "In Java, how are method arguments passed?",
                null, "[\"Strictly Pass-by-Value\", \"Strictly Pass-by-Reference\", \"Primitives by value, Objects by reference\", \"Depends on final keyword\"]", 0,
                "Java is strictly pass-by-value at all times. For object types, the reference handle value is copied by value."));
    }

    private void addAssessmentForArrays(Topic topic) {
        Assessment a = new Assessment(topic, "Arrays Deep Dive Assessment", 70, 15);
        assessmentRepository.save(a);
        assessmentQuestionRepository.save(new AssessmentQuestion(a, "MCQ",
                "Where in memory are array objects allocated in Java?",
                null, "[\"Stack\", \"Heap\", \"PermGen / Metaspace\", \"CPU Registers\"]", 1,
                "In Java, all arrays are objects and are allocated dynamically on the Heap."));
    }

    private void addAssessmentForStrings(Topic topic) {
        Assessment a = new Assessment(topic, "Strings & SCP Assessment", 70, 15);
        assessmentRepository.save(a);
        assessmentQuestionRepository.save(new AssessmentQuestion(a, "OUTPUT_PREDICTION",
                "What will be printed?",
                "String s1 = \"Java\";\nString s2 = new String(\"Java\");\nSystem.out.println((s1 == s2) + \" \" + s1.equals(s2));",
                "[\"true true\", \"false true\", \"false false\", \"true false\"]", 1,
                "`s1 == s2` compares memory addresses (SCP vs Heap), returning false. `s1.equals(s2)` compares characters, returning true."));
    }

    private void addAssessmentForOOP(Topic topic) {
        Assessment a = new Assessment(topic, "OOP Principles Assessment", 70, 15);
        assessmentRepository.save(a);
        assessmentQuestionRepository.save(new AssessmentQuestion(a, "MCQ",
                "Can an interface in Java 8+ have concrete methods?",
                null, "[\"No, never\", \"Yes, using default and static keywords\", \"Only private methods\", \"Only if abstract is omitted\"]", 1,
                "Java 8 introduced `default` and `static` methods in interfaces to enable backwards-compatible API evolution."));
    }

    private void addAssessmentForExceptions(Topic topic) {
        Assessment a = new Assessment(topic, "Exception Handling Assessment", 70, 15);
        assessmentRepository.save(a);
        assessmentQuestionRepository.save(new AssessmentQuestion(a, "MCQ",
                "Which block is guaranteed to execute even if an unhandled exception or return statement occurs in a try block?",
                null, "[\"catch block\", \"finally block\", \"throws clause\", \"static block\"]", 1,
                "The `finally` block always executes (unless System.exit(0) is called or JVM crashes)."));
    }

    private void addAssessmentForCollections(Topic topic) {
        Assessment a = new Assessment(topic, "Collections Framework Assessment", 70, 15);
        assessmentRepository.save(a);
        assessmentQuestionRepository.save(new AssessmentQuestion(a, "MCQ",
                "What data structure is used by HashMap in Java 8 when a bucket has more than 8 elements and capacity >= 64?",
                null, "[\"Linked List\", \"Red-Black Balanced Binary Search Tree\", \"Skip List\", \"B-Tree\"]", 1,
                "Java 8 treeifies bucket linked lists into Red-Black Trees for O(log N) worst-case search performance."));
    }

    private void addAssessmentForStreams(Topic topic) {
        Assessment a = new Assessment(topic, "Java 8 Streams Assessment", 70, 15);
        assessmentRepository.save(a);
        assessmentQuestionRepository.save(new AssessmentQuestion(a, "MCQ",
                "Which operation is a terminal operation in a Java Stream pipeline?",
                null, "[\"filter()\", \"map()\", \"collect()\", \"sorted()\"]", 2,
                "`collect()` triggers pipeline execution and consumes the stream. filter, map, and sorted are intermediate lazy operations."));
    }

    private void addAssessmentForConcurrency(Topic topic) {
        Assessment a = new Assessment(topic, "Multithreading & Concurrency Assessment", 70, 15);
        assessmentRepository.save(a);
        assessmentQuestionRepository.save(new AssessmentQuestion(a, "MCQ",
                "What does the volatile keyword guarantee in Java?",
                null, "[\"Atomicity of compound operations\", \"Visibility of variable changes across threads and prevents instruction reordering\", \"Thread lock acquisition\", \"Garbage collection prevention\"]", 1,
                "`volatile` ensures memory visibility by reading/writing directly to main memory and prevents compiler instruction reordering."));
    }

    private void addAssessmentForJDBC(Topic topic) {
        Assessment a = new Assessment(topic, "JDBC & Transactions Assessment", 70, 15);
        assessmentRepository.save(a);
        assessmentQuestionRepository.save(new AssessmentQuestion(a, "MCQ",
                "Why is PreparedStatement preferred over Statement in JDBC?",
                null, "[\"Prevents SQL injection vulnerabilities\", \"Pre-compiled queries improve performance\", \"Handles date/binary parameters seamlessly\", \"All of the above\"]", 3,
                "PreparedStatement prevents SQL injection by parameterizing inputs, caches query execution plans, and handles typed parameters."));
    }
}
