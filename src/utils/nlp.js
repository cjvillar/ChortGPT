
import { FILLERS, FOLLOW_UPS, REFLECTIONS, PEOPLE_RESPONSES, TOPIC_RESPONSES } from '../data/responses';

// lazy load nlp
let _nlp = null;
const getNlp = async () => {
    if (!_nlp) _nlp = (await import('compromise')).default;
    return _nlp;
};

const filler = () => FILLERS[Math.floor(Math.random() * FILLERS.length)];
const followUp = () => FOLLOW_UPS[Math.floor(Math.random() * FOLLOW_UPS.length)];

export async function parseIntent(input, memory = []) {
    const nlp = await getNlp(input);
    const doc = nlp(input);
    const lower = input.toLowerCase();

    // reflections
    for (const [pattern, fn] of Object.entries(REFLECTIONS)) {
        if (lower.includes(pattern)) {
            const after = lower.split(pattern)[1]?.trim() || "";
            const noun =
                nlp(after).nouns().first().text() ||
                nlp(after).verbs().first().text() ||
                after.split(" ").slice(0, 3).join(" ") ||
                "that";
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

    // Verb tense reflection
    const pastVerb = doc.verbs().toPastTense().out("text");
    if (pastVerb) {
        return `${filler()}So you ${pastVerb}… how did that leave you feeling?`;
    }

    // topic
    const topic = doc.nouns().first().text();
    if (topic) {
        const fn = TOPIC_RESPONSES[Math.floor(Math.random() * TOPIC_RESPONSES.length)];
        return `${filler()}${fn(topic)}`;
    }

    //  questions
    const isImpliedQuestion =
        doc.has("(who|what|where|when|why|how)") && !input.trim().endsWith("?");
    if (isImpliedQuestion) {
        return `${filler()}${followUp()}`;
    }


    return { noMatch: true, topic };  // no match fall through
}