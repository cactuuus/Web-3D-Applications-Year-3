const PATH_PREFIX = 'assets/environments/';

/**
 * Interface to represent environments, which are HDRIs that can be used for the scene's background.
 */
export interface Environment {
    name: string;
    source: string;
    path: string;
}

/**
 * List of all available environments.
 */
export const environments: Environment[] = [
    {
        name: 'Garden',
        source: `https://polyhaven.com/a/studio_garden`,
        path: `${PATH_PREFIX}garden.hdr`,
    },
    {
        name: 'Studio',
        source: `https://polyhaven.com/a/brown_photostudio_02`,
        path: `${PATH_PREFIX}studio.hdr`,
    },
    {
        name: 'Street',
        source: `https://polyhaven.com/a/wide_street_01`,
        path: `${PATH_PREFIX}street.hdr`,
    },
    {
        name: 'Seaside',
        source: `https://polyhaven.com/a/venice_sunset`,
        path: `${PATH_PREFIX}seaside.hdr`,
    },
    {
        name: 'Sunrise',
        source: 'https://polyhaven.com/a/spruit_sunrise',
        path: `${PATH_PREFIX}sunrise.hdr`,
    },
    {
        name: 'Moonlight',
        source: 'https://polyhaven.com/a/moonlit_golf',
        path: `${PATH_PREFIX}moonlight.hdr`,
    },
    {
        name: 'Field',
        source: 'https://polyhaven.com/a/noon_grass',
        path: `${PATH_PREFIX}field.hdr`,
    },
    {
        name: 'Urban',
        source: 'https://polyhaven.com/a/canary_wharf',
        path: `${PATH_PREFIX}urban.hdr`,
    },
];
