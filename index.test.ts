import {url, getFile, parseConvars} from './index';
import {expect, test, describe} from 'bun:test';

test('Get data from url', async () => {
    const data = await getFile(url);
    expect(data).toBeDefined();
    }
);

describe('Parse convars', () => {
    test('Parse convars with all parts', async () => {
        // example convar with all parts
        const data = `0x00007FFDA86494E0 "ai_current_enemy_bonus" "15" - The AI's current enemy is given a bonus distance heuristic so that he is likely to pick them again 0x00000004`
        const convars = await parseConvars(data);
        expect(convars).toBeDefined();
    });

    test('Parse convars with no value', async () => {
        // example convar with no value
        const data = `0x00007FFDC775CD80 "demos" - Demo demo file sequence. 0x00000000`
        const convars = await parseConvars(data);
        expect(convars).toBeDefined();
    });

    test('Parse convars with no description', async () => {
        // example convar with no description
        const data = `0x000002079CCCCF40 "dof_enable" "1" -  0x00000008`
        const convars = await parseConvars(data);
        expect(convars).toBeDefined();
    });

    test('Parse convars with no value and no description', async () => {
        // example convar with no value and no description
        const data = `0x000002079BD18A90 "+break" -  0x00000008`
        const convars = await parseConvars(data);
        expect(convars).toBeDefined();
    });

    test('Parse convars with a new line in the description', async () => {
        // example convar with a new line in the description
        const data = `0x00007FFDC775DD40 "cache_print" - cache_print [section]
Print out contents of cache memory. 0x00000000`
        const convars = await parseConvars(data);
        expect(convars).toBeDefined();
    });

    test('Parse convars with multiple new lines in the description', async () => {
        // example convar with a new line in the description
        const data = `0x000002079D228FB0 "cl_find_ent" - Find and list all client entities with classnames that contain the specified substring.
Format: cl_find_ent <substring>
 0x00004008`
        const convars = await parseConvars(data);
        expect(convars).toBeDefined();
    });

    test('Return json data', async () => {
        const data = await getFile(url);
        const convars = await parseConvars(data, 'json');
        expect(Array.isArray(JSON.parse(convars))).toBe(true)
    })
});

describe('Test Data', () => {
    test('Parse convars with all parts', async () => {
        // example convar with all parts
        const data = `0x00007FFDA86494E0 "ai_current_enemy_bonus" "15" - The AI's current enemy is given a bonus distance heuristic so that he is likely to pick them again 0x00000004`
        const convars = await parseConvars(data, 'json');
        expect(JSON.parse(convars)).toEqual(
            [
                {
                    address: '0x00007FFDA86494E0',
                    name: 'ai_current_enemy_bonus',
                    value: '15',
                    description: "The AI's current enemy is given a bonus distance heuristic so that he is likely to pick them again",
                    end_address: '0x00000004'
                }
            ]
        );
    });

    test('Parse convars with no value', async () => {
        // example convar with no value
        const data = `0x00007FFDC775CD80 "demos" - Demo demo file sequence. 0x00000000`
        const convars = await parseConvars(data, 'json');
        expect(JSON.parse(convars)).toEqual(
            [
                {
                    address: '0x00007FFDC775CD80',
                    name: 'demos',
                    value: '',
                    description: 'Demo demo file sequence.',
                    end_address: '0x00000000'
                }
            ]
        );
    });

    test('Parse convars with no description', async () => {
        // example convar with no description
        const data = `0x000002079CCCCF40 "dof_enable" "1" -  0x00000008`
        const convars = await parseConvars(data, 'json');
        expect(JSON.parse(convars)).toEqual(
            [
                {
                    address: '0x000002079CCCCF40',
                    name: 'dof_enable',
                    value: '1',
                    description: '',
                    end_address: '0x00000008'
                }
            ]
        );
    });

    test('Parse convars with no value and no description', async () => {
        // example convar with no value and no description
        const data = `0x000002079BD18A90 "+break" -  0x00000008`
        const convars = await parseConvars(data, 'json');
        expect(JSON.parse(convars)).toEqual(
            [
                {
                    address: '0x000002079BD18A90',
                    name: '+break',
                    value: '',
                    description: '',
                    end_address: '0x00000008'
                }
            ]
        );
    });

    test('Parse convars with a new line in the description', async () => {
        // example convar with a new line in the description
        const data = `0x00007FFDC775DD40 "cache_print" - cache_print [section]
Print out contents of cache memory. 0x00000000`
        const convars = await parseConvars(data, 'json');
        expect(JSON.parse(convars)).toEqual(
            [
                {
                    address: '0x00007FFDC775DD40',
                    name: 'cache_print',
                    value: '',
                    description: 'cache_print [section]\nPrint out contents of cache memory.',
                    end_address: '0x00000000'
                }
            ]
        );
    });

    test('Parse convars with multiple new lines in the description', async () => {
        // example convar with a new line in the description
        const data = `0x000002079D228FB0 "cl_find_ent" - Find and list all client entities with classnames that contain the specified substring.
Format: cl_find_ent <substring>
 0x00004008`
        const convars = await parseConvars(data, 'json');
        expect(JSON.parse(convars)).toEqual(
            [  
                {
                    address: '0x000002079D228FB0',
                    name: 'cl_find_ent',
                    value: '',
                    description: 'Find and list all client entities with classnames that contain the specified substring.\nFormat: cl_find_ent <substring>\n',
                    end_address: '0x00004008'
                }
            ]
        );
    });
});