
import { FILLERS, FOLLOW_UPS, REFLECTIONS, PEOPLE_RESPONSES, TOPIC_RESPONSES, VERB_RESPONSES } from '../data/responses';

// lazy load nlp
let _nlp = null;
const getNlp = async () => {
    if (!_nlp) _nlp = (await import('compromise')).default;
    return _nlp;
};

const filler = () => FILLERS[Math.floor(Math.random() * FILLERS.length)];
const followUp = () => FOLLOW_UPS[Math.floor(Math.random() * FOLLOW_UPS.length)];
// Verb tense reflection
const SKIP_VERBS = ["is", "are", "was", "were", "be", "been", "am", "have", "has", "had", "do", "did"];
const WEAK_NOUNS = ["i", "i'm", "im", "it", "that", "this", "he", "she", "they", "you", "youre", "you're", "your"];


export async function parseIntent(input, memory = []) {
    const nlp = await getNlp(input);
    const doc = nlp(input);
    const lower = input.toLowerCase();

    // reflections

    for (const [pattern, fn] of Object.entries(REFLECTIONS)) {
        if (lower.includes(pattern)) {
            const after = lower.split(pattern)[1]?.trim() || "";

            // clean up contractions and pronouns. TODO: extract grwoin list
            const cleaned = after
                .replace(/i'm/g, "")
                .replace(/\bim\b/g, "")
                .replace(/i've/g, "")
                .replace(/i'd/g, "")
                .replace(/\blike\b/g, "")
                .replace(/\bto\b/g, "")
                .replace(/\bfor\b.*/g, "")
                .replace(/\bof\b.*/g, "")
                .replace(/\babout\b.*/g, "")
                .trim();

            const rawNoun =
                nlp(cleaned).nouns().first().text() ||
                nlp(cleaned).verbs().first().text() ||
                (!WEAK_NOUNS.includes(cleaned.split(" ")[0]) ? cleaned.split(" ").slice(0, 3).join(" ") : null) ||
                "that way";

            const noun = rawNoun.toLowerCase() === "you" ? "I am"
                : rawNoun.toLowerCase() === "i" ? "you"
                    : rawNoun.replace(/^(the|a|an) /i, "");
            const memoryHint =
                memory.length > 0
                    ? ` (You mentioned "${memory[memory.length - 1]}" earlier, is this related?)`
                    : "";
            return `${filler()}${fn(noun)}${memoryHint}`;
        }
    }

    // names
    const people = doc.people().json();
    if (people.length > 0) {
        const name = people[0].text;
        const fn = PEOPLE_RESPONSES[Math.floor(Math.random() * PEOPLE_RESPONSES.length)];
        return `${filler()}${fn(name)}`;
    }

    // negative verb and person noun
    const hasNegativeVerb = doc.verbs().if("(hate|hated|resent|resented|miss|missed|lost|hurt|ignored|left|blame|blamed)").found;
    const hasPerson = doc.nouns().if("#Person").found;
    if (hasNegativeVerb && hasPerson) {
        return `${filler()}Sounds like someone let you down.`;
    }



    const verbDoc = doc
        .verbs()
        .filter(v => !SKIP_VERBS.includes(v.text().toLowerCase().trim()));

    if (verbDoc.found) {
        const pastVerb = verbDoc.first().toPastTense().out("text");
        // bail if the result still contains a linking verb
        const stillWeak = SKIP_VERBS.some(skip => pastVerb.toLowerCase().includes(skip));
        if (pastVerb && !stillWeak) {
            const fn = VERB_RESPONSES[Math.floor(Math.random() * VERB_RESPONSES.length)];
            return `${filler()}${fn(pastVerb)}`;
        }
    }

    //  questions
    const isImpliedQuestion =
        doc.has("(who|what|where|when|why|how)") && !input.trim().endsWith("?");
    if (isImpliedQuestion) {
        return `${filler()}${followUp()}`;
    }

    // topic
    const rawTopic = doc.nouns().first().text();
    const topic = rawTopic.toLowerCase() === "you" ? "me"
        : rawTopic.toLowerCase() === "i" ? "you"
            : rawTopic;
    if (topic) {
        const fn = TOPIC_RESPONSES[Math.floor(Math.random() * TOPIC_RESPONSES.length)];
        return `${filler()}${fn(topic)}`;
    }




    return { noMatch: true, topic };  // no match fall through
}