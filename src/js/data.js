const example_processes = [
    {
        name: "ctx_apo/agaric2",
        processed: 25600,
        indexed: 6390,
        integrated: 7761,
    },
    {
        name: "vioc_vo_4sh/agathe23",
        processed: 32000,
        indexed: 1250,
        integrated: 1399,
    },
    {
        name: "vioc_vo_4sh/agathe45",
        processed: 32000,
        indexed: 1662,
        integrated: 1866,
    },
    {
        name: "vioc_vo_4sh/agathe67",
        processed: 32000,
        indexed: 1853,
        integrated: 2056,
    },
    {
        name: "ctx_erta/benzos",
        processed: 25600,
        indexed: 4419,
        integrated: 5268,
    },
    {
        name: "ipns_vo_ahcc/bianca12",
        processed: 32000,
        indexed: 12568,
        integrated: 16106,
    },
    {
        name: "ipns_vo_ahcc/bianca34",
        processed: 32000,
        indexed: 10047,
        integrated: 12492,
    },
    {
        name: "ipns_vo_ahcc/bianca56",
        processed: 32000,
        indexed: 6447,
        integrated: 7907,
    },
    {
        name: "ipns_vo_ahcc/carmen12",
        processed: 27995,
        indexed: 6787,
        integrated: 8388,
    },
    {
        name: "ipns_vo_ahcc/carmen34",
        processed: 32000,
        indexed: 11168,
        integrated: 14000,
    },
    {
        name: "ipns_vo_ahcc/carmen56",
        processed: 32000,
        indexed: 7724,
        integrated: 9608,
    },
    {
        name: "ipns_vo_ahcc/carmen78",
        processed: 32000,
        indexed: 6444,
        integrated: 7880,
    },
    {
        name: "ctx_erta/charge",
        processed: 25600,
        indexed: 4448,
        integrated: 5372,
    },
    {
        name: "ipns_vo_ahcc/denise34",
        processed: 32000,
        indexed: 7174,
        integrated: 8920,
    },
    {
        name: "ipns_vo_ahcc/denise56",
        processed: 32000,
        indexed: 7801,
        integrated: 9840,
    },
    {
        name: "ctx_erta/drizzle",
        processed: 25600,
        indexed: 4233,
        integrated: 5022,
    },
    {
        name: "vioc_glovebox/ecsess",
        processed: 25600,
        indexed: 1538,
        integrated: 1759,
    },
    {
        name: "vioc_vo_sin_arg/emilia34",
        processed: 32000,
        indexed: 2866,
        integrated: 3220,
    },
    {
        name: "vioc_vo_sin_arg/emilia56",
        processed: 32000,
        indexed: 1783,
        integrated: 1975,
    },
    {
        name: "AlkB_vo_4sh/frauke2",
        processed: 28600,
        indexed: 279,
        integrated: 282,
    },
    {
        name: "AlkB_vo_4sh_P41/frauke2",
        processed: 28600,
        indexed: 2376,
        integrated: 2679,
    },
    { name: "plpro/frenzy", processed: 12800, indexed: 665, integrated: 810 },
    {
        name: "AlkB_vo_4sh/gisele",
        processed: 28600,
        indexed: 118,
        integrated: 124,
    },
    {
        name: "AlkB_vo_4sh_P41/gisele",
        processed: 28600,
        indexed: 966,
        integrated: 1035,
    },
    {
        name: "vioc_glovebox_dark/gogain",
        processed: 25600,
        indexed: 1388,
        integrated: 1569,
    },
    {
        name: "AlkB_vo_4sh_P41/hannah",
        processed: 28600,
        indexed: 1779,
        integrated: 1962,
    },
    {
        name: "vioc-80/heroin",
        processed: 25600,
        indexed: 3599,
        integrated: 3978,
    },
    {
        name: "vioc_4deg/idenal",
        processed: 25600,
        indexed: 1615,
        integrated: 1831,
    },
    {
        name: "AlkB_vo_4sh_P41/ilaria",
        processed: 28600,
        indexed: 1869,
        integrated: 2046,
    },
    {
        name: "ipns_vo-acv/jkiller12",
        processed: 32000,
        indexed: 10968,
        integrated: 13885,
    },
    {
        name: "ipns_vo-acv/jkiller34",
        processed: 32000,
        indexed: 6214,
        integrated: 7677,
    },
    {
        name: "ipns_vo-acv/jkiller56",
        processed: 32000,
        indexed: 6585,
        integrated: 8074,
    },
    {
        name: "ipns_vo-acv/jkiller78",
        processed: 32000,
        indexed: 5523,
        integrated: 6540,
    },
    {
        name: "ipns_vo-acv/jublia",
        processed: 15920,
        indexed: 5689,
        integrated: 7131,
    },
    {
        name: "ipns_vo-acv/jublia23",
        processed: 32000,
        indexed: 8735,
        integrated: 11063,
    },
    {
        name: "ipns_vo-acv/jublia45-2",
        processed: 32000,
        indexed: 5690,
        integrated: 7099,
    },
    {
        name: "ipns_vo-acv/jublia67",
        processed: 32000,
        indexed: 5226,
        integrated: 6353,
    },
    {
        name: "ipns_vo-acv/jublia8",
        processed: 16000,
        indexed: 4662,
        integrated: 5872,
    },
    {
        name: "AlkB_vo_2sh_P41/juliet",
        processed: 28600,
        indexed: 3154,
        integrated: 3452,
    },
    {
        name: "AlkB_vo_2sh_P41/katrin",
        processed: 28600,
        indexed: 1644,
        integrated: 1770,
    },
    {
        name: "AlkB_vo_2sh_P41/louise",
        processed: 28600,
        indexed: 734,
        integrated: 787,
    },
    {
        name: "ipns_vo-acv/lyrica",
        processed: 32000,
        indexed: 9792,
        integrated: 12430,
    },
    {
        name: "ipns_vo-acv/lyrica34",
        processed: 32000,
        indexed: 8920,
        integrated: 11503,
    },
    {
        name: "ipns_vo-acv/lyrica56",
        processed: 32000,
        indexed: 4963,
        integrated: 5893,
    },
    {
        name: "ipns_vo-acv/lyrica78",
        processed: 32000,
        indexed: 5104,
        integrated: 6171,
    },
    {
        name: "jvt81_ctrl/malina",
        processed: 11673,
        indexed: 1096,
        integrated: 1178,
    },
    {
        name: "vioc_vo_sin_arg/msmack12",
        processed: 32000,
        indexed: 2848,
        integrated: 3356,
    },
    {
        name: "vioc_vo_sin_arg/msmack34",
        processed: 32000,
        indexed: 2957,
        integrated: 3432,
    },
    {
        name: "vioc_vo_sin_arg/msmack56",
        processed: 32000,
        indexed: 2748,
        integrated: 3239,
    },
    {
        name: "vioc_vo_sin_arg/msmack78",
        processed: 32000,
        indexed: 1460,
        integrated: 1769,
    },
    {
        name: "jvt75_ctrl/natali",
        processed: 10000,
        indexed: 3257,
        integrated: 4336,
    },
    {
        name: "vioc_vo_sin_arg/nbombs12",
        processed: 32000,
        indexed: 1412,
        integrated: 1693,
    },
    {
        name: "vioc_vo_sin_arg/nbombs34",
        processed: 32000,
        indexed: 1294,
        integrated: 1574,
    },
    {
        name: "vioc_vo_sin_arg/nbombs56",
        processed: 32000,
        indexed: 1401,
        integrated: 1660,
    },
    {
        name: "vioc_vo_sin_arg/nbombs78",
        processed: 32000,
        indexed: 2021,
        integrated: 2418,
    },
    {
        name: "jvt81_grease/olivia",
        processed: 10000,
        indexed: 1160,
        integrated: 1212,
    },
    {
        name: "jvt75_grease/pamcla",
        processed: 10000,
        indexed: 2780,
        integrated: 3199,
    },
    {
        name: "vioc_vo_sin_arg/petrol12",
        processed: 32000,
        indexed: 2694,
        integrated: 3293,
    },
    {
        name: "test_scripts/petrol12",
        processed: 32000,
        indexed: 2694,
        integrated: 3293,
    },
    {
        name: "vioc_vo_sin_arg/petrol34",
        processed: 32000,
        indexed: 2463,
        integrated: 2919,
    },
    {
        name: "vioc_vo_sin_arg/petrol56",
        processed: 32000,
        indexed: 3364,
        integrated: 3977,
    },
    {
        name: "vioc_vo_sin_arg/petrol78",
        processed: 32000,
        indexed: 2591,
        integrated: 2981,
    },
    {
        name: "ipns_vo_aahc/qaadka12",
        processed: 32000,
        indexed: 2701,
        integrated: 2926,
    },
    {
        name: "ipns_vo_aahc/qaadka34",
        processed: 32000,
        indexed: 7937,
        integrated: 9869,
    },
    {
        name: "ipns_vo_aahc/qaadka56",
        processed: 32000,
        indexed: 9423,
        integrated: 11872,
    },
    {
        name: "ipns_vo_aahc/qaadka78",
        processed: 32000,
        indexed: 8624,
        integrated: 10846,
    },
    {
        name: "jvt81_lcp/quincy",
        processed: 10000,
        indexed: 793,
        integrated: 821,
    },
    {
        name: "jvt75_lcp/ramona",
        processed: 10000,
        indexed: 3088,
        integrated: 3836,
    },
    {
        name: "ipns_vo_aahc/rolexs12",
        processed: 32000,
        indexed: 10547,
        integrated: 13136,
    },
    {
        name: "ipns_vo_aahc/rolexs34",
        processed: 32000,
        indexed: 7873,
        integrated: 9663,
    },
    {
        name: "ipns_vo_aahc/rolexs56",
        processed: 32000,
        indexed: 6763,
        integrated: 8386,
    },
    {
        name: "ipns_vo_aahc/rolexs78",
        processed: 32000,
        indexed: 6064,
        integrated: 7418,
    },
    {
        name: "ipns_vo_aahc/salvia12",
        processed: 32000,
        indexed: 11040,
        integrated: 13716,
    },
    {
        name: "ipns_vo_aahc/salvia34",
        processed: 32000,
        indexed: 8315,
        integrated: 10371,
    },
    {
        name: "ipns_vo_aahc/salvia56",
        processed: 32000,
        indexed: 5065,
        integrated: 6044,
    },
    {
        name: "ipns_vo_aahc/salvia78",
        processed: 32000,
        indexed: 4485,
        integrated: 5257,
    },
    { name: "mpro/sophie", processed: 20000, indexed: 56, integrated: 57 },
    {
        name: "vioc_vo_4sh/tramal12",
        processed: 31995,
        indexed: 2119,
        integrated: 2389,
    },
    {
        name: "vioc_vo_4sh/tramal34",
        processed: 32000,
        indexed: 2466,
        integrated: 2711,
    },
    {
        name: "vioc_vo_4sh/tramal56",
        processed: 32000,
        indexed: 3207,
        integrated: 3520,
    },
    {
        name: "vioc_vo_4sh/tramal78",
        processed: 32000,
        indexed: 2782,
        integrated: 3000,
    },
    {
        name: "vioc_vo_4sh/ultram12",
        processed: 32000,
        indexed: 1686,
        integrated: 1816,
    },
    {
        name: "vioc_vo_4sh/ultram34",
        processed: 32000,
        indexed: 1926,
        integrated: 2092,
    },
    {
        name: "vioc_vo_4sh/ultram56",
        processed: 32000,
        indexed: 2177,
        integrated: 2378,
    },
    {
        name: "vioc_vo_4sh/ultram78",
        processed: 32000,
        indexed: 1594,
        integrated: 1737,
    },
    {
        name: "vioc_vo_4sh/valium12",
        processed: 32000,
        indexed: 1387,
        integrated: 1544,
    },
    {
        name: "vioc_vo_4sh/valium34",
        processed: 32000,
        indexed: 1124,
        integrated: 1273,
    },
    {
        name: "vioc_vo_4sh/valium56",
        processed: 32000,
        indexed: 1750,
        integrated: 1914,
    },
    {
        name: "vioc_vo_4sh/valium78",
        processed: 32000,
        indexed: 1319,
        integrated: 1439,
    },
    {
        name: "ipns_vo_asv/window12",
        processed: 32000,
        indexed: 11283,
        integrated: 14760,
    },
    {
        name: "ipns_vo_asv/window34",
        processed: 32000,
        indexed: 8130,
        integrated: 10269,
    },
    {
        name: "ipns_vo_asv/window56",
        processed: 32000,
        indexed: 9700,
        integrated: 12454,
    },
    {
        name: "ipns_vo_asv/window78",
        processed: 32000,
        indexed: 6060,
        integrated: 7439,
    },
    {
        name: "ipns_vo_asv/xanaxs12",
        processed: 32000,
        indexed: 6325,
        integrated: 7845,
    },
    {
        name: "ipns_vo_asv/xanaxs34",
        processed: 32000,
        indexed: 6816,
        integrated: 8561,
    },
    {
        name: "ipns_vo_asv/xanaxs56",
        processed: 32000,
        indexed: 7109,
        integrated: 9003,
    },
    {
        name: "ipns_vo_asv/xanaxs78",
        processed: 32000,
        indexed: 4644,
        integrated: 5459,
    },
    {
        name: "vioc_vo_2sh/yasmin12",
        processed: 32000,
        indexed: 2936,
        integrated: 3475,
    },
    {
        name: "vioc_vo_2sh/yasmin34",
        processed: 32000,
        indexed: 2844,
        integrated: 3407,
    },
    {
        name: "vioc_vo_2sh/yasmin56",
        processed: 31342,
        indexed: 3237,
        integrated: 3947,
    },
    {
        name: "vioc_vo_2sh/yasmin78",
        processed: 32000,
        indexed: 2468,
        integrated: 2873,
    },
    {
        name: "vioc_vo_2sh/zoloft12",
        processed: 32000,
        indexed: 2576,
        integrated: 3048,
    },
    {
        name: "vioc_vo_2sh/zoloft34",
        processed: 32000,
        indexed: 3640,
        integrated: 4316,
    },
    {
        name: "vioc_vo_2sh/zoloft56",
        processed: 32000,
        indexed: 2620,
        integrated: 3064,
    },
    {
        name: "vioc_vo_2sh/zoloft78",
        processed: 32000,
        indexed: 3982,
        integrated: 4839,
    },
];

export default example_processes;
