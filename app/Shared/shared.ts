import Group from 'App/Models/Group';

export class Shared {

}

export function hasGroup (groups: Group[], groupName: string | string[]): boolean {
    const toCheck: string[] = [];

    if (typeof groupName === 'string') {
        toCheck.push (groupName);
    } else {
        toCheck.concat (groupName);
    }

    return groups.filter (group => {
        for (let i = 0; i < groupName.length; i++) {
            if (group.name === groupName[ i ]) {
                return true;
            }
        }
        return false;
    }).length > 0;
}
