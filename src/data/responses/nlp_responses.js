export const FILLERS = [
    "Hmm… ", "Well… ", "Interesting. ", "Okay so… ", "Right, ", "I mean… ", "Ah, ", "Ok, ",
];

export const REFLECTIONS = {
    "i feel": (noun) => `Why do you feel ${noun}?`,
    "i am": (noun) => `How long have you been ${noun}?`,
    "i can't": (noun) => `What makes it hard to ${noun}?`,
    "i need": (noun) => `What would having ${noun} change for you?`,
    "i want": (noun) => `What would it mean if you got ${noun}?`,
    "i think": (noun) => `What makes you think ${noun}?`,
    "i hate": (noun) => `When did you start feeling that way about ${noun}?`,
    "i love": (noun) => `What do you love most about ${noun}?`,
};

export const FOLLOW_UPS = [
    "That sounds frustrating. When did this start?",
    "Tell me more about that.",
    "How long has that been on your mind?",
    "And how does that make you feel?",
    "What do you think is behind that?",
];


export const PEOPLE_RESPONSES = [
    (name) => `Who's ${name} in all this?`,
    (name) => `What's your relationship with ${name} like?`,
    (name) => `How does ${name} fit into this?`,
    (name) => `Has ${name} always been part of this?`,
    (name) => `What does ${name} think about it?`,
];

export const TOPIC_RESPONSES = [
    (topic) => `Sounds like this is about ${topic}.`,
    (topic) => `${topic} seems to be at the center of this.`,
    (topic) => `Let's talk about ${topic}, what's going on there?`,
    (topic) => `Is ${topic} something that's been on your mind a while?`,
    (topic) => `What is it about ${topic} that's bothering you?`,
];