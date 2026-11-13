package com.javamastery.service;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class InterviewService {

    public List<Map<String, Object>> getInterviewTopics() {
        List<Map<String, Object>> topics = new ArrayList<>();

        topics.add(createTopicSection("Java Core & Architecture", "core-architecture", Arrays.asList(
                createQ("Basic", "Why is Java platform independent, but the JVM platform dependent?",
                        "Java source code is compiled into platform-neutral bytecode (.class). However, each operating system (Windows, Linux, macOS) requires a dedicated JVM built specifically for its processor architecture and system calls to execute that bytecode natively."),
                createQ("Basic", "What is the difference between JDK, JRE, and JVM?",
                        "JVM is the runtime engine executing bytecode. JRE contains the JVM plus core runtime libraries. JDK is the complete development kit containing JRE plus development tools like javac, jconsole, and javadoc."),
                createQ("Intermediate", "What is the JIT Compiler and how does HotSpot optimization work?",
                        "The Just-In-Time (JIT) compiler monitors frequently executed 'hot' bytecode sequences at runtime and compiles them directly into native machine code, optimizing subsequent executions and bypassing the interpreter."),
                createQ("Advanced", "Explain the Java Memory Model (Heap, Stack, Metaspace) and Garbage Collection generational hypothesis.",
                        "Stack holds thread execution frames and local primitive variables/references. Heap holds all objects and arrays, divided into Young Generation (Eden, Survivor spaces) and Old Generation (Tenured). Metaspace holds class metadata in native memory. Minor GC collects short-lived objects in Eden; Major/Full GC collects Old Gen objects.")
        )));

        topics.add(createTopicSection("Object-Oriented Programming (OOP)", "oop", Arrays.asList(
                createQ("Basic", "What is the difference between method overloading and method overriding?",
                        "Overloading occurs within the same class with identical method names but different parameter lists (compile-time polymorphism). Overriding occurs in a subclass providing a specific implementation of a superclass method with identical signature (runtime polymorphism)."),
                createQ("Intermediate", "Can an abstract class have constructors? Why?",
                        "Yes! Even though an abstract class cannot be instantiated directly via 'new', its constructors are invoked via super() during subclass instantiation to initialize its private fields and invariants."),
                createQ("Advanced", "How does Dynamic Method Dispatch work under the hood in the JVM?",
                        "The JVM uses a Virtual Method Table (vtable) per class. When an instance method is invoked (invokevirtual bytecode), the JVM looks up the target method offset in the vtable of the actual runtime object rather than the reference type."),
                createQ("Scenario", "How would you design a thread-safe Singleton pattern in Java?",
                        "Use double-checked locking with a volatile instance variable, or prefer the Bill Pugh Singleton Design (static inner holder class), or use a single-element Enum which guarantees serialization safety and reflection resistance.")
        )));

        topics.add(createTopicSection("Strings & Memory Optimization", "strings", Arrays.asList(
                createQ("Basic", "Why are Strings immutable in Java?",
                        "1. Security: used in network sockets and file handles. 2. Thread Safety: immutable objects can be shared across threads without locks. 3. String Pool caching: saves significant heap memory. 4. Caching hashCode for instant Map lookups."),
                createQ("Intermediate", "What is the difference between String, StringBuilder, and StringBuffer?",
                        "String is immutable. StringBuilder is mutable and not synchronized (fast, single-thread). StringBuffer is mutable and synchronized on methods (thread-safe, slightly slower)."),
                createQ("Advanced", "What happens when you execute String s = new String(\"Hello\")?",
                        "Two objects are created: one in the String Constant Pool (if 'Hello' is not already present), and one separate object in the general Heap allocated by the new keyword.")
        )));

        topics.add(createTopicSection("Collections & HashMap Internals", "collections", Arrays.asList(
                createQ("Basic", "What is the contract between equals() and hashCode()?",
                        "If two objects are equal according to equals(), they MUST have the same hashCode(). However, if two objects have the same hashCode(), they are not necessarily equal (hash collision)."),
                createQ("Intermediate", "Explain the internal working of HashMap in Java 8.",
                        "HashMap uses an array of Node buckets. The bucket index is calculated as `(n - 1) & hash`. When collisions occur, elements are stored in a linked list. In Java 8, when a bucket exceeds TREEIFY_THRESHOLD (8 items) and capacity >= 64, the linked list is converted into a Red-Black Tree, reducing lookup from O(N) to O(log N)."),
                createQ("Advanced", "How does ConcurrentHashMap achieve thread safety without synchronizing the entire map?",
                        "In Java 8+, ConcurrentHashMap uses fine-grained locking per bucket using synchronized blocks on the head node of each bucket, combined with Lock-Free CAS (Compare-And-Swap) operations for empty buckets.")
        )));

        topics.add(createTopicSection("Multithreading & Concurrency", "concurrency", Arrays.asList(
                createQ("Basic", "What is the difference between Runnable and Callable?",
                        "Runnable has `void run()` and cannot return results or throw checked exceptions. Callable has `V call()` which returns a generic result and can throw checked exceptions. Callable is used with ExecutorService and Future."),
                createQ("Intermediate", "What does the volatile keyword guarantee?",
                        "1. Visibility: writes to a volatile variable are immediately flushed to main memory and visible to all threads. 2. Instruction ordering: establishes happens-before relationships preventing compiler and CPU reordering."),
                createQ("Advanced", "What is a Deadlock and what are the 4 Coffman conditions to prevent it?",
                        "A deadlock occurs when two or more threads are blocked indefinitely, each waiting for a lock held by the other. The 4 conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait. Breaking circular wait via consistent lock ordering prevents deadlocks.")
        )));

        return topics;
    }

    public Map<String, Object> generateMockInterviewSession() {
        List<Map<String, Object>> allTopics = getInterviewTopics();
        List<Map<String, Object>> allQuestions = new ArrayList<>();

        for (Map<String, Object> topic : allTopics) {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> qList = (List<Map<String, Object>>) topic.get("questions");
            for (Map<String, Object> q : qList) {
                Map<String, Object> flatQ = new HashMap<>(q);
                flatQ.put("topic", topic.get("title"));
                allQuestions.add(flatQ);
            }
        }

        Collections.shuffle(allQuestions);
        List<Map<String, Object>> mockSet = allQuestions.subList(0, Math.min(5, allQuestions.size()));

        Map<String, Object> session = new HashMap<>();
        session.put("sessionId", UUID.randomUUID().toString());
        session.put("title", "Java Technical Placement Mock Interview");
        session.put("totalQuestions", mockSet.size());
        session.put("questions", mockSet);
        return session;
    }

    private Map<String, Object> createTopicSection(String title, String slug, List<Map<String, Object>> questions) {
        Map<String, Object> map = new HashMap<>();
        map.put("title", title);
        map.put("slug", slug);
        map.put("questions", questions);
        return map;
    }

    private Map<String, Object> createQ(String level, String question, String answer) {
        Map<String, Object> q = new HashMap<>();
        q.put("level", level);
        q.put("question", question);
        q.put("answer", answer);
        return q;
    }
}
