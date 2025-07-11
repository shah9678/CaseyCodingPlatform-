import json
import random
from faker import Faker

# Initialize Faker for generating random text
fake = Faker()

# Define the personality types
personalities = ["Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Neuroticism"]

# Define the topics with their subtopics
topics = {
    "Conditional Statements": [
        "if-else statements", 
        "switch-case statements",
        "ternary operators",
        "nested conditionals",
        "logical operators"
    ],
    "Loops and Functions": [
        "for loops",
        "while loops",
        "recursion",
        "function parameters",
        "higher-order functions"
    ],
    "Data Structures and OOP": [
        "classes and objects",
        "inheritance",
        "polymorphism",
        "encapsulation",
        "linked lists",
        "stacks and queues"
    ],
    "Arrays and Graphs": [
        "array manipulation",
        "matrix operations",
        "graph traversal",
        "shortest path algorithms",
        "tree structures"
    ]
}

# Function to generate a random challenge based on topic and subtopic
def generate_challenge(topic, subtopic):
    if topic == "Conditional Statements":
        if subtopic == "if-else statements":
            return f"Write a function that takes an integer and returns 'Positive' if it's greater than 0, 'Negative' if less than 0, and 'Zero' if 0."
        elif subtopic == "switch-case statements":
            return f"Create a program that takes a day number (1-7) and uses a switch-case statement to print the corresponding day name."
        elif subtopic == "ternary operators":
            return f"Rewrite the following if-else statement using a ternary operator: {fake.sentence()}"
        elif subtopic == "nested conditionals":
            return f"Implement a function that categorizes a person's age into child (<13), teen (13-19), adult (20-64), or senior (65+)."
        else:  # logical operators
            return f"Write a program that checks if a year is a leap year and divisible by 100 (special leap year case)."
    
    elif topic == "Loops and Functions":
        if subtopic == "for loops":
            return f"Write a function that uses a for loop to calculate the factorial of a given number."
        elif subtopic == "while loops":
            return f"Create a program that uses a while loop to keep asking for user input until they enter a prime number."
        elif subtopic == "recursion":
            return f"Implement a recursive function to calculate the nth Fibonacci number."
        elif subtopic == "function parameters":
            return f"Write a function that accepts a variable number of arguments and returns their average."
        else:  # higher-order functions
            return f"Create a higher-order function that takes a function and a list, and applies the function to each element of the list."
    
    elif topic == "Data Structures and OOP":
        if subtopic == "classes and objects":
            return f"Create a 'Car' class with attributes like make, model, and year, and methods to display the car's details."
        elif subtopic == "inheritance":
            return f"Implement a 'Vehicle' parent class and 'Car' and 'Motorcycle' child classes that inherit from it."
        elif subtopic == "polymorphism":
            return f"Demonstrate polymorphism by creating a base 'Shape' class with an 'area()' method, overridden by 'Circle' and 'Rectangle' subclasses."
        elif subtopic == "encapsulation":
            return f"Create a 'BankAccount' class with private attributes for balance and public methods to deposit, withdraw, and check balance."
        elif subtopic == "linked lists":
            return f"Implement a singly linked list with methods to add nodes, remove nodes, and traverse the list."
        else:  # stacks and queues
            return f"Create a stack class with push, pop, and peek methods, and demonstrate its LIFO behavior."
    
    else:  # Arrays and Graphs
        if subtopic == "array manipulation":
            return f"Write a function that takes an array of integers and returns a new array with all duplicates removed."
        elif subtopic == "matrix operations":
            return f"Implement a function that multiplies two matrices and returns the resulting matrix."
        elif subtopic == "graph traversal":
            return f"Create a function that performs DFS traversal on a graph represented as an adjacency list."
        elif subtopic == "shortest path algorithms":
            return f"Implement Dijkstra's algorithm to find the shortest path between two nodes in a weighted graph."
        else:  # tree structures
            return f"Write a function that performs an in-order traversal of a binary tree and returns the elements in a list."

# Function to generate hints based on challenge and personality
def generate_hints(challenge, personality):
    hints = []
    for i in range(1, 6):
        label = f"H{i}"
        
        if personality == "Openness":
            hint = f"Think creatively about how to approach this problem. {fake.sentence()}"
        elif personality == "Conscientiousness":
            hint = f"Pay close attention to the details. {fake.sentence()}"
        elif personality == "Extraversion":
            hint = f"Consider how you might explain this to someone else. {fake.sentence()}"
        elif personality == "Agreeableness":
            hint = f"Remember to make your solution clear and understandable. {fake.sentence()}"
        else:  # Neuroticism
            hint = f"Take it step by step to ensure correctness. {fake.sentence()}"
        
        hints.append({"label": label, "hint": hint})
    
    return hints

# Generate the dataset
dataset = []
for topic, subtopics in topics.items():
    for subtopic in subtopics:
        # Generate 4-5 problems per subtopic (adjust as needed)
        for _ in range(random.randint(4, 5)):
            challenge = generate_challenge(topic, subtopic)
            personality = random.choice(personalities)
            hints = generate_hints(challenge, personality)
            
            dataset.append({
                "topic": topic,
                "personality": personality,
                "challenge": challenge,
                "hints": hints
            })

# Save to JSON file
with open('generated_hints_dataset.json', 'w') as f:
    json.dump(dataset, f, indent=2)

print(f"Generated dataset with {len(dataset)} problems and {len(dataset)*5} hints.")