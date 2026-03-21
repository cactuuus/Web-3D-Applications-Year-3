/**
 * Simple interface to represent the models.
 */
export interface Model {
    id: string;
    number: number;
    name: string;
    description: string;
}

export const models: Model[] = [
    {
        id: 'moka',
        number: 1,
        name: 'The Moka Pot',
        description:
            'Invented in 1933 by Alfonso Bialetti, the moka pot brews coffee by passing boiling water pressurised by steam through ground coffee. The result is a strong, rich brew that is a staple in Italian households and cafes.',
    },
    {
        id: 'chemex',
        number: 2,
        name: 'The Chemex',
        description:
            'Designed in 1941 by chemist Peter Schlumbohm, the Chemex is as much sculpture as it is a brewer. A single piece of borosilicate glass, often accompanied by a wooden collar and a leather tie. A perfect blend of style and efficiency.',
    },
    {
        id: 'aeropress',
        number: 3,
        name: 'The Aeropress',
        description:
            "Born in 2005 from Alan Adler's obsession with coffee, the Aeropress is incredibly simple in concept and execution. Despite this, this little brewer is renowned for its flexibility and wide range of brewing techniques.",
    },
];
