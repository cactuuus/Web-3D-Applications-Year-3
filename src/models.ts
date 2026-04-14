const MODELS_PATH_PREFIX = 'assets/models/';
const PREVIEWS_PATH_PREFIX = 'assets/previews/';
const INFO_PATH_PREFIX = 'assets/info/';

/**
 * Simple interface to represent the model's metadata.
 */
export interface Model {
    id: string;
    number: number;
    name: string;
    description: string;
    path: string;
    preview: string;
    content: string;
}

/**
 * Constructs a 'pretty ID' by combining the model's number and id.
 * @param model The model for which to generate the pretty ID.
 * @returns A string in the format 'XX.id', like '01.moka' or '02.chemex'.
 */
export function prettyId(model: Model): string {
    return `${String(model.number).padStart(2, '0')}.${model.id}`;
}

/**
 * List of all models available.
 */
export const models: Model[] = [
    {
        id: 'aeropress',
        number: 1,
        name: 'The AeroPress',
        description:
            "Born in 2005 from Alan Adler's obsession with coffee, the AeroPress is incredibly simple in concept and execution. Despite this, this little brewer is renowned for its flexibility and wide range of brewing techniques.",
        path: `${MODELS_PATH_PREFIX}aeropress.glb`,
        preview: `${PREVIEWS_PATH_PREFIX}aeropress.webp`,
        content: `${INFO_PATH_PREFIX}aeropress.html`,
    },
    {
        id: 'chemex',
        number: 2,
        name: 'The Chemex',
        description:
            'Designed in 1941 by chemist Peter Schlumbohm, the Chemex is as much sculpture as it is a brewer. A single piece of borosilicate glass, often accompanied by a wooden collar and a leather tie. A perfect blend of style and efficiency.',
        path: `${MODELS_PATH_PREFIX}chemex.glb`,
        preview: `${PREVIEWS_PATH_PREFIX}chemex.webp`,
        content: `${INFO_PATH_PREFIX}chemex.html`,
    },
    {
        id: 'moka',
        number: 3,
        name: 'The Moka Pot',
        description:
            'Invented in 1933 by Alfonso Bialetti, the moka pot brews coffee by passing boiling water pressurised by steam through ground coffee. The result is a strong, rich brew that is a staple in Italian households and cafes.',
        path: `${MODELS_PATH_PREFIX}moka.glb`,
        preview: `${PREVIEWS_PATH_PREFIX}moka.webp`,
        content: `${INFO_PATH_PREFIX}moka.html`,
    },
];
