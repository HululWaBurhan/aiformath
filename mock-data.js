const mockTheorems = {
    theorems: [
        {
            id: 1,
            title: "Pythagorean Theorem",
            statement: "In a right triangle, the square of the length of the hypotenuse is equal to the sum of squares of the other two sides.",
            formalStatement: "∀ a b c ∈ ℝ, a² + b² = c² where c is the hypotenuse",
            proof: [
                "Let ABC be a right triangle with right angle at C",
                "Draw altitude h from C to hypotenuse AB",
                "By similar triangles: a/h = h/b",
                "Therefore: h² = ab",
                "Area of triangle = (1/2)c × h",
                "Area of triangle = (1/2)a × b",
                "Therefore: c² = a² + b²"
            ],
            upvotes: 42,
            comments: [
                { user: "MathLover", text: "Elegant proof using similar triangles!" },
                { user: "GeometryFan", text: "This is fundamental to so many other proofs." }
            ]
        },
        {
            id: 2,
            title: "Triangle Inequality",
            statement: "The sum of the lengths of any two sides of a triangle must be greater than the length of the remaining side.",
            formalStatement: "∀ a b c ∈ ℝ⁺, (a + b > c) ∧ (b + c > a) ∧ (a + c > b)",
            proof: [
                "Consider triangle ABC with sides a, b, c",
                "By definition, a straight line is the shortest path between two points",
                "Therefore, going from A to B directly (c) must be shorter than going from A to C to B (a + b)",
                "Hence: a + b > c",
                "Similar arguments prove b + c > a and a + c > b"
            ],
            upvotes: 35,
            comments: [
                { user: "ProofMaster", text: "A beautiful application of the shortest path principle." }
            ]
        }
    ],
    connections: [
        { source: 1, target: 2, relationship: "prerequisite" }
    ]
};

const mockResponses = {
    formalization: {
        "angle bisector theorem": {
            formalStatement: "∀ ABC ∈ Triangle, Let D ∈ BC, AD bisects ∠BAC ⟹ (BD/DC = AB/AC)",
            steps: [
                "1. Let AD be the angle bisector of ∠BAC",
                "2. Let D be the point where AD intersects BC",
                "3. ∠BAD = ∠CAD (given)",
                "4. Consider triangles ABD and ACD",
                "5. Apply sine law to both triangles",
                "6. Conclude BD/DC = AB/AC"
            ]
        }
    },
    informalization: {
        "∀ x ∈ ℝ, x² ≥ 0": {
            explanation: "For any real number x, when we square it (multiply it by itself), we always get a non-negative number. This is because multiplying two negative numbers gives a positive result, and multiplying two positive numbers also gives a positive result.",
            examples: [
                "For x = 2: 2² = 4 ≥ 0",
                "For x = -3: (-3)² = 9 ≥ 0",
                "For x = 0: 0² = 0 ≥ 0"
            ]
        }
    },
    nextSteps: {
        "prove limit exists": [
            "Show the sequence is monotonic",
            "Show the sequence is bounded",
            "Apply the Monotone Convergence Theorem"
        ]
    }
};

const userStatus = {
    online: ["Mohammed", "Sarah", "John"],
    typing: {
        user: "Mohammed",
        location: "Natural Language Input"
    }
};
