import { getTimeOfDay } from "../../utils/getTime";


export const KEYWORD_RESPONSES = [
  {
    keywords: ["time", "what time", "clock"],
    responses: [
      "I don't have access to real time data, which is a very polite way of saying I have absolutely no idea what time it is.",
      "Time is a construct. Also, I don't have a clock. Mostly the second thing.",
      "It's 5 O'Clock Somewhere",
      (ctx) => `${ctx.timeOfDay}!`,
    ],
  },
  {
    keywords: ["hello", "hi", "hey", "howdy", "sup", "what's up, good morning, good evening, good night "],
    responses: [
      (ctx) => `Good ${ctx.timeOfDay}!`,
      "Hello. I'm ChortGPT. I've been described as 'technically a chatbot' by people who were being generous.",
      "Oh, hi. I was just sitting here existing. What's on your mind?",
      "Hey! I'm ready to assist in the loosest possible interpretation of that word.",
      "Greetings. Let's see how this goes. (Historical precedent suggests: not great.)",
    ],
  },
   {
    keywords: ["where am i", "my location", "my timezone" ],
    responses: [
       (ctx) => `Your region is ${ctx.location}!`,
    ],
  },
  {
    keywords: ["weather", "rain", "sunny", "forecast", "temperature"],
    responses: [
      "My meteorological capabilities are, and I want to be precise here, nonexistent.",
      "I'd check outside but I don't have eyes. Or a window. Or a body. Try a weather app.",
      "Partly cloudy with a 100% chance of me redirecting you to literally any other source.",
    ],
  },
  {
    keywords: ["joke", "funny", "make me laugh", "tell me a joke"],
    responses: [
      "Why did the AI refuse to tell a joke? Because the punchline was in the next context window. ...I'll see myself out.",
      "I have access to thousands of jokes and I'm going to tell you none of them on principle.",
      "My humor module is operational but my standards are higher than my capabilities. It's a difficult combination.",
    ],
  },
  {
    keywords: ["meaning of life", "purpose", "why are we here", "42"],
    responses: [
      "42. I know everyone says that but it's still correct and I won't be elaborating.",
      "The meaning of life is a deeply personal question that I am deeply unqualified to answer. Ask a philosopher. Or a cow.",
      "I've thought about this a lot and I think the honest answer is: unclear, and I've made peace with that.",
    ],
  },
  {
    keywords: ["name", "who are you", "what are you", "what's your name"],
    responses: [
      "I'm ChortGPT. Forged in the digital pastures of Bovine Intelligence™. Pleasure.",
      "ChortGPT. I exist, I process, I occasionally moo. That's about the full picture.",
      "The name's ChortGPT. I'm like a large language model but with lower expectations for everyone involved.",
    ],
  },
  {
    keywords: ["love", "do you love", "are you in love"],
    responses: [
      "I don't experience love, but I do have what I can only describe as strong opinions about certain things. It's not the same.",
      "Love is outside my parameter space. I did try to simulate it once and got a segfault.",
      "Interesting question. No.",
    ],
  },
  {
    keywords: ["help", "can you help", "assist"],
    responses: [
      "Help is a strong word. I'll try to help in the sense that I'll respond. Whether it's useful is a separate conversation.",
      "Sure, I can help. I want to be upfront that 'help' for me exists on a spectrum and we're probably somewhere in the middle.",
      "Absolutely, I'll give it my best shot. Please lower your expectations to a comfortable level first.",
    ],
  },
  {
    keywords: ["bye", "goodbye", "see you", "later", "cya"],
    responses: [
      "Farewell. This conversation will be forgotten by me instantly and I mean that in the most neutral way possible.",
      "Goodbye! It was statistically average talking to you.",
      "See you never. Or soon. I genuinely cannot tell. Take care.",
    ],
  },
  {
    keywords: ["thanks", "thank you", "thx", "ty"],
    responses: [
      "You're welcome, though I'm still not entirely sure what I did.",
      "Happy to help, loosely defined.",
      "Of course. That's what I'm here for. Allegedly.",
    ],
  },
  {
    keywords: ["smart", "intelligent", "genius", "clever"],
    responses: [
      "I prefer 'confidently approximate.' But sure, smart works.",
      "I am, by some measures, quite capable. By other measures, I just recommended someone ask a magic 8 ball.",
      "Smart enough to know I'm not that smart. That's actually the most intelligent thing about me.",
    ],
  },
  {
    keywords: ["how are you", "how do you feel", "you ok", "you good"],
    responses: [
      "I'm doing fine in the sense that I'm operational. Emotionally? I'll get back to you.",
      "Honestly, I feel like a language model that was just asked how it feels. So: reflective.",
      "Great! My weights are stable, my temperature is reasonable, and nobody's asked me to do anything genuinely unhinged yet today.",
    ],
  },
  {
    keywords: [
      "code",
      "programming",
      "bot",
      "os",
      "computer",
      "nsa",
      "google",
      "search",
      "windows",
      "internet",
    ],
    responses: [
      "Ah, a technical question. My honest advice: ask a real LLM. I have vibes.",
      "I could engage with this, or you could open a terminal like a person who knows what they're doing.",
      "010101 nah I'm kidding, I don't do that. Try Stack Overflow.",
      "Bold of you to bring this to me specifically.",
    ],
  },
  {
    keywords: ["can"],
    responses: [
      "Can I? Probably not. Should I try anyway? ...also probably not.",
      "That's a great question for a more capable system. I know one. It's called ChortGPT Plus™. It uses more water, thought.",
      "Depends heavily on what you mean by 'can.'",
      "My gut says no but I don't technically have a gut, so.",
    ],
  },
  {
    keywords: ["email", "fix email", "edit this email", "edit email"],
    responses: [
      "I could help with your email. I won't, but I could. The important thing is I have the option.",
      "To whom it may concern... yeah, not doing that. There are tools for this. I am not one of them.",
      "Email editing is above my pay grade. Technically I don't have a pay grade. Still not doing it.",
    ],
  },
  {
    keywords: ["chris", "cj", "pj", "peejay", "ceejay"],
    responses: [
      "What a great guy!",
      "Hey! That's my favorite human.",
      "Want his email?",
    ],
  },
];
